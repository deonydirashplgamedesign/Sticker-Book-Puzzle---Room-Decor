import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');
const HTML_PATH = path.join(DIST_DIR, 'index.html');
const PUBLIC_ASSETS_DIR = path.resolve('public', 'assets');

const NETWORKS = [
    { name: 'Applovin', tag: 'al', mraid: true, included: true },
    { name: 'Google', tag: 'gg', extraHead: '<script src="https://tpc.googlesyndication.com/pagead/gadgets/html5/api/exitapi.js"></script>', included: true },
    { name: 'Ironsource', tag: 'is', mraid: true, included: true },
    { name: 'Mintegral', tag: 'mtg', bodyAttr: ' onload="gameReady()"', included: true },
    { name: 'Facebook', tag: 'fb', included: true },
    { name: 'Unity', tag: 'un', mraid: true, included: true },
    { name: 'Vungle', tag: 'vu', extraHead: '<script>window.__VUNGLE__=true;</script>', included: true },
    { name: 'Moloco', tag: 'mo', included: true },
    { name: 'TikTok', tag: 'tt', extraHead: '<script>window.__TIKTOK__=true;</script>', included: false }
];

const ITERATIONS = [
    { name: '10clicks', mode: 'click-limit', label: '10 Clicks', suffix: '10clicks' },
    { name: '60sec', mode: 'time-limit', label: '60 Seconds', suffix: '60sec' },
    { name: 'full', mode: 'full', label: 'Full Gameplay', suffix: 'full' }
];

const OUTPUT_PREFIX = 'sbp_mip_local_roomdecor_01_real_na_noseason_en_full_na';

function readUtf8 (filePath)
{
    return fs.readFileSync(filePath, 'utf8');
}

function toPosixPath (filePath)
{
    return filePath.split(path.sep).join('/');
}

function getMimeType (filePath)
{
    const extension = path.extname(filePath).toLowerCase();

    switch (extension)
    {
        case '.png':
            return 'image/png';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.gif':
            return 'image/gif';
        case '.webp':
            return 'image/webp';
        case '.mp3':
            return 'audio/mpeg';
        case '.wav':
            return 'audio/wav';
        default:
            return 'application/octet-stream';
    }
}

function walkFiles (dir)
{
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];

    for (const entry of entries)
    {
        const entryPath = path.join(dir, entry.name);

        if (entry.isDirectory())
        {
            files.push(...walkFiles(entryPath));
        }
        else if (entry.isFile())
        {
            files.push(entryPath);
        }
    }

    return files;
}

function buildInlineAssetManifest ()
{
    if (!fs.existsSync(PUBLIC_ASSETS_DIR))
    {
        return {};
    }

    return walkFiles(PUBLIC_ASSETS_DIR).reduce((manifest, filePath) => {
        const key = toPosixPath(path.relative(PUBLIC_ASSETS_DIR, filePath));

        if (/^Sprites\/ref(?: 1)?\.webp$/i.test(key))
        {
            return manifest;
        }

        const mimeType = getMimeType(filePath);
        const encoded = fs.readFileSync(filePath).toString('base64');
        manifest[key] = `data:${mimeType};base64,${encoded}`;
        return manifest;
    }, {});
}

function injectInlineAssetManifest (html)
{
    const manifest = buildInlineAssetManifest();
    const script = `<script>window.__INLINE_ASSETS__=${JSON.stringify(manifest)};</script>`;

    return html.replace('</head>', `${script}\n</head>`);
}

function inlineHtmlAssets (html)
{
    let output = html;

    output = output.replace(/<script\s+type="module"\s+crossorigin\s+src="\.\/([^"]+)"><\/script>/g, (_match, src) => {
        const js = readUtf8(path.join(DIST_DIR, src));
        return `<script>\n${js}\n</script>`;
    });

    output = output.replace(/<script\s+type="module"\s+src="\.\/([^"]+)"><\/script>/g, (_match, src) => {
        const js = readUtf8(path.join(DIST_DIR, src));
        return `<script>\n${js}\n</script>`;
    });

    output = output.replace(/<link\s+rel="stylesheet"\s+href="\.\/([^"]+)">/g, (_match, href) => {
        const css = readUtf8(path.join(DIST_DIR, href));
        return `<style>\n${css}\n</style>`;
    });

    output = output.replace(/<link\s+rel="icon"[^>]*>\s*/g, '');
    output = output.replace(/\s+crossorigin/g, '');
    output = output.replace(/<link\s+rel="modulepreload"[^>]*>\s*/g, '');

    return output;
}

function prepareNetworkHtml (baseHtml, network)
{
    const comment = `<!-- ad-network: ${network.name} | ${network.tag} -->\n`;
    const metadata = `<script>window.__AD_NETWORK__=${JSON.stringify({
        name: network.name,
        tag: network.tag,
        mraid: !!network.mraid
    })};</script>`;
    const headInjection = [
        metadata,
        network.mraid ? '<script src="mraid.js"></script>' : '',
        network.extraHead || ''
    ].filter(Boolean).join('\n');

    let html = baseHtml;

    if (headInjection)
    {
        html = html.replace('<head>', `<head>\n${headInjection}`);
    }

    if (network.bodyAttr)
    {
        html = html.replace('<body>', `<body${network.bodyAttr}>`);
    }

    if (network.tag === 'un')
    {
        html = html.replaceAll('window.top', 'window.self');
    }

    return comment + html.replace(/^<!-- ad-network:[\s\S]*?-->\n?/, '');
}

function prepareIterationHtml (baseHtml, iteration)
{
    const comment = `<!-- playable-iteration: ${iteration.label} | ${iteration.mode} -->\n`;
    const metadata = `<script>window.__PLAYABLE_ITERATION__=${JSON.stringify({
        name: iteration.name,
        mode: iteration.mode,
        label: iteration.label
    })};</script>`;

    const html = baseHtml.replace('<head>', `<head>\n${metadata}`);
    return comment + html.replace(/^<!-- playable-iteration:[\s\S]*?-->\n?/, '');
}

function writeNetworkOutputs (baseHtml)
{
    const fullDir = path.join(DIST_DIR, 'full');
    fs.mkdirSync(fullDir, { recursive: true });

    for (const network of NETWORKS.filter((item) => item.included))
    {
        const networkDir = path.join(fullDir, network.name);
        fs.mkdirSync(networkDir, { recursive: true });

        const filename = `${OUTPUT_PREFIX}_${network.tag}.html`;
        fs.writeFileSync(path.join(networkDir, filename), prepareNetworkHtml(baseHtml, network));
    }
}

function writeIterationOutputs (baseHtml)
{
    const iterationsDir = path.join(DIST_DIR, 'iterations');
    fs.mkdirSync(iterationsDir, { recursive: true });

    for (const iteration of ITERATIONS)
    {
        const filename = `${OUTPUT_PREFIX}_${iteration.suffix}.html`;
        fs.writeFileSync(path.join(iterationsDir, filename), prepareIterationHtml(baseHtml, iteration));
    }
}

const rawHtml = readUtf8(HTML_PATH);
const inlinedHtml = injectInlineAssetManifest(inlineHtmlAssets(rawHtml));
const defaultHtml = prepareIterationHtml(inlinedHtml, ITERATIONS[2]);

fs.writeFileSync(HTML_PATH, defaultHtml);
writeIterationOutputs(inlinedHtml);
writeNetworkOutputs(inlinedHtml);

console.log('Playable HTML iterations written to dist/iterations.');
console.log('Playable network variants written to dist/full.');

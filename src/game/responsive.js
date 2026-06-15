export const REF_WIDTH = 1080;
export const REF_HEIGHT = 1920;

const RETRY_DELAYS = [100, 300, 600];
const CANVAS_BLEED_PX = 24;

export function getViewportSize()
{
    const width = Math.max(1, Math.round(window.innerWidth));
    const height = Math.max(1, Math.round(window.innerHeight));
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    return {
        cssWidth: width,
        cssHeight: height,
        pixelWidth: Math.round(width * dpr),
        pixelHeight: Math.round(height * dpr),
        dpr
    };
}

export function getResponsiveLayout(width, height)
{
    const s = Math.min(width / REF_WIDTH, height / REF_HEIGHT);
    const offX = (width - REF_WIDTH * s) / 2;
    const offY = (height - REF_HEIGHT * s) / 2;

    return {
        s,
        offX,
        offY,
        sx: (x) => offX + x * s,
        sy: (y) => 0 + y * s,
        sd: (value) => value * s
    };
}

export function resizeGameToViewport(game)
{
    const viewport = getViewportSize();
    const canvas = game.canvas;
    const cssWidth = viewport.cssWidth + CANVAS_BLEED_PX * 2;
    const cssHeight = viewport.cssHeight + CANVAS_BLEED_PX * 2;
    const pixelWidth = Math.round(cssWidth * viewport.dpr);
    const pixelHeight = Math.round(cssHeight * viewport.dpr);

    if (canvas)
    {
        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;
        canvas.style.marginLeft = `${-CANVAS_BLEED_PX}px`;
        canvas.style.marginTop = `${-CANVAS_BLEED_PX}px`;
        canvas.style.backgroundColor = '#ffffff';
        canvas.style.display = 'block';
    }

    if (game.scale.width !== pixelWidth || game.scale.height !== pixelHeight)
    {
        game.scale.resize(pixelWidth, pixelHeight);
    }

    return {
        ...viewport,
        visiblePixelWidth: viewport.pixelWidth,
        visiblePixelHeight: viewport.pixelHeight,
        bleedPixelX: Math.round(CANVAS_BLEED_PX * viewport.dpr),
        bleedPixelY: Math.round(CANVAS_BLEED_PX * viewport.dpr),
        pixelWidth,
        pixelHeight
    };
}

export function bindResponsiveResize(game, onResize)
{
    let rafId = 0;
    const run = () => {
        rafId = 0;
        const viewport = resizeGameToViewport(game);
        onResize?.(viewport);
    };
    const schedule = () => {
        if (rafId)
        {
            cancelAnimationFrame(rafId);
        }

        rafId = requestAnimationFrame(run);
    };

    window.addEventListener('resize', schedule);

    for (const delay of RETRY_DELAYS)
    {
        window.setTimeout(schedule, delay);
    }

    schedule();

    return () => {
        if (rafId)
        {
            cancelAnimationFrame(rafId);
        }

        window.removeEventListener('resize', schedule);
    };
}

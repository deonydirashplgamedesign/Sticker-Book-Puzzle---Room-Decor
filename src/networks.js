import { CTA_FALLBACK_URL } from './constants';

let mraidReadyPromise = null;
let mraidReady = false;
let mraidViewable = true;
let mraidVolume = null;
const lifecycleScenes = new Set();
const MRAID_NETWORK_TAGS = new Set(['al', 'is', 'un', 'mo']);

function safeCall (fn)
{
    try
    {
        fn();
        return true;
    }
    catch (error)
    {
        console.warn('[Playable SDK]', error);
        return false;
    }
}

function getMraid ()
{
    return typeof window.mraid !== 'undefined' ? window.mraid : null;
}

function getNetworkTag ()
{
    return window.__AD_NETWORK__?.tag || '';
}

function getCtaUrl ()
{
    return window.clickTag || CTA_FALLBACK_URL;
}

function callExitApi ()
{
    return !!window.ExitApi?.exit && safeCall(() => window.ExitApi.exit());
}

function callFacebookCta ()
{
    return !!window.FbPlayableAd?.onCTAClick && safeCall(() => window.FbPlayableAd.onCTAClick());
}

function callLunaInstall ()
{
    return !!window.Luna?.Unity?.Playable?.InstallFullGame && safeCall(() => window.Luna.Unity.Playable.InstallFullGame());
}

function callPlayableSdk ()
{
    return !!window.playableSDK?.openAppStore && safeCall(() => window.playableSDK.openAppStore());
}

function callInstall ()
{
    return typeof window.install === 'function' && safeCall(() => window.install());
}

function callOpenAppStore ()
{
    return typeof window.openAppStore === 'function' && safeCall(() => window.openAppStore());
}

function callVungleDownload ()
{
    return !!window.__VUNGLE__ && safeCall(() => window.parent?.postMessage('download', '*'));
}

function callClickTagBlank (url)
{
    return !!window.clickTag && safeCall(() => window.open(url, '_blank'));
}

function callMraidOpen (url)
{
    const mraid = getMraid();
    const mraidState = typeof mraid?.getState === 'function' ? mraid.getState() : 'ready';

    if (!mraid?.open || mraidState === 'loading')
    {
        return false;
    }

    return safeCall(() => {
        if (url && url !== CTA_FALLBACK_URL)
        {
            mraid.open(url);
        }
        else
        {
            mraid.open();
        }
    });
}

function callFallbackBlank (url)
{
    return safeCall(() => window.open(url, '_blank'));
}

function setupMraidListeners ()
{
    const mraid = getMraid();
    if (!mraid?.addEventListener)
    {
        return;
    }

    if (typeof mraid.isViewable === 'function')
    {
        mraidViewable = !!mraid.isViewable();
        applyLifecycleState();
    }

    mraid.addEventListener('error', (message, action) => {
        console.warn('[MRAID error]', { message, action });
    });

    mraid.addEventListener('stateChange', (state) => {
        console.log('[MRAID stateChange]', state);
    });

    mraid.addEventListener('exposureChange', (exposedPercentage) => {
        if (typeof exposedPercentage === 'number')
        {
            mraidViewable = exposedPercentage > 0;
            applyLifecycleState();
        }
    });

    mraid.addEventListener('viewableChange', (viewable) => {
        mraidViewable = !!viewable;
        applyLifecycleState();
    });

    mraid.addEventListener('audioVolumeChange', (pct) => {
        if (typeof pct !== 'number')
        {
            return;
        }

        mraidVolume = pct / 100;
        for (const scene of lifecycleScenes)
        {
            scene.sound?.setVolume(mraidVolume);
        }
    });
}

function applyLifecycleState ()
{
    for (const scene of lifecycleScenes)
    {
        const shouldPause = document.hidden || !mraidViewable;

        if (shouldPause)
        {
            scene.scene?.pause();
            scene.sound?.setMute(true);
        }
        else
        {
            scene.scene?.resume();
            scene.sound?.setMute(false);
            if (typeof mraidVolume === 'number')
            {
                scene.sound?.setVolume(mraidVolume);
            }
        }
    }
}

function waitForMraidObject (detectTimeoutMs)
{
    if (getMraid())
    {
        return Promise.resolve(getMraid());
    }

    return new Promise((resolve) => {
        const startedAt = Date.now();
        const tick = () => {
            const mraid = getMraid();
            if (mraid || Date.now() - startedAt >= detectTimeoutMs)
            {
                resolve(mraid);
                return;
            }

            window.setTimeout(tick, 50);
        };

        tick();
    });
}

export async function initMraid (timeoutMs = 2000, detectTimeoutMs = 500)
{
    if (mraidReadyPromise)
    {
        return mraidReadyPromise;
    }

    mraidReadyPromise = waitForMraidObject(detectTimeoutMs).then((mraid) => new Promise((resolve) => {
        if (!mraid)
        {
            resolve(false);
            return;
        }

        const finish = () => {
            if (mraidReady)
            {
                return;
            }

            mraidReady = true;
            setupMraidListeners();
            resolve(true);
        };

        const state = typeof mraid.getState === 'function' ? mraid.getState() : 'ready';
        if (state !== 'loading')
        {
            finish();
            return;
        }

        if (typeof mraid.addEventListener === 'function')
        {
            mraid.addEventListener('ready', finish);
        }

        window.setTimeout(finish, timeoutMs);
    }));

    return mraidReadyPromise;
}

export function bindLifecycle (scene)
{
    lifecycleScenes.add(scene);
    applyLifecycleState();

    const onVisibility = () => applyLifecycleState();
    document.addEventListener('visibilitychange', onVisibility);

    const onMessage = (event) => {
        if (event.data === 'onPause')
        {
            scene.scene?.pause();
            scene.sound?.setMute(true);
        }
        else if (event.data === 'onResume')
        {
            scene.scene?.resume();
            scene.sound?.setMute(false);
        }
    };
    window.addEventListener('message', onMessage);

    const mute = () => scene.sound?.setMute(true);
    const unmute = () => scene.sound?.setMute(false);
    const pause = () => scene.scene?.pause();
    const resume = () => scene.scene?.resume();
    window.addEventListener('luna:mute', mute);
    window.addEventListener('luna:unmute', unmute);
    window.addEventListener('luna:pause', pause);
    window.addEventListener('luna:resume', resume);
    window.addEventListener('ad-event-pause', pause);
    window.addEventListener('ad-event-resume', resume);

    scene.events.once('shutdown', () => {
        lifecycleScenes.delete(scene);
        document.removeEventListener('visibilitychange', onVisibility);
        window.removeEventListener('message', onMessage);
        window.removeEventListener('luna:mute', mute);
        window.removeEventListener('luna:unmute', unmute);
        window.removeEventListener('luna:pause', pause);
        window.removeEventListener('luna:resume', resume);
        window.removeEventListener('ad-event-pause', pause);
        window.removeEventListener('ad-event-resume', resume);
    });
}

export function notifyGameReady ()
{
    window.gameReady?.();
}

export function notifyGameStart ()
{
    window.gameStart?.();
}

export function notifyGameEnd ()
{
    window.gameEnd?.();
}

export function notifyGameClose ()
{
    window.gameClose?.();
}

export function triggerCTA ()
{
    const url = getCtaUrl();
    const networkTag = getNetworkTag();
    notifyGameClose();

    const preferredHandlers = {
        gg: [callExitApi, callClickTagBlank],
        fb: [callFacebookCta, callClickTagBlank],
        mtg: [callInstall, callOpenAppStore, callClickTagBlank],
        vu: [callVungleDownload, callClickTagBlank],
        tt: [callPlayableSdk, callOpenAppStore, callClickTagBlank]
    }[networkTag] || (MRAID_NETWORK_TAGS.has(networkTag)
        ? [callLunaInstall, callMraidOpen, callClickTagBlank]
        : []);

    const fallbackHandlers = [
        callExitApi,
        callFacebookCta,
        callLunaInstall,
        callPlayableSdk,
        callInstall,
        callOpenAppStore,
        callVungleDownload,
        callMraidOpen,
        callClickTagBlank,
        callFallbackBlank
    ];

    for (const handler of [...preferredHandlers, ...fallbackHandlers])
    {
        if (handler(url))
        {
            return;
        }
    }
}

initMraid();

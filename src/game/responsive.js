export const REF_WIDTH = 1080;
export const REF_HEIGHT = 1920;

const RETRY_DELAYS = [100, 300, 600];

export function getViewportSize()
{
    const visualViewport = window.visualViewport;
    const width = Math.max(1, Math.round(visualViewport?.width ?? window.innerWidth));
    const height = Math.max(1, Math.round(visualViewport?.height ?? window.innerHeight));
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

    if (canvas)
    {
        canvas.style.width = `${viewport.cssWidth}px`;
        canvas.style.height = `${viewport.cssHeight}px`;
        canvas.style.backgroundColor = '#ffffff';
        canvas.style.display = 'block';
    }

    if (game.scale.width !== viewport.pixelWidth || game.scale.height !== viewport.pixelHeight)
    {
        game.scale.resize(viewport.pixelWidth, viewport.pixelHeight);
    }

    return viewport;
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
    window.visualViewport?.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('scroll', schedule);

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
        window.visualViewport?.removeEventListener('resize', schedule);
        window.visualViewport?.removeEventListener('scroll', schedule);
    };
}

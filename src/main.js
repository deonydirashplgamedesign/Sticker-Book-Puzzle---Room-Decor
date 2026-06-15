import StartGame from './game/main';
import { initMraid, notifyGameReady } from './networks';

function exposeLifecycleStubs ()
{
    window.__playableLifecycle = window.__playableLifecycle || {};

    window.gameReady = window.gameReady || (() => {
        window.__playableLifecycle.ready = true;
    });

    window.gameStart = window.gameStart || (() => {
        window.__playableLifecycle.started = true;
    });

    window.gameEnd = window.gameEnd || (() => {
        window.__playableLifecycle.ended = true;
    });

    window.gameClose = window.gameClose || (() => {
        window.__playableLifecycle.closed = true;
    });
}

async function boot ()
{
    exposeLifecycleStubs();
    await initMraid();

    document.documentElement.style.backgroundColor = '#ffffff';
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';

    let container = document.getElementById('game-container');
    if (!container)
    {
        container = document.createElement('div');
        container.id = 'game-container';
        document.body.appendChild(container);
    }
    container.style.backgroundColor = '#ffffff';

    StartGame(container);
    notifyGameReady();
}

if (document.readyState === 'loading')
{
    document.addEventListener('DOMContentLoaded', boot, { once: true });
}
else
{
    boot();
}

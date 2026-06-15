export function trackEvent (eventName)
{
    const win = window;

    if (win.ALPlayableAnalytics?.trackEvent)
    {
        win.ALPlayableAnalytics.trackEvent(eventName);
        return;
    }

    if (win.playableSDK?.reportEvent)
    {
        win.playableSDK.reportEvent(eventName);
        return;
    }

    console.log('[Analytics]', eventName);
}

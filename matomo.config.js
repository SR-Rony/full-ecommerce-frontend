import { createInstance } from "@datapunt/matomo-tracker-react";

export const matomoConfig = {
    urlBase: `https://demo-analytics.ccoxy.com`,
    siteId: 1,
    //userId: "UID76903202", // optional, default value: `undefined`.
    //srcUrl: "https://LINK.TO.DOMAIN/tracking.js", // optional, default value: `${urlBase}matomo.js`
    disabled: false, // optional, false by default. Makes all tracking calls no-ops if set to true.
    heartBeat: {
      // optional, enabled by default
      active: true, // optional, default value: true
      seconds: 10, // optional, default value: `15
    },
    linkTracking: false, // optional, default value: true
    configurations: {
      // optional, default value: {}
      // any valid matomo configuration, all below are optional
      disableCookies: true,
      setSecureCookie: true,
      setRequestMethod: "POST",
    },
};
export const matomoInstance = createInstance(matomoConfig);
# SSGPT6 Earthquake Connect — Static Reference Package

**Status:** Standalone static prototype. Deployment and operational readiness are not verified.

This package separates four views:

1. **USGS observations:** User-requested load of the USGS all-day GeoJSON feed, with provider attribution, source event time, safe text rendering, and explicit error/empty states.
2. **GNAIAAAC research:** Unavailable until an authorized first-party source, schema, provenance, and validation evidence are provided.
3. **Long-horizon research:** No forecasts or outlook values are generated. A research model and independent evaluation have not been supplied.
4. **Weather/simulation:** No weather source, sensors, map tiles, GPS service, or synthetic records are connected.

The USGS feed is an observation catalog, not a prediction or warning service. The page does not determine safety, issue alerts, collect location, connect to actuators, or authenticate users. A feed failure has no cached or synthetic fallback.

## Files

- `index.html` — accessible four-window interface and safety boundaries
- `styles.css` — responsive visual layout
- `app.js` — optional user-triggered USGS feed request and client-side location search

No analytics ID, project ID, API key, backend, package installation, or host-specific configuration is included. To host this directory, configure a verified hosting project separately and review its access, domain, DNS, TLS, privacy, and publication settings. Do not infer a successful deployment from this package.

The archived ZIP, DOCX, and PDF mentioned in conversation were not available in this repository; this is a fresh package based on the supplied summary, not a recovered archive.

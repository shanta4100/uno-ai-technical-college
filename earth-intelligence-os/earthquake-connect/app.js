(() => {
  "use strict";

  const feedUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
  const feedStatus = document.getElementById("feed-status");
  const feedMessage = document.getElementById("feed-message");
  const eventRows = document.getElementById("event-rows");
  const searchInput = document.getElementById("event-search");
  const refreshButton = document.getElementById("refresh-feed");
  const retrievedAt = document.getElementById("retrieved-at");
  let events = [];

  function setStatus(state, text) {
    feedStatus.dataset.state = state;
    feedStatus.textContent = text;
  }

  function createCell(value) {
    const cell = document.createElement("td");
    cell.textContent = value;
    return cell;
  }

  function eventDetailLink(url) {
    if (typeof url !== "string") return null;
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "https:" || parsed.hostname !== "earthquake.usgs.gov") return null;
      return parsed.href;
    } catch {
      return null;
    }
  }

  function validFeature(feature) {
    const properties = feature && feature.properties;
    const coordinates = feature && feature.geometry && feature.geometry.coordinates;
    return Boolean(
      feature
      && typeof feature.id === "string"
      && properties
      && Number.isFinite(properties.time)
      && Number.isFinite(new Date(properties.time).getTime())
      && (properties.mag === null
        || typeof properties.mag === "undefined"
        || Number.isFinite(properties.mag))
      && (properties.place === null || typeof properties.place === "string")
      && Array.isArray(coordinates)
      && Number.isFinite(coordinates[0])
      && Number.isFinite(coordinates[1])
      && coordinates[0] >= -180 && coordinates[0] <= 180
      && coordinates[1] >= -90 && coordinates[1] <= 90
    );
  }

  function renderEvents() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    const visibleEvents = events.filter(event => {
      const place = event.properties.place || "";
      return place.toLocaleLowerCase().includes(query);
    });
    const fragment = document.createDocumentFragment();

    if (visibleEvents.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 3;
      cell.textContent = events.length === 0
        ? "No events returned for this USGS feed window — this does not establish safety."
        : "No events match this search.";
      row.append(cell);
      fragment.append(row);
      eventRows.replaceChildren(fragment);
      return;
    }

    for (const event of visibleEvents) {
      const row = document.createElement("tr");
      const magnitude = event.properties.mag === null
        ? "Not reported"
        : Number(event.properties.mag).toFixed(1);
      const locationCell = createCell(event.properties.place || "Not reported");
      const detailUrl = eventDetailLink(event.properties.url);

      if (detailUrl) {
        const link = document.createElement("a");
        link.href = detailUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = locationCell.textContent;
        locationCell.replaceChildren(link);
      }

      row.append(
        createCell(magnitude),
        locationCell,
        createCell(new Date(event.properties.time).toISOString())
      );
      fragment.append(row);
    }

    eventRows.replaceChildren(fragment);
  }

  async function loadFeed() {
    refreshButton.disabled = true;
    setStatus("loading", "Loading");
    feedMessage.textContent = "Requesting the USGS all-day feed. No substitute data will be shown if it fails.";
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(feedUrl, {
        method: "GET",
        headers: { Accept: "application/geo+json, application/json" },
        redirect: "error",
        cache: "no-store",
        signal: controller.signal
      });

      if (!response.ok) throw new Error(`USGS returned HTTP ${response.status}.`);
      if (new URL(response.url).hostname !== "earthquake.usgs.gov") {
        throw new Error("The response URL did not match the approved USGS hostname.");
      }

      const data = await response.json();
      if (!data || data.type !== "FeatureCollection" || !Array.isArray(data.features)) {
        throw new Error("The USGS response did not match the expected GeoJSON FeatureCollection schema.");
      }

      const validEvents = data.features.filter(validFeature);
      const rejectedCount = data.features.length - validEvents.length;
      events = validEvents;
      renderEvents();
      const retrieved = new Date();
      retrievedAt.dateTime = retrieved.toISOString();
      retrievedAt.textContent = retrieved.toISOString();
      setStatus("loaded", "Provider data loaded");
      feedMessage.textContent = rejectedCount
        ? `${validEvents.length} valid provider records loaded; ${rejectedCount} invalid record(s) were excluded.`
        : `${validEvents.length} provider record(s) loaded. Values may be revised by USGS.`;
    } catch (error) {
      events = [];
      renderEvents();
      setStatus("unavailable", "Source unavailable");
      feedMessage.textContent = error && error.name === "AbortError"
        ? "The USGS request timed out. No cached, synthetic, or first-party fallback is shown."
        : `Could not load or validate the USGS feed. No cached, synthetic, or first-party fallback is shown. ${error instanceof Error ? error.message : ""}`;
    } finally {
      window.clearTimeout(timeoutId);
      refreshButton.disabled = false;
    }
  }

  refreshButton.addEventListener("click", loadFeed);
  searchInput.addEventListener("input", renderEvents);
})();

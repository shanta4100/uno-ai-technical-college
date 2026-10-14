(() => {
  "use strict";

  const presets = {
    global: { name: "Global view", country: "Not resolved", lat: null, lon: null, timeZone: "UTC" },
    usa: { name: "United States · demo point", country: "United States · preset", lat: 39.8283, lon: -98.5795, timeZone: "America/Chicago" },
    japan: { name: "Japan · demo point", country: "Japan · preset", lat: 36.2048, lon: 138.2529, timeZone: "Asia/Tokyo" },
    bangladesh: { name: "Bangladesh · demo point", country: "Bangladesh · preset", lat: 23.8103, lon: 90.4125, timeZone: "Asia/Dhaka" },
    indonesia: { name: "Indonesia · demo point", country: "Indonesia · preset", lat: -2.5489, lon: 118.0149, timeZone: "Asia/Jakarta" },
    chile: { name: "Chile · demo point", country: "Chile · preset", lat: -35.6751, lon: -71.543, timeZone: "America/Santiago" },
    turkey: { name: "Türkiye · demo point", country: "Türkiye · preset", lat: 38.9637, lon: 35.2433, timeZone: "Europe/Istanbul" },
    italy: { name: "Italy · demo point", country: "Italy · preset", lat: 41.8719, lon: 12.5674, timeZone: "Europe/Rome" },
    "new-zealand": { name: "New Zealand · demo point", country: "New Zealand · preset", lat: -40.9006, lon: 174.886, timeZone: "Pacific/Auckland" },
  };

  const clock = document.querySelector("#utc-clock");
  const localClock = document.querySelector("#local-clock");
  const countrySelect = document.querySelector("#country-select");
  const searchInput = document.querySelector("#global-search");
  const map = document.querySelector("#schematic-map");
  const mapStatus = document.querySelector("#map-status");
  const mapPoint = document.querySelector("#map-point");
  const rings = [
    { element: document.querySelector("#monitor-ring"), radiusKm: 250 },
    { element: document.querySelector("#risk-ring"), radiusKm: 80 },
    { element: document.querySelector("#safe-ring"), radiusKm: 35 },
  ];
  const location = {
    name: document.querySelector("#location-name"),
    country: document.querySelector("#location-country"),
    lat: document.querySelector("#location-latitude"),
    lon: document.querySelector("#location-longitude"),
    altitude: document.querySelector("#location-altitude"),
  };
  let selected = presets.global;

  function formatCoordinate(value, positive, negative) {
    if (!Number.isFinite(value)) return "—";
    return `${Math.abs(value).toFixed(4)}° ${value < 0 ? negative : positive}`;
  }

  function updateClocks() {
    const now = new Date();
    clock.textContent = `${now.toISOString().slice(0, 19).replace("T", " ")}Z`;
    try {
      localClock.textContent = new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "medium",
        timeZone: selected.timeZone,
      }).format(now);
    } catch {
      localClock.textContent = "Timezone unavailable";
    }
  }

  function placeOnMap(lat, lon) {
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      document.querySelector("#radius-rings").setAttribute("visibility", "hidden");
      return;
    }
    const x = ((lon + 180) / 360) * 1000;
    const y = ((90 - lat) / 180) * 500;
    document.querySelector("#radius-rings").setAttribute("visibility", "visible");
    for (const { element, radiusKm } of rings) {
      element.setAttribute("cx", x.toFixed(2));
      element.setAttribute("cy", y.toFixed(2));
      element.dataset.nominalRadiusKm = String(radiusKm);
    }
    mapPoint.setAttribute("cx", x.toFixed(2));
    mapPoint.setAttribute("cy", y.toFixed(2));
  }

  function renderSelection({ name, country, lat, lon, timeZone = "UTC", altitude = null }) {
    selected = { name, country, lat, lon, timeZone };
    location.name.textContent = name;
    location.country.textContent = country;
    location.lat.textContent = formatCoordinate(lat, "N", "S");
    location.lon.textContent = formatCoordinate(lon, "E", "W");
    location.altitude.textContent = Number.isFinite(altitude) ? `${Math.round(altitude)} m · browser estimate` : "Unavailable";
    placeOnMap(lat, lon);
    updateClocks();
  }

  countrySelect.addEventListener("change", () => {
    const preset = presets[countrySelect.value] || presets.global;
    renderSelection(preset);
    mapStatus.textContent = preset.lat === null
      ? "Global schematic view selected. No geographic data or layers are loaded."
      : "Preset coordinates are illustrative reference points, not a resolved current location or hazard assessment.";
  });

  map.addEventListener("click", event => {
    const bounds = map.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const x = Math.max(0, Math.min(1000, ((event.clientX - bounds.left) / bounds.width) * 1000));
    const y = Math.max(0, Math.min(500, ((event.clientY - bounds.top) / bounds.height) * 500));
    const lon = (x / 1000) * 360 - 180;
    const lat = 90 - (y / 500) * 180;
    countrySelect.value = "global";
    renderSelection({
      name: "Map selection · schematic",
      country: "Not reverse-geocoded",
      lat,
      lon,
      timeZone: "UTC",
    });
    mapStatus.textContent = "Coordinates estimated from schematic projection only. The map is not a geographic basemap; country, altitude, and risk are not resolved.";
  });

  map.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      map.focus();
      mapStatus.textContent = "Use a region preset or the opt-in location button. Keyboard location picking is not available on this schematic map.";
    }
  });

  document.querySelector("#locate-me").addEventListener("click", () => {
    if (!navigator.geolocation) {
      mapStatus.textContent = "This browser does not provide geolocation.";
      return;
    }
    mapStatus.textContent = "Requesting location permission from your browser…";
    navigator.geolocation.getCurrentPosition(
      position => {
        countrySelect.value = "global";
        renderSelection({
          name: "Browser location · device-reported",
          country: "Not reverse-geocoded",
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
          altitude: position.coords.altitude,
        });
        mapStatus.textContent = "Device location is shown only in this page session; it is not sent or saved. Accuracy depends on the browser/device. No hazard data is provided.";
      },
      error => {
        const reasons = {
          1: "Location permission was denied.",
          2: "Device location is unavailable.",
          3: "Location request timed out.",
        };
        mapStatus.textContent = `${reasons[error.code] || "Could not retrieve device location."} You can still select a demo region or map point.`;
      },
      { enableHighAccuracy: false, maximumAge: 60000, timeout: 10000 }
    );
  });

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLocaleLowerCase();
    if (!query) return;
    const match = Object.entries(presets).find(([, preset]) =>
      preset.name.toLocaleLowerCase().includes(query) ||
      preset.country.toLocaleLowerCase().includes(query)
    );
    if (match) {
      countrySelect.value = match[0];
      countrySelect.dispatchEvent(new Event("change"));
      mapStatus.textContent = `Showing ${match[1].name}. This is a preset location, not live data.`;
    }
  });

  document.querySelectorAll(".map-mode:not([disabled])").forEach(button => {
    if (!button.dataset.mode) return;
    button.addEventListener("click", () => {
      document.querySelectorAll(".map-mode[data-mode]").forEach(modeButton => {
        const active = modeButton === button;
        modeButton.classList.toggle("active", active);
        modeButton.setAttribute("aria-pressed", String(active));
      });
      mapStatus.textContent = "Schematic display selected. CesiumJS/MapLibre and satellite imagery are not bundled or connected.";
    });
  });

  document.querySelectorAll("#timeline-select, #hazard-select").forEach(control => {
    control.addEventListener("change", () => {
      mapStatus.textContent = `Selected ${document.querySelector("#hazard-select").value} · ${document.querySelector("#timeline-select").value}. Filters change labels only; no data is loaded or calculated.`;
    });
  });

  updateClocks();
  window.setInterval(updateClocks, 1000);
})();

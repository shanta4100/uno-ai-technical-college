(() => {
  "use strict";

  const STORAGE_KEY = "nova-enterprise-suite.profiles.v1";
  const PROFILE_FIELDS = [
    "companyName", "entityType", "jurisdiction", "industry", "domain",
    "website", "contactEmail", "contactPhone", "address", "leaderCEO",
    "leaderCTO", "leaderCOO", "leaderCFO", "leaderCISO",
    "leaderCompliance", "administratorLabel", "otherRole", "supportChannel",
    "supportConsentStatus", "supportDraft", "mfaPolicy",
    "passkeyPolicy", "sessionTimeout", "auditRetention",
    "recoveryContactRole"
  ];
  const ARRAY_FIELDS = [
    "departments", "businessModels", "providers", "complianceChecklist"
  ];
  const ALLOWED_VALUES = {
    departments: [
      "Operations", "Finance", "Technology", "Marketing", "Compliance",
      "Customer Support", "Human Resources", "Legal"
    ],
    businessModels: ["B2B", "B2C", "B2G", "Hybrid"],
    providers: [
      "Stripe", "PayPal", "Adyen", "Global Payments", "Apple Pay",
      "Google Pay", "ACH", "SEPA", "Bank transfer", "Other / to evaluate"
    ],
    complianceChecklist: [
      "Privacy notice planning", "Security policy planning",
      "Vendor due diligence planning",
      "Consumer rights and refund planning",
      "Procurement documentation planning",
      "Accessibility review planning"
    ]
  };
  const form = document.querySelector("#company-form");
  const profileList = document.querySelector("#profile-list");
  const exportButton = document.querySelector("#export-profile");
  const exportAllButton = document.querySelector("#export-all");
  const deleteButton = document.querySelector("#delete-profile");
  const importFile = document.querySelector("#import-file");
  const editorTitle = document.querySelector("#editor-title");
  const formStatus = document.querySelector("#form-status");
  const storageState = document.querySelector("#storage-state");
  const policyOutput = document.querySelector("#policy-output");
  const printSummary = document.querySelector("#architecture-summary");
  let profiles = [];
  let currentId = null;

  function createId() {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
      return globalThis.crypto.randomUUID();
    }
    return `profile-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function normalizeProfile(value, requireName = true) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("Profile must be a JSON object.");
    }
    if (requireName && (typeof value.companyName !== "string" || !value.companyName.trim())) {
      throw new Error("Profile must include a company name.");
    }

    const profile = { id: typeof value.id === "string" ? value.id.slice(0, 100) : createId() };
    for (const field of PROFILE_FIELDS) {
      const fieldValue = value[field];
      if (fieldValue === undefined || fieldValue === null) {
        profile[field] = "";
      } else if (typeof fieldValue === "string") {
        const maxLength = field === "supportDraft" ? 2000 : 500;
        profile[field] = fieldValue.slice(0, maxLength);
      } else {
        throw new Error(`Invalid value for ${field}.`);
      }
    }
    for (const field of ARRAY_FIELDS) {
      const arrayValue = value[field] ?? [];
      if (!Array.isArray(arrayValue) || arrayValue.length > ALLOWED_VALUES[field].length) {
        throw new Error(`Invalid list for ${field}.`);
      }
      profile[field] = [...new Set(arrayValue.filter(
        item => typeof item === "string" && ALLOWED_VALUES[field].includes(item)
      ))];
    }
    if (requireName && !profile.companyName.trim()) {
      throw new Error("Profile must include a company name.");
    }
    return profile;
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
      storageState.textContent = "Saved in this browser only.";
      return true;
    } catch {
      storageState.textContent = "Could not save: browser storage may be unavailable or full.";
      return false;
    }
  }

  function loadProfiles() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) throw new Error("Unexpected saved data.");
      return parsed.map(profile => normalizeProfile(profile));
    } catch {
      storageState.textContent = "Saved data could not be read. Import a valid profile or start a new one.";
      return [];
    }
  }

  function renderProfiles() {
    profileList.replaceChildren();
    for (const profile of profiles) {
      const item = document.createElement("li");
      item.className = "profile-item";
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = profile.companyName;
      button.setAttribute("aria-current", profile.id === currentId ? "true" : "false");
      button.addEventListener("click", () => selectProfile(profile.id));
      item.append(button);
      profileList.append(item);
    }
    exportButton.disabled = !profiles.some(profile => profile.id === currentId);
    exportAllButton.disabled = profiles.length === 0;
    deleteButton.hidden = !profiles.some(profile => profile.id === currentId);
  }

  function setField(name, value) {
    const control = form.elements.namedItem(name);
    if (control && "value" in control) control.value = value ?? "";
  }

  function populateForm(profile) {
    form.reset();
    if (profile) {
      for (const field of PROFILE_FIELDS) setField(field, profile[field]);
      for (const field of ARRAY_FIELDS) {
        for (const checkbox of form.querySelectorAll(`input[name="${field}"]`)) {
          checkbox.checked = profile[field].includes(checkbox.value);
        }
      }
      editorTitle.textContent = profile.companyName;
    } else {
      editorTitle.textContent = "New organization";
    }
    formStatus.textContent = "";
    renderProfiles();
  }

  function selectProfile(id) {
    const profile = profiles.find(item => item.id === id);
    if (!profile) return;
    currentId = id;
    populateForm(profile);
  }

  function readForm() {
    const profile = { id: currentId || createId() };
    for (const field of PROFILE_FIELDS) {
      const control = form.elements.namedItem(field);
      profile[field] = control ? control.value.trim() : "";
    }
    for (const field of ARRAY_FIELDS) {
      profile[field] = [...form.querySelectorAll(`input[name="${field}"]:checked`)]
        .map(input => input.value);
    }
    return normalizeProfile(profile);
  }

  function downloadProfile(profile) {
    const payload = {
      format: "nova-enterprise-profile",
      version: 1,
      exportedAt: new Date().toISOString(),
      profile
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profile.companyName.trim().replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60) || "nova-profile"}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function downloadAllProfiles() {
    if (!profiles.length) return;
    const payload = {
      format: "nova-enterprise-profiles",
      version: 1,
      exportedAt: new Date().toISOString(),
      profiles
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "nova-enterprise-profiles.json";
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function appendReportText(parent, tag, text) {
    const element = document.createElement(tag);
    element.textContent = text;
    parent.append(element);
  }

  function showArchitectureSummary() {
    printSummary.replaceChildren();
    appendReportText(printSummary, "p", "NOVA ENTERPRISE SUITE · v1.1 OFFLINE PLANNING PROTOTYPE");
    appendReportText(printSummary, "h1", "Architecture summary");
    const profile = profiles.find(item => item.id === currentId);
    if (profile) appendReportText(printSummary, "h2", profile.companyName);
    appendReportText(
      printSummary,
      "p",
      "Purpose: customer-entered organization and governance planning. Company generation creates a configurable software workspace profile, not a legal entity or deployed cloud tenant."
    );
    appendReportText(printSummary, "h2", "Proposed modules");
    appendReportText(printSummary, "p", "NOVA CORE — company profiles, business operations, and workspace planning.");
    appendReportText(printSummary, "p", "SOVEREIGN SHIELD — security, governance, risk, and compliance planning only.");
    appendReportText(printSummary, "p", "NOVA ECON — subscriptions, pricing, financial administration, and provider-readiness planning only.");
    appendReportText(printSummary, "h2", "Prototype capabilities in this browser");
    appendReportText(printSummary, "p", "Organization and leadership fields; department and business-model selection; compliance checklist planning; support-message drafts; security/provider planning fields; browser-local profile storage; JSON import/export; and draft policy starters.");
    appendReportText(printSummary, "h2", "Not active");
    appendReportText(printSummary, "p", "No authentication, tenant isolation, live security controls, payment processing, banking connection, email/SMS/calling, government registration, identity verification, compliance certification, or external service integration.");
    appendReportText(printSummary, "p", "Customer ownership, access governance, and secure handover are design goals that require implementation and verification. Planning entries do not establish legal, regulatory, or security compliance.");
    document.body.classList.add("printing-summary");
    window.print();
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    try {
      const profile = readForm();
      const index = profiles.findIndex(item => item.id === profile.id);
      if (index === -1) profiles.push(profile);
      else profiles[index] = profile;
      currentId = profile.id;
      if (persist()) {
        formStatus.textContent = "Profile saved locally.";
        editorTitle.textContent = profile.companyName;
      }
      renderProfiles();
    } catch (error) {
      formStatus.textContent = error.message;
    }
  });

  document.querySelector("#new-profile").addEventListener("click", () => {
    currentId = null;
    populateForm(null);
    form.elements.namedItem("companyName").focus();
  });

  exportButton.addEventListener("click", () => {
    const profile = profiles.find(item => item.id === currentId);
    if (profile) downloadProfile(profile);
  });

  exportAllButton.addEventListener("click", downloadAllProfiles);
  document.querySelector("#print-summary-button").addEventListener("click", showArchitectureSummary);
  window.addEventListener("afterprint", () => {
    document.body.classList.remove("printing-summary");
  });

  deleteButton.addEventListener("click", () => {
    if (!currentId) return;
    profiles = profiles.filter(item => item.id !== currentId);
    currentId = null;
    populateForm(null);
    persist();
    renderProfiles();
    formStatus.textContent = "Profile deleted from this browser.";
  });

  importFile.addEventListener("change", async () => {
    const [file] = importFile.files || [];
    importFile.value = "";
    if (!file) return;
    if (file.size > 1_000_000) {
      formStatus.textContent = "Import rejected: JSON file must be smaller than 1 MB.";
      return;
    }
    try {
      const payload = JSON.parse(await file.text());
      const isProfileExport = payload?.format === "nova-enterprise-profile";
      const isProfilesExport = payload?.format === "nova-enterprise-profiles";
      const incoming = isProfilesExport
        ? payload.profiles
        : [isProfileExport ? payload.profile : payload];
      if (!Array.isArray(incoming) || incoming.length === 0 || incoming.length > 100) {
        throw new Error("Import must contain between 1 and 100 profiles.");
      }
      const imported = incoming.map(item => {
        const normalized = normalizeProfile(item);
        normalized.id = createId();
        return normalized;
      });
      const previousProfiles = profiles;
      profiles = [...profiles, ...imported];
      currentId = imported[0].id;
      if (persist()) {
        populateForm(imported[0]);
        formStatus.textContent = `${imported.length} profile${imported.length === 1 ? "" : "s"} imported and saved in this browser.`;
      } else {
        profiles = previousProfiles;
        currentId = null;
        populateForm(null);
      }
    } catch (error) {
      formStatus.textContent = `Import failed: ${error.message || "Invalid JSON profile."}`;
    }
  });

  const policyDrafts = {
    security: `SECURITY POLICY — PLANNING DRAFT

Organization: [Organization name]
Status: Draft for review; not an active security control

Purpose
Describe the security responsibilities, proposed safeguards, and review cadence for the organization.

Planning topics
- Assign accountable owners for security decisions and risk tracking.
- Define proposed access, authentication, logging, encryption, and recovery requirements.
- Document how risks, exceptions, and incidents would be reviewed and escalated.
- Record approved changes and review this draft with qualified stakeholders.

This starter text is incomplete and must be tailored and independently reviewed before any operational use.`,
    privacy: `PRIVACY NOTICE — PLANNING DRAFT

Organization: [Organization name]
Status: Draft for review; not a published privacy notice

Document the data the organization expects to collect, why it is needed, how it will be used and retained, who may receive it, and how people can ask questions or exercise applicable rights.

Before publication, identify applicable jurisdictions and obtain qualified privacy/legal review. This template does not establish compliance or determine legal obligations.`,
    incident: `INCIDENT RESPONSE OUTLINE — PLANNING DRAFT

Organization: [Organization name]
Status: Draft for review; no monitoring or response service is active

1. Define how a suspected incident is reported and who receives the report.
2. Identify accountable decision-makers and a human escalation path.
3. Plan safe triage, evidence preservation, containment, and recovery responsibilities.
4. Determine how notification obligations would be assessed by qualified personnel.
5. Record lessons learned, corrective actions, and approval of plan revisions.

This outline is not an operational response capability. Validate it against the organization's systems, risks, and applicable obligations.`,
  };

  document.querySelectorAll(".policy-button").forEach(button => {
    button.addEventListener("click", () => {
      const profile = profiles.find(item => item.id === currentId);
      policyOutput.textContent = policyDrafts[button.dataset.policy]
        .replaceAll("[Organization name]", profile?.companyName || "[Organization name]");
    });
  });

  profiles = loadProfiles();
  currentId = profiles[0]?.id ?? null;
  populateForm(profiles[0] ?? null);
  if (profiles.length) storageState.textContent = "Loaded profiles from this browser.";
})();

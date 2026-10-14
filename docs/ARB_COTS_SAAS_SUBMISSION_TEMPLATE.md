# ARB Submission Template — Commercial COTS / SaaS Platform

**Document ID:** ARB-COTS-SAAS-SUBMISSION-TEMPLATE-001  
**Status:** Unselected-product review template  
**Prepared:** October 2026 (date supplied)  
**Decision state:** No vendor selected; no architecture or production approval established

> **Evidence rule:** All hosting, security, compliance, performance, availability, and integration values below are example targets supplied for evaluation. They are not vendor commitments or verified facts. Replace each target with evidence from the selected vendor’s contract, architecture documentation, independent reports, and test results. Do not mark an item compliant based only on a marketing statement.

## 1. Executive summary and review scope

| Field | Value |
|---|---|
| Project | Enterprise All-in-One Business Operations Platform |
| Business sponsor | `[Name / role]` |
| Lead architect | `[Name / role]` |
| Target ARB date | `[Date]` |
| Candidate product(s) | `[Product, edition, region, and version]` |
| Decision requested | `[Discovery / pilot / conditional approval / production]` |
| Data classification | `[Classification; confirm with data owner]` |
| Status | Proposed; evidence and procurement review pending |

**Business objective:** Evaluate whether a commercial platform can consolidate selected departmental capabilities while meeting business, security, privacy, operational, integration, exit, and cost requirements.

Do not assume that replacing tools automatically reduces cost, integration effort, or risk. Document the current baseline, target scope, impacted users/processes, alternatives, expected benefits, and measurable success criteria.

## 2. Product-category and vendor candidates

Potential enterprise architecture governance candidates listed in the supplied materials include SAP LeanIX, ServiceNow Enterprise Architecture/APM, Bizzdesign Horizzon, and Ardoq. Treat these names as candidates only. Their features, hosting models, availability, integrations, licensing, certifications, and fit must be verified against current product documentation, contract terms, and a proof of concept.

For each candidate, record:

- Product/edition, modules, release channel, and contract entity.
- Requirements demonstrated in a scripted proof of concept.
- Data import/export formats, portability, deletion, and exit assistance.
- Integration availability, rate limits, scopes, support lifecycle, and fees.
- Subprocessor list, hosting regions, residency options, and change notice.
- Independent assurance reports and their scope/period, reviewed under NDA where necessary.
- Total cost, implementation effort, renewal, termination, and price-change terms.

No product is selected or endorsed by this template.

## 3. Architecture and deployment proposal

### Candidate design choices to evaluate

- Vendor-operated SaaS versus private cloud or self-hosted alternatives.
- Dedicated or logically multi-tenant deployment and the vendor’s isolation evidence.
- Identity federation and lifecycle provisioning (SAML 2.0/OIDC, SCIM), if supported.
- Integration through vendor-supported REST APIs and signed webhooks; avoid direct database access unless separately justified and controlled.
- Authoritative sources for architecture inventory, TRM, asset data, lifecycle policy, and CMDB.
- Data export, backup, observability, incident notification, recovery, and exit strategy.

Do not treat “vendor-managed,” “cloud-native,” “multi-AZ,” “tenant-isolated,” or “customer-managed keys” as verified properties without scoped technical evidence and contractual commitments.

### Data-flow inventory

For every flow, document source, destination, purpose, owner, classification, protocol, authentication, encryption, retention, region, and failure behavior.

| Flow | Example | Evidence / owner |
|---|---|---|
| User and role provisioning | Enterprise IdP → SaaS | `[Protocol, attribute mapping, offboarding test]` |
| Architecture submission | User/Jira → SaaS | `[Payload, classification, attachment controls]` |
| Standards assessment | SaaS → approved TRM/catalog | `[Source, version, freshness, auditability]` |
| Decision export | SaaS → CMDB/data lake | `[Fields, authorization, idempotency, reconciliation]` |
| Files and diagrams | User/SFTP/object storage → SaaS | `[Encryption, malware scanning, size limits, retention]` |

## 4. Functional scope and governance

Required capabilities should be testable acceptance criteria, not broad product claims:

- Standardized intake with required architecture, NFR, data, privacy, and security fields.
- Versioned standards and lifecycle checks with traceable rule outcomes and exception handling.
- Human review workflow, quorum, conflict management, decision rationale, conditions, waivers, and appeals.
- Architecture decision records and action tracking with ownership and evidence links.
- Dependency mapping with provenance and freshness indicators.
- Notifications, audit records, role separation, and administrative oversight.
- Search, reporting, accessibility, and data export for authorized roles.

Define which results are advisory versus blocking, who may approve exceptions, how false positives are handled, and who owns policy changes.

## 5. Non-functional requirements — candidate targets

The following values appeared in the supplied example and are not validated requirements or vendor commitments. Confirm them through workload analysis and negotiation.

| Attribute | Example target | Required evidence |
|---|---:|---|
| Peak throughput | 2,500 transactions/second | Workload definition, contracted capacity, load-test report, throttling behavior |
| API latency | p95 < 250 ms | Endpoint, payload, region, test duration, error rate, and measurement method |
| Service availability | 99.95% | Contractual SLA, exclusions, service credits, maintenance policy |
| RTO | ≤ 2 hours | Service-specific recovery plan and witnessed failover exercise |
| RPO | ≤ 15 minutes | Data scope, backup frequency, restore evidence, and contractual commitment |
| Autoscaling threshold | 70% CPU/memory | Clarify whether this is vendor design, tenant setting, or illustrative trigger |
| API request limit | 2,000 requests/minute per integration | Vendor quota, burst policy, per-tenant scope, and throttling response |
| Request body limit | 10 MB | Gateway enforcement, file upload path, and error behavior |
| Attachment limit | 25 MiB example | Define per-file versus total request; malware scanning and retention |

A target is not achieved merely because a vendor advertises it. Define acceptance tests, monitoring ownership, and failure consequences.

## 6. Security, privacy, and compliance assessment

The submitted example mentions Okta, SAML/OIDC, SCIM, AES-256, TLS 1.3, mTLS, customer-managed keys, SOC 2 Type II, ISO 27001, and GDPR. These are candidate controls or evidence requests, not verified properties or certifications.

For each claim, record:

| Topic | Assessment questions |
|---|---|
| Identity | Supported protocols, MFA enforcement, SCIM deprovisioning latency, break-glass controls, audit trail |
| Tenant isolation | Logical/physical boundaries, authorization tests, independent test scope, incident history |
| Encryption | Data categories, algorithms, key custody, rotation, backup, BYOK limitations |
| Transport | External/internal TLS policy, certificate validation, service-to-service identity |
| Assurance | Report issuer, scope, system boundary, period, exceptions, bridge letter, and remediation status |
| Privacy | Controller/processor roles, DPA, subprocessors, data subject requests, retention, transfers, deletion |
| Vulnerability response | Disclosure channel, patch SLAs, penetration-test scope, incident notification commitments |
| Audit | Events captured, integrity, retention, customer access, export, and administrative monitoring |

Legal, privacy, and security teams must determine applicability of GDPR, SOC 2, ISO 27001, HIPAA, or other regimes. Do not claim compliance solely because a vendor has an attestation; verify scope and the organization’s own obligations.

## 7. API and integration governance

Candidate patterns include REST/JSON APIs, HMAC-signed webhooks, an enterprise API gateway, OAuth 2.0, mutual TLS, JWTs, and event streaming. Select mechanisms per integration and threat model; they are not interchangeable checkboxes.

For each interface, document:

- OpenAPI/schema version, authentication, authorization scopes, and data classification.
- Signing algorithm and key rotation for webhooks; timestamp/replay validation.
- Rate limits, payload caps, timeout/retry policy, idempotency, and dead-letter handling.
- CORS only for browser-based clients; it is not an API authentication control.
- Versioning, deprecation notice, change windows, sandbox, and contract tests.
- Logging fields and explicit exclusion of credentials, tokens, and unnecessary PII.

## 8. Risks and mitigations

| Risk | Proposed mitigation | Closure evidence |
|---|---|---|
| Vendor lock-in/proprietary schemas | Scheduled machine-readable exports in documented formats; test restoration/import | Successful export, reconciliation, and exit rehearsal |
| Batch CSV dependency | Time-bound integration roadmap; validate secure transfer and reconcile records | Approved owner/date, controls, and replacement acceptance test |
| Vendor-managed release changes | Sandbox validation before production, release notes, rollback/feature control | Completed pre-release test and change approval |
| Identity offboarding delay | Test SCIM deprovisioning and emergency disable process | Time-stamped test evidence and approved maximum latency |
| Disaster-recovery assumptions | Review contractual RTO/RPO and witness recovery exercise | Scoped vendor report and business-owner acceptance |
| Data residency/subprocessor changes | Contractual notice, region controls, privacy review, exit plan | Approved DPA, inventory, and change process |
| Standards false positives | Human exception workflow and rule provenance | Demonstrated review/waiver path and audit record |

Q2 2027 and other dates from the supplied material are planning examples. Assign accountable owners and approve actual dates before adding them to a baseline.

## 9. Pilot, acceptance, and rollout gates

1. **Discovery:** confirm business problem, scope, alternatives, owners, data classifications, and measurable outcomes.
2. **Vendor diligence:** validate product claims, contracts, security evidence, subprocessors, costs, and exit provisions.
3. **Sandbox proof of concept:** test representative workflows, integrations, export, access controls, accessibility, and failure modes with synthetic data.
4. **Controlled pilot:** approve limited data/users, monitoring, support, incident process, rollback, and acceptance criteria.
5. **Production decision:** require completed risk treatment, contract approval, security/privacy sign-off, tested recovery, operational readiness, and explicit ARB decision.

No stage is complete without evidence, accountable sign-off, and a record of open risks.

## 10. Review record

| Field | Status |
|---|---|
| Candidate product selected | Not provided |
| Vendor architecture/contract evidence | Not provided |
| Data-flow and classification approval | Pending |
| Security/privacy assessment | Pending |
| Workload and NFR validation | Pending |
| Pilot results | Not provided |
| ARB decision | Not made |


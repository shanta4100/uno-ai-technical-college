# [Project or Product Name] — Architecture Review Documentation

> **Document status:** Draft template. Replace bracketed text with verified project information before review. Mark unknowns as “TBD”; do not present proposed capabilities, sample values, or vendor statements as implemented or approved facts.

## Document control

| Field | Value |
|---|---|
| Project / product | `[Name]` |
| Version / release | `[Version or TBD]` |
| Document date | `[YYYY-MM-DD]` |
| Author / owner | `[Name or team]` |
| Intended audience | `[Developers / operators / end users / management / reviewers]` |
| Review status | `[Draft / submitted / approved / rejected / conditional]` |
| Related records | `[Repository, ADRs, requirements, threat model, tickets]` |

## 1. Executive summary and overview

**Objective:** `[In two or three sentences, describe what the project does, who it serves, and the problem it addresses.]`

**Scope:** `[Included capabilities, users, environments, and exclusions.]`

**Decision requested:** `[What decision or guidance is requested from the ARB?]`

**Current state:** `[Existing / prototype / proposed / pilot / production. Include evidence or links.]`

## 2. Getting started and installation

Document steps that have been tested for the stated release. For proposed or unavailable environments, label instructions accordingly.

### System requirements

| Requirement | Supported value | Evidence / notes |
|---|---|---|
| Operating system / hosting | `[Value]` | `[Version, support status, source]` |
| Runtime / language | `[Value]` | `[Version and support status]` |
| Prerequisites | `[Tools, accounts, access, hardware]` | `[Owner or setup reference]` |
| Network dependencies | `[Hosts, ports, protocols]` | `[Approved network specification]` |

### Installation and configuration

1. `[Obtain the approved source or release artifact.]`
2. `[Install dependencies using the project’s documented package manager.]`
3. `[Configure environment-specific settings using the approved secret-management process.]`
4. `[Start the service or application.]`
5. `[Run the documented health check or acceptance test.]`

Do not place credentials, tokens, private keys, or production data in this document. Link to an approved secrets-management procedure instead.

## 3. Architecture and technical design

### Core stack

| Component | Technology / service | Version / status | Rationale and evidence |
|---|---|---|---|
| Client / user interface | `[Value]` | `[Value]` | `[Link or rationale]` |
| Application / runtime | `[Value]` | `[Value]` | `[Link or rationale]` |
| Data storage | `[Value]` | `[Value]` | `[Classification, residency, owner]` |
| Integrations | `[Value]` | `[Value]` | `[Interface and owner]` |
| Delivery / operations | `[Value]` | `[Value]` | `[Environment and support model]` |

### System architecture

`[Describe the major components, trust boundaries, deployment environments, and dependencies. Link an approved architecture diagram if available.]`

### Data flow

| Input / source | Processing | Output / destination | Data class | Controls / owner |
|---|---|---|---|---|
| `[Source]` | `[Processing]` | `[Destination]` | `[Class]` | `[Controls and owner]` |

Include data retention, deletion, backup, residency, encryption, identity, and failure behavior where applicable. Distinguish verified controls from design intentions.

## 4. Features and functional specifications

| Feature | Intended user | Behavior / expected outcome | Status and acceptance evidence |
|---|---|---|---|
| `[Feature A]` | `[User]` | `[Description]` | `[Implemented / proposed; test or reference]` |
| `[Feature B]` | `[User]` | `[Description]` | `[Implemented / proposed; test or reference]` |
| `[Feature C]` | `[User]` | `[Description]` | `[Implemented / proposed; test or reference]` |

List important constraints, accessibility requirements, and known limitations. Do not describe roadmap items as available features.

## 5. Configuration and API reference

Complete this section only where applicable. Use non-sensitive examples and state the environment to which each value applies.

### Configuration

| Parameter | Type | Default | Required? | Description / source |
|---|---|---|---|---|
| `[SETTING_NAME]` | `[Type]` | `[Value or none]` | `[Yes / no]` | `[Purpose and safe configuration source]` |

### API endpoints

For each endpoint, document method and path, purpose, authentication and authorization, request/response schema, error behavior, rate limits, versioning, and owner. Provide a link to the authoritative OpenAPI or interface specification when available.

- `[METHOD] [PATH]` — `[Description; status: implemented / proposed / deprecated]`
  - Authentication / authorization: `[Requirements]`
  - Request and response: `[Schema or reference]`
  - Errors and limits: `[Behavior or reference]`

## 6. Maintenance and troubleshooting

| Issue / symptom | Diagnostic steps | Resolution / escalation | Owner |
|---|---|---|---|
| `[Issue]` | `[Safe diagnostic steps]` | `[Resolution or escalation path]` | `[Team]` |
| `[Issue]` | `[Safe diagnostic steps]` | `[Resolution or escalation path]` | `[Team]` |

Include operational ownership, monitoring and alerting, backup/restore procedures, patching cadence, incident contacts, and support hours where relevant. Avoid including sensitive diagnostic output.

## 7. Change log and version history

| Version | Date | Change summary | Author / approver |
|---|---|---|---|
| `[Version]` | `[YYYY-MM-DD]` | `[Summary; distinguish planned from released changes]` | `[Name / role]` |

## ARB review record

| Review item | Status / evidence |
|---|---|
| Business and architecture owners identified | `[Status / link]` |
| Security, privacy, and data classification reviewed | `[Status / link]` |
| NFRs and operational readiness reviewed | `[Status / link]` |
| Risks, exceptions, and mitigations recorded | `[Status / link]` |
| Decision, conditions, owners, and due dates | `[Pending / decision record]` |


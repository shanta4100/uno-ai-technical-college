# NOVA Enterprise Suite v1.1 · Offline planning prototype

This standalone static page is a customer-configurable company-planning demo. It includes organization and leadership fields, department and business-model selections, security-planning records, payment-provider readiness selections, three non-legal draft starters, and profile JSON import/export.

## Run

Open `index.html` in a modern browser, or serve the repository as static files and visit `/nova-suite/`. No build step or backend is required.

## Data and limitations

- Saved profiles remain in this browser's `localStorage`; they are not encrypted, synchronized, authenticated, or isolated between users of the same browser profile.
- Exported JSON is a portability/backup file. Imported profile data is validated against the prototype's expected fields and option lists.
- Do not enter sensitive, confidential, financial-account, identity, or government information.
- This prototype does not implement live accounts, authentication, MFA, passkeys, biometrics, RBAC, audit logging, encryption controls, security monitoring, compliance verification, CRM backend, workflows, payment processing, external integrations, or message/call transmission.
- Provider selections and security fields are planning records only. Draft policy text is incomplete and not legal advice, compliance evidence, certification, or an operational control.
- Customers remain responsible for independent legal, regulatory, tax, licensing, procurement, security, and provider review.
- Local browser storage is not a production SaaS architecture and does not establish tenant isolation or customer ownership of hosting, domains, DNS, databases, or infrastructure.

The prototype operates locally in the browser. Static hosting the files makes the page publicly reachable, but does not add a server or transmit profile data.

# GAIOS Phase 2 — Step 1 Database Package

**Status:** Draft implementation baseline; not an approval or production certification  
**Database target:** PostgreSQL 15+  
**Migration:** [`gaios/database/migrations/001_initial_schema.sql`](../gaios/database/migrations/001_initial_schema.sql)  
**Database assertions:** [`gaios/database/tests/001_schema_assertions.sql`](../gaios/database/tests/001_schema_assertions.sql)  
**CI workflow:** [`.github/workflows/gaios-database.yml`](../.github/workflows/gaios-database.yml)

> This package adds a proposed MVP schema and a disposable CI test database. It does not implement an AMEBA application, CSV ingestion service, analysis/reporting pipeline, authentication provider, or production database deployment.

## Scope

The migration defines the governance and data structures for the initial workflow:

`CSV validation → analysis → report → evidence record → human approval → recovery monitoring`

The migration includes the seven named MVP structures plus `governance_roles`, a lookup table that lets both user-role assignments and KPI ownership reference the same controlled role names.

| Structure | Purpose |
|---|---|
| `governance_roles` | Controlled role catalog |
| `user_roles` | UUID user-to-role assignments |
| `ring2_evidence_ledger` | Append-only evidence events |
| `kpi_definitions` | KPI target and owning role |
| `kpi_measurements` | Measurements with centrally calculated variance |
| `ring2_recovery_events` | Recovery telemetry |
| `recovery_consensus_votes` | Human votes on recovery events |
| `ring2_chain_of_custody` | Append-only evidence custody events |

## Integrity and governance controls

- UUID primary keys are generated with PostgreSQL `gen_random_uuid()`.
- `ring2_evidence_ledger` and `ring2_chain_of_custody` reject `UPDATE`, `DELETE`, and `TRUNCATE` with an error. The migration also revokes those privileges from `PUBLIC`.
- Runtime application roles must not own these tables and should receive only the minimum required privileges. A database owner or superuser can disable triggers or otherwise bypass database controls; these controls are not tamper-proof against privileged administrators.
- KPI measurement variance is calculated by a `BEFORE INSERT OR UPDATE` trigger as `measured_value - target_value` from the referenced KPI definition. The stored `variance` column is `NOT NULL`.
- KPI definitions reject deletion through a raising trigger; this avoids the silent no-op behavior of a `DO INSTEAD NOTHING` rule.
- The recovery lookup index is `(node_id, created_at DESC)`.
- Recovery votes use the corrected `voted_at` timestamp.
- `actor_id` remains a UUID without a foreign key to a `users` table. Add an authoritative user table/reference when identity integration is defined (planned future work).
- Recovery telemetry is stored separately from the evidence and KPI tables.

## Validation

The dedicated workflow starts a fresh PostgreSQL 15 service using a run-specific disposable password, applies the migration from its checked-in path, and executes SQL assertions. It does not use production credentials and does not modify the static-site deployment workflow.

The CI checks demonstrate schema behavior in a disposable database; they are not evidence of production deployment, operational security, authentication, human approval UX, or application-level separation of duties.


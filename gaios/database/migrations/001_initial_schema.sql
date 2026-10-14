BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS governance_roles (
    role_name TEXT PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO governance_roles (role_name, description)
VALUES
    ('ingestor', 'Submits source data for validation'),
    ('analyst', 'Runs or reviews analysis'),
    ('reviewer', 'Reviews generated reports and evidence'),
    ('approver', 'Records authorized human approval'),
    ('recovery_operator', 'Operates recovery workflows'),
    ('administrator', 'Manages application configuration')
ON CONFLICT (role_name) DO NOTHING;

CREATE TABLE IF NOT EXISTS user_roles (
    user_role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role_name TEXT NOT NULL REFERENCES governance_roles (role_name),
    assigned_by UUID,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMPTZ,
    CONSTRAINT user_roles_revocation_after_assignment
        CHECK (revoked_at IS NULL OR revoked_at >= assigned_at),
    CONSTRAINT user_roles_user_role_unique UNIQUE (user_id, role_name)
);

CREATE TABLE IF NOT EXISTS ring2_evidence_ledger (
    evidence_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID NOT NULL,
    event_type TEXT NOT NULL,
    subject_type TEXT NOT NULL,
    subject_id UUID,
    payload JSONB NOT NULL DEFAULT '{}'::JSONB,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kpi_definitions (
    kpi_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    unit TEXT NOT NULL,
    target_value NUMERIC(15, 4) NOT NULL,
    owner_role TEXT NOT NULL REFERENCES governance_roles (role_name),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kpi_measurements (
    measurement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kpi_id UUID NOT NULL REFERENCES kpi_definitions (kpi_id),
    measured_value NUMERIC(15, 4) NOT NULL,
    variance NUMERIC(15, 4) NOT NULL,
    measured_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    source_reference TEXT
);

CREATE TABLE IF NOT EXISTS ring2_recovery_events (
    recovery_event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_status TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recovery_consensus_votes (
    vote_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recovery_event_id UUID NOT NULL
        REFERENCES ring2_recovery_events (recovery_event_id),
    voter_id UUID NOT NULL,
    vote TEXT NOT NULL CHECK (vote IN ('approve', 'reject', 'abstain')),
    rationale TEXT NOT NULL DEFAULT '',
    voted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT recovery_vote_once_per_event UNIQUE (recovery_event_id, voter_id)
);

CREATE TABLE IF NOT EXISTS ring2_chain_of_custody (
    custody_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evidence_id UUID NOT NULL
        REFERENCES ring2_evidence_ledger (evidence_id),
    actor_id UUID NOT NULL,
    action TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::JSONB,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_recovery_events_lookup
    ON ring2_recovery_events (node_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_kpi_measurements_kpi_time
    ON kpi_measurements (kpi_id, measured_at DESC);

CREATE OR REPLACE FUNCTION reject_immutable_record_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION 'Table % is append-only; % is not permitted',
        TG_TABLE_NAME, TG_OP
        USING ERRCODE = '55000';
END;
$$;

CREATE OR REPLACE FUNCTION reject_kpi_definition_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION 'KPI definitions cannot be deleted; deactivate or supersede the definition'
        USING ERRCODE = '55000';
END;
$$;

CREATE OR REPLACE FUNCTION calculate_kpi_variance()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    target NUMERIC(15, 4);
BEGIN
    SELECT target_value
      INTO target
      FROM kpi_definitions
     WHERE kpi_id = NEW.kpi_id
       AND is_active;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'KPI % does not exist or is inactive', NEW.kpi_id
            USING ERRCODE = '23503';
    END IF;

    NEW.variance := ROUND(NEW.measured_value - target, 4);
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ring2_evidence_ledger_reject_update_delete
    ON ring2_evidence_ledger;
CREATE TRIGGER ring2_evidence_ledger_reject_update_delete
BEFORE UPDATE OR DELETE ON ring2_evidence_ledger
FOR EACH ROW EXECUTE FUNCTION reject_immutable_record_mutation();

DROP TRIGGER IF EXISTS ring2_evidence_ledger_reject_truncate
    ON ring2_evidence_ledger;
CREATE TRIGGER ring2_evidence_ledger_reject_truncate
BEFORE TRUNCATE ON ring2_evidence_ledger
FOR EACH STATEMENT EXECUTE FUNCTION reject_immutable_record_mutation();

DROP TRIGGER IF EXISTS ring2_chain_of_custody_reject_update_delete
    ON ring2_chain_of_custody;
CREATE TRIGGER ring2_chain_of_custody_reject_update_delete
BEFORE UPDATE OR DELETE ON ring2_chain_of_custody
FOR EACH ROW EXECUTE FUNCTION reject_immutable_record_mutation();

DROP TRIGGER IF EXISTS ring2_chain_of_custody_reject_truncate
    ON ring2_chain_of_custody;
CREATE TRIGGER ring2_chain_of_custody_reject_truncate
BEFORE TRUNCATE ON ring2_chain_of_custody
FOR EACH STATEMENT EXECUTE FUNCTION reject_immutable_record_mutation();

DROP TRIGGER IF EXISTS kpi_definitions_reject_delete
    ON kpi_definitions;
CREATE TRIGGER kpi_definitions_reject_delete
BEFORE DELETE ON kpi_definitions
FOR EACH ROW EXECUTE FUNCTION reject_kpi_definition_delete();

DROP TRIGGER IF EXISTS kpi_measurements_calculate_variance
    ON kpi_measurements;
CREATE TRIGGER kpi_measurements_calculate_variance
BEFORE INSERT OR UPDATE OF kpi_id, measured_value ON kpi_measurements
FOR EACH ROW EXECUTE FUNCTION calculate_kpi_variance();

REVOKE UPDATE, DELETE, TRUNCATE
    ON ring2_evidence_ledger, ring2_chain_of_custody
    FROM PUBLIC;
REVOKE DELETE ON kpi_definitions FROM PUBLIC;

COMMIT;


\set ON_ERROR_STOP on

BEGIN;

DO $$
DECLARE
    actual_variance NUMERIC(15, 4);
    example_kpi UUID;
    example_event UUID;
    example_evidence UUID;
    blocked BOOLEAN;
    vote_timestamp_exists BOOLEAN;
BEGIN
    INSERT INTO kpi_definitions (name, unit, target_value, owner_role)
    VALUES ('ci-example-kpi', 'units', 10.0000, 'analyst')
    RETURNING kpi_id INTO example_kpi;

    INSERT INTO kpi_measurements (kpi_id, measured_value)
    VALUES (example_kpi, 12.5000)
    RETURNING variance INTO actual_variance;

    IF actual_variance <> 2.5000 THEN
        RAISE EXCEPTION 'Expected trigger-calculated variance 2.5000, got %',
            actual_variance;
    END IF;

    SELECT EXISTS (
        SELECT 1
          FROM information_schema.columns
         WHERE table_schema = current_schema()
           AND table_name = 'recovery_consensus_votes'
           AND column_name = 'voted_at'
    ) INTO vote_timestamp_exists;

    IF NOT vote_timestamp_exists THEN
        RAISE EXCEPTION 'recovery_consensus_votes.voted_at is missing';
    END IF;

    IF to_regclass('idx_recovery_events_lookup') IS NULL THEN
        RAISE EXCEPTION 'Recovery event lookup index is missing';
    END IF;

    INSERT INTO ring2_recovery_events (node_id, event_type, event_status)
    VALUES ('ci-node', 'validation', 'open')
    RETURNING recovery_event_id INTO example_event;

    INSERT INTO recovery_consensus_votes
        (recovery_event_id, voter_id, vote)
    VALUES
        (example_event, gen_random_uuid(), 'approve');

    INSERT INTO ring2_evidence_ledger (actor_id, event_type, subject_type)
    VALUES (gen_random_uuid(), 'ci-validation', 'test')
    RETURNING evidence_id INTO example_evidence;

    INSERT INTO ring2_chain_of_custody (evidence_id, actor_id, action)
    VALUES (example_evidence, gen_random_uuid(), 'recorded');

    blocked := FALSE;
    BEGIN
        UPDATE ring2_evidence_ledger
           SET event_type = 'modified'
         WHERE evidence_id = example_evidence;
    EXCEPTION WHEN SQLSTATE '55000' THEN
        blocked := TRUE;
    END;
    IF NOT blocked THEN
        RAISE EXCEPTION 'Evidence ledger UPDATE was not rejected';
    END IF;

    blocked := FALSE;
    BEGIN
        DELETE FROM ring2_evidence_ledger
         WHERE evidence_id = example_evidence;
    EXCEPTION WHEN SQLSTATE '55000' THEN
        blocked := TRUE;
    END;
    IF NOT blocked THEN
        RAISE EXCEPTION 'Evidence ledger DELETE was not rejected';
    END IF;

    blocked := FALSE;
    BEGIN
        EXECUTE 'TRUNCATE TABLE ring2_evidence_ledger CASCADE';
    EXCEPTION WHEN SQLSTATE '55000' THEN
        blocked := TRUE;
    END;
    IF NOT blocked THEN
        RAISE EXCEPTION 'Evidence ledger TRUNCATE was not rejected';
    END IF;

    blocked := FALSE;
    BEGIN
        DELETE FROM ring2_chain_of_custody;
    EXCEPTION WHEN SQLSTATE '55000' THEN
        blocked := TRUE;
    END;
    IF NOT blocked THEN
        RAISE EXCEPTION 'Chain-of-custody DELETE was not rejected';
    END IF;

    blocked := FALSE;
    BEGIN
        DELETE FROM kpi_definitions WHERE kpi_id = example_kpi;
    EXCEPTION WHEN SQLSTATE '55000' THEN
        blocked := TRUE;
    END;
    IF NOT blocked THEN
        RAISE EXCEPTION 'KPI definition DELETE was not rejected';
    END IF;
END;
$$;

ROLLBACK;

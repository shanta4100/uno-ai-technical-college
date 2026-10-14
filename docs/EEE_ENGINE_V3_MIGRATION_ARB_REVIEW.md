# EEE Engine V3 Migration — ARB Technical Assessment

**Document ID:** EEE-ARB-ENGINE-V3-MIGRATION-001  
**Review state:** Draft for evidence review  
**Submitted target:** Engine V3 v17.1 R1.0  
**Submitted baseline:** Engine V3 v17.0 R.31 (described as LTS)  
**Submission date in source material:** October 13, 2026  
**Repository verification:** No Engine V3 source, SDK, release notes, test benches, vendor certifications, or deployment manifests were supplied in this repository.

> **Evidence qualification:** This document organizes the submitted migration proposal. Version identities, architectural differences, performance figures, compatibility claims, and product status remain unverified. It is not an approved ARB decision, vendor statement, release assessment, or production-readiness certification.

## 1. Executive summary

The proposal evaluates a migration from a synchronous, CPU-affinity execution model to an asynchronous job-DAG model with optional accelerator offload. It also describes changes to IPC, telemetry, model schemas, determinism, language bindings, and deployment.

The target direction appears to be v17.0 R.31 → v17.1 R1.0, although the supplied subject line says “v17.1 … to v17.0 …”. Confirm migration direction, release identities, and support status against authoritative release artifacts before planning execution.

The supplied requirements identify substantial compatibility and verification work. They do not establish that the target is implemented, that the stated performance or determinism targets have been achieved, or that production approval has been granted.

## 2. Submitted architecture comparison

| Domain | v17.0 R.31 — submitted description | v17.1 R1.0 — submitted description | Review evidence needed |
|---|---|---|---|
| Compute | Static CPU affinity; synchronous pipelines | Asynchronous DAG scheduler; dynamic cores; optional OpenCL/CUDA | Scheduler design, concurrency contract, workload benchmarks, accelerator fallback tests |
| IPC | Shared memory with POSIX semaphores | Lock-free circular buffers; atomic barriers; cache-line alignment | Memory-model proof/review, ABI layout, wraparound/backpressure tests, HIL driver tests |
| Observability | Flat files and TCP heartbeat polling | OpenTelemetry, gRPC streaming, Prometheus metrics | API/security documentation, cardinality/resource tests, migration of monitoring consumers |
| Model ingestion | XML/JSON; load-time schema checks | FlatBuffers/Protobuf binary schemas | Schema definitions, compatibility policy, migration tool, malformed-input/fuzz testing |
| Determinism | IEEE 754 binary64; platform-dependent rounding flags | Claimed bit-exact execution across x86-64 and ARM64 | Reproducible test vectors, compiler/runtime flags, hardware matrix, accelerator determinism evidence |

The table reflects only supplied descriptions. It is not an independently verified product diff.

## 3. Proposed stack and interfaces

The submission proposes C++20/Rust runtime components, Python 3.12 C-API bindings, a .NET 8 wrapper, C ABI exports, OCI containers, bare-metal libraries, and an OpenCL 3.0/CUDA 12.x hardware abstraction layer.

It also proposes:

```c
int32_t EEE_Engine_InitSession(
    const EngineConfig_t* config,
    SessionHandle_t* outHandle
);

int32_t EEE_Engine_StepTick(
    SessionHandle_t handle,
    uint64_t tickCount,
    SimState_t* ioState
);
```

These declarations alone do not specify ABI stability, ownership/lifetime, thread safety, error codes, structure packing, version negotiation, cancellation, or behavior on invalid pointers and stale handles. Those contracts need controlled headers, generated bindings, and compatibility tests.

## 4. Data and execution flow proposal

1. Compile upstream CAD/EEE models into a binary intermediate representation.
2. Validate parameter ranges, numerical stability constraints, and interface pins.
3. Dispatch simulation slices across worker threads with deterministic synchronization.
4. Emit sample vectors through memory-mapped buffers and operational metrics through telemetry exporters.

For each stage, specify trust boundaries, input limits, error handling, data ownership, concurrency rules, audit requirements, and recovery behavior. The stated flow does not demonstrate that any stage exists or has passed verification.

## 5. Non-functional requirements requiring test definitions

| Submitted target | Required clarification before verification |
|---|---|
| Solver step ≤ 10 μs | Define solver, model size, hardware, compiler, warm-up, percentile/statistical method, and included/excluded I/O |
| ≤ 512 MB per worker | Define resident vs allocated memory, workload, peak measurement, accelerator memory, and measurement tooling |
| Bit-exact parity on AMD Zen 4, Intel Sapphire Rapids, and ARM Neoverse | Identify exact CPUs, operating systems, compiler/runtime versions, seeds, test vectors, numerical tolerances or exact-bit criteria, and accelerator scope |
| Mathematical exceptions isolated to execution slice | Define supported exception classes, process/thread boundary, state rollback, host-daemon behavior, and fault-injection evidence |

Bit-exact floating-point parity across different architectures and accelerators is a demanding requirement. It must be demonstrated for a bounded, named configuration; strict FP settings alone do not establish it.

## 6. Migration risks and proposed mitigations

| Risk | Potential impact | Proposed mitigation | Evidence/gate |
|---|---|---|---|
| Binary schema incompatibility | Legacy models fail to load or are transformed incorrectly | Versioned schema migration tool with source/target validation and reversible backups | Golden corpus, round-trip tests, malformed-input tests, signed migration report |
| Plugin ABI/layout changes | Legacy HIL plugins crash, corrupt data, or mis-handle buffers | Compatibility shim and vendor SDK validation | ABI comparison, supported-platform matrix, vendor certification, HIL regression |
| Async scheduling/data races | Nondeterministic or unsafe model state | Document execution semantics, isolate mutable state, instrument race testing | Concurrency review, stress tests, sanitizers, deterministic replay evidence |
| Lock-free IPC defects | Data loss, stale reads, deadlocks, or corruption under load | Specify atomic ordering, ownership, wraparound, and backpressure behavior | Memory-model review, stress/fuzz tests, fault injection, HIL results |
| Accelerator faults or numerical drift | Host instability or divergent simulation outputs | Isolate accelerator work, define fallback and result-validity rules | Driver-fault injection, CPU fallback tests, numerical regression |
| Telemetry migration gaps | Lost monitoring or excessive resource use | Document telemetry compatibility and legacy syslog transition | Collector integration tests, volume/cardinality limits, failure-mode tests |
| Precision/determinism overclaim | Incorrect safety or compliance conclusions | Scope reproducibility claims to tested configurations and evidence | Independent numerical review and signed test artifacts |

The compatibility shim and automated migration utility are proposed mitigations, not verified deliverables.

## 7. Approval gates and required artifacts

Do not characterize this migration as approved for production until the review authority has received and accepted:

1. Authoritative release metadata, support policy, source revisions, and a corrected migration direction.
2. Architecture and interface specifications, including ABI, concurrency, memory ownership, and failure semantics.
3. Schema definitions, migration utility, compatibility policy, and a representative legacy-model corpus.
4. Automated numerical regression results comparing named v17.0 and v17.1 builds.
5. HIL vendor compatibility evidence and signed certifications for supported drivers.
6. Accelerator failure/fallback and worker-isolation test reports.
7. Reproducible performance and memory benchmark methodology/results.
8. Security, dependency, container, and bare-metal distribution review.
9. Open defect list, residual-risk owners, rollback plan, and change-control record.
10. Formal ARB decision with approvers, conditions, date, and referenced evidence package.

## 8. Proposed disposition

**Recommendation:** Continue evidence gathering and compatibility testing. Treat the migration as **Under Review**. Do not infer that “100% Engineering Review Complete,” “Active Feature Branch,” “LTS,” or “Ready for Environment Provisioning” is independently established by this repository.

### Review record

| Field | Status |
|---|---|
| Technical diff | Submitted; not independently verified |
| Target release/source | Not supplied |
| Regression evidence | Not supplied |
| HIL vendor certification | Not supplied |
| Performance/determinism evidence | Not supplied |
| Production approval | Not established |


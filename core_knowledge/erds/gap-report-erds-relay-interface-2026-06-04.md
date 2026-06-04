# ERDS Relay Interface — ETSI Compliance Gap Report (Updated)

**Document type:** Compliance review update  
**Date:** 2026-06-04  
**Subject:** Current OpenAPI (`send/ipg-sercq/openapi/openapi.yml`) vs ETSI EN 319 522  
**Standards basis:** ETSI EN 319 522-1 V1.2.1, EN 319 522-2 V1.2.1, EN 319 522-3 V1.1.1  
**Reference baseline:** `core_knowledge/erds/gap-report-erds-relay-interface-2026-04-13.md`

---

## Executive Summary

This review confirms that the previous blocking issue on identifier structure (B1) is now resolved in the current OpenAPI.

Current gap posture:

| Severity | Count | Notes |
|---|---:|---|
| Blocking | 0 | No missing mandatory Table 5 metadata fields and B1 resolved |
| Important | 3 | Governance + profile constraints still needed |
| Enhancement | 2 | Optional coverage completeness |

---

## Confirmed Improvements Since 2026-04-13

### 1) B1 identifier structure is resolved

The schema now models sender/recipient/user identifiers with explicit SERCQ format metadata and regex constraints:

- `components.x-profile-decisions.B1-Identifier-Structure-Resolution` present with `status: RESOLVED`
- `RelayMetadata.SenderId`, `RelayMetadata.RecipientId`, and `UserDetails.Identifier` all constrained by SERCQ pattern

Result: previous blocking gap **closed**.

### 2) Relay reason model aligns with current profile rules

`EventReasonCode` includes RB01..RB22 + RBXX and `x-etsi-relay-reason-matrix` constrains event-to-reason combinations.

Result: compatibility mapping for relay reasons is **implemented**.

### 3) Mandatory RelayMetadata components are present

Required set (MD01, MD08, MD10, MD13, MD14) is represented in `RelayMetadata.required`.

Result: minimum Table 5 mandatory set remains **covered**.

---

## Remaining Gaps

### I1 — ERD message signing obligation is not explicitly profiled (IMPORTANT)

**ETSI anchor:** EN319522-2 clause 7.1/7.2 (shall sign)  
**Current state:** OpenAPI contains bearer-based security and DPoP notes, but no explicit profile statement that maps the ETSI message-signing obligation to a concrete mechanism and conformance rule.  
**Risk:** Audit/interoperability ambiguity on whether transport-layer controls are considered sufficient vs metadata/signature-layer requirements.  
**Action:** Add explicit profile-governance statement in the spec package (or profile companion) defining how clause 7 "shall sign" is fulfilled and verified.

### I2 — Evidence signature profile is unconstrained (IMPORTANT)

**ETSI anchor:** EN319522-2:8.2.9 (R03), EN319522-3 signature format guidance  
**Current state:** `Evidence.Signature` is present and required, but represented as generic Base64 without declared signature profile/baseline and validation material rules.  
**Risk:** Verification behavior can diverge across ERDS providers.  
**Action:** Constrain signature format/profile (for example, explicit baseline/profile choice and validation requirements).

### I3 — Evidence submission timestamp (M03) missing (IMPORTANT)

**ETSI anchor:** EN319522-2:8.2.25 (M03)  
**Current state:** No `SubmissionDateAndTime` field in `Evidence`.  
**Risk:** Incomplete evidence payload for profiles/evidence types that require M-components traceability.  
**Action:** Add M03 field or publish explicit out-of-scope statement tied to evidence types supported in this profile release.

---

## Enhancement Items

### E1 — Expand optional RelayMetadata coverage

Optional fields not yet modeled in `RelayMetadata`: MD03, MD04, MD05, MD06, MD07, MD09, MD12, MD15, optional metadata `Signature`.

This is not a mandatory conformance defect, but improves semantic completeness and interoperability readiness.

### E2 — Publish implementation profile constraints as normative companion

Several policy decisions already exist in `x-profile-*` metadata. Consolidating these into a versioned profile companion document would improve auditability and reduce interpretation drift.

---

## Delta vs Previous Gap Report (2026-04-13)

- B1 moved from **Blocking** to **Resolved**.
- Relay reason compatibility now explicitly implemented in schema/profile metadata.
- No new blocking defects identified.
- Important items remain concentrated in governance/profile explicitness, not in core mandatory metadata presence.

---

## Recommended Director Decisions

1. Approve clause 7 signing fulfillment model (transport vs payload/metadata signature obligations).
2. Approve evidence signature profile constraints and validation policy.
3. Confirm evidence-type scope for release and M03 handling strategy (implement now or explicitly defer).

---

*Prepared by Kipi — ETSI Compliance Validator (update review based on current OpenAPI).*
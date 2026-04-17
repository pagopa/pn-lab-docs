# ERDS Relay Interface — ETSI Compliance Gap Report

**Document type:** Compliance analysis — for review and decision  
**Date:** 2026-04-13  
**Subject:** PN Lab relay interface draft vs. ETSI EN 319 522  
**Interface under review:** ERDS-RI (ERDS Relay Interface), relay endpoint — HTTP/JSON profile  
**Standards basis:** ETSI EN 319 522-1 V1.2.1, EN 319 522-2 V1.2.1, EN 319 522-3 V1.1.1  
**Confidentiality:** Internal — for Director review  

---

## Executive Summary

A first compliance mapping has been completed between the PN Lab relay interface draft and the ETSI EN 319 522 standard suite (Parts 1–3). The analysis covers relay metadata semantics, evidence components, and identifier structures.

**The current draft is well-structured and demonstrates strong alignment with the ETSI semantic model.** All mandatory relay metadata components required by the standard are present in the draft. The most significant gap is a structural one: mandatory sender and recipient identifiers are implemented as plain strings, whereas ETSI requires a qualified form (scheme + value) to guarantee cross-provider uniqueness.

**After applying the official ETSI cardinality table (Table 5, EN 319 522-2), 8 of the 11 previously flagged "missing" fields have been reclassified as optional — their absence does not constitute a conformance defect.**

**Net compliance position after cardinality pass:**

| Severity | Count | Description |
|---|---|---|
| 🔴 Blocking | 1 | Identifier structure on mandatory fields |
| 🟡 Important | 3 | Signing obligation governance + evidence constraints |
| 🟢 Enhancement | 7 | Optional components not yet implemented |

**Only one item requires action before the draft can be declared conformant with ETSI mandatory requirements.**

---

## Standards Coverage

| Standard | Version | Role in this analysis |
|---|---|---|
| ETSI EN 319 522-1 | V1.2.1 | Architecture, 4-corner model, abstract event catalogue |
| ETSI EN 319 522-2 | V1.2.1 | Relay metadata semantics, evidence components, identifier definition |
| ETSI EN 319 522-3 | V1.1.1 | Wire formats, entity/user/assurance types, signature profile |

### Official Normative Schema Source

The ETSI schema file `1952203xmlSchema.xsd` is treated as an official normative resource for this profile.

- Official source ingested in workspace: `user-data/etsi-specifications/incoming/1952203xmlSchema.xsd`
- Project copy used in relay package: `send/ipg-sercq/1952203xmlSchema.xsd`

This XSD defines both `Evidence` and `RelayMetadata` types. For this report update, the primary focus is the `Evidence` model and its placement in the relay JSON payload.

---

## Relay Payload Positioning (JSON Profile)

The relay transport model in the current OpenAPI draft is:

- `userContent` -> business payload
- `relayMetadata` -> relay/routing metadata
- `evidence[]` -> one or more ETSI evidence objects

This means the ETSI XSD `Evidence` structure is mapped inside `ERDDispatch.evidence[]` (array), not as the root transport object.

| Relay payload block | ETSI semantic domain | Mapping status |
|---|---|---|
| `userContent` | Application content (outside ETSI Evidence root) | Profile-specific |
| `relayMetadata` | ETSI RelayMetadata | Partially aligned |
| `evidence[]` | ETSI Evidence (`EvidenceType`) | Aligned with profile adaptations |

### Evidence Mapping Notes (XSD -> JSON profile)

- XSD `Evidence/@version` is represented as JSON property `EvidenceVersion`.
- XSD optional `Evidence/@Id` is currently not exposed in JSON schema.
- XSD `UserContentInfo` is optional in `EvidenceType`, but profile makes it mandatory to preserve digest continuity.
- XSD `ds:Signature` is optional by cardinality, while profile currently requires `Signature` in the `Evidence` schema.
- Several optional ETSI Evidence components (`SenderDelegateDetails`, `RecipientsDelegateDetails`, `ExternalERDSDetails`, `TransactionLogInformation`, `Extensions`) are not currently represented.

These differences are interpreted as profile choices unless they collide with mandatory ETSI obligations.

---

## Relay Metadata Cardinality — ETSI Table 5

The following table reproduces the official cardinality of relay metadata components as defined in Table 5 of ETSI EN 319 522-2 V1.2.1. **Mandatory fields (cardinality = 1) are highlighted.**

| Component code | Component name | Cardinality | Status in draft |
|---|---|---|---|
| MD01 | Metadata version | **1 — Mandatory** | ✓ Implemented |
| MD02 | Relay date and time | 0-1 — Optional | ⚠ Partial (field present, behavior unspecified) |
| MD03 | Expiry date and time | 0-1 — Optional | ○ Not implemented — conformant |
| MD04 | Recipient required LoA | 0-1 — Optional | ○ Not implemented — conformant |
| MD05 | Applicable policy | 0-n — Optional | ○ Not implemented — conformant |
| MD06 | Mode of consignment | 0-1 — Optional | ○ Not implemented — conformant |
| MD07 | Scheduled delivery | 0-1 — Optional | ○ Not implemented — conformant |
| MD08 | Sender's identifier | **1 — Mandatory** | ⚠ Partial — plain string, scheme missing |
| MD09 | Reply-to | 0-1 — Optional | ○ Not implemented — conformant |
| MD10 | Recipient's identifier | **1 — Mandatory** | ⚠ Partial — plain string, scheme missing |
| MD11 | Message identifier | 0-1 — Optional | ✓ Implemented |
| MD12 | In reply to | 0-1 — Optional | ○ Not implemented — conformant |
| MD13 | ERD message type | **1 — Mandatory** | ✓ Implemented |
| MD14 | User content information | **1 — Mandatory** | ✓ Implemented |
| MD15 | Extensions | 0-1 — Optional | ○ Not implemented — conformant |
| Signature | Relay metadata signature | 0-1 — Optional (see §3.1) | ⚠ Governance decision required |

**Legend:**  
✓ Implemented and adequate | ⚠ Partial | ○ Not implemented — no conformance defect | ✗ Missing — required, not present

---

## Gap Detail

### 🔴 B1 — Identifier structure is underspecified (BLOCKING)

**ETSI requirement:** `EN319522-2:5.2` — Identifiers shall consist of a scheme name and a value, and shall be unique within the interoperating ERDS network.  
**Mandatory fields affected:** MD08 (Sender's identifier, cardinality = 1), MD10 (Recipient's identifier, cardinality = 1)  
**Current state:** `SenderId`, `RecipientId`, and `UserDetails.Identifier` are implemented as plain strings. The scheme component is absent.  
**Business impact:** Without a scheme-qualified identifier, cross-ERDS uniqueness cannot be guaranteed. A bare string like `user@domain.it` is ambiguous — different providers may interpret it under different schemes.  
**Required action:** Remodel identifier fields as a structured object: `{ schemeName: string, value: string }`, or define and document a canonical serialization format (e.g., `scheme:value`) that carries both parts unambiguously.  
**Effort estimate:** Schema change — moderate. Two schemas affected (`RelayMetadata`, `UserDetails`).

---

### 🟡 I1 — ERD message signing obligation — governance decision required

**ETSI requirement:** `EN319522-2:7.1-7.2` — "All ERD messages shall be digitally signed."  
**Cardinality note:** The relay metadata Signature component (Table 5) is 0-1 — its presence in the schema is optional. However, the normative "shall sign" obligation in clause 7 is independent of the schema optionality.  
**Current state:** The draft uses PDND bearer token authentication at the transport layer. No explicit statement covers how the ETSI "shall sign" clause is satisfied.  
**Business impact:** The profile is technically schema-conformant (Signature=0-1), but the normative signing obligation is unaddressed. An external auditor or interoperating ERDS could challenge the profile on this basis.  
**Required action:** A profile governance decision is needed — not necessarily a schema change. The profile document must explicitly state: *"The ERD message signing obligation under clause 7.1-7.2 is fulfilled by [PDND mechanism / relay metadata Signature component]."* If PDND transport signing is considered equivalent, this must be documented and justified with reference to the relevant PDND/Interop specification.

---

### 🟡 I2 — Evidence signature profile is not constrained

**ETSI requirement:** `EN319522-2:8.2.9/R03`, `EN319522-3:5.2.2.28`  
**Current state:** `Evidence.Signature` is a Base64-encoded field. No format profile (XAdES, CAdES, PAdES), no baseline level, and no validation material requirements are specified.  
**Business impact:** A receiving ERDS cannot verify the evidence signature without knowing the format. Interoperability between providers will be uncertain.  
**Required action:** Constrain signature format in the profile. For XML-based evidence payloads, XAdES-B-B enveloped is the most natural ETSI alignment. Specify how certificate chain and validation material are made available.

---

### 🟡 I3 — Evidence submission timestamp missing

**ETSI requirement:** `EN319522-2:8.2.25/M03` — Submission date and time is an evidence messaging component.  
**Current state:** No submission timestamp is present in the `Evidence` schema.  
**Business impact:** Incomplete for evidence types that include message handling (M-type) components. May affect legal evidentiary value of generated proofs.  
**Required action:** Add a `SubmissionDateAndTime` field to the `Evidence` schema. Conditional on the evidence types supported by the profile.

---

## Optional Components — Enhancement Opportunities

The following items are **not conformance defects**. All have cardinality 0-1 or 0-n per ETSI Table 5. They are recorded here as capability gaps the profile may wish to address as it matures.

| Enhancement | ETSI Component | Benefit if added |
|---|---|---|
| E1 — Delivery constraint metadata | MD03, MD04, MD05, MD06, MD07 | Express expiry, LoA requirements, policy constraints, delivery modes, scheduling |
| E2 — Reply and thread metadata | MD09, MD12 | Enable standard-aligned reply workflows and message threading |
| E3 — Extensibility bucket | MD15 | Forward-compatibility path for domain-specific metadata |
| E4 — Structured assurance details | MD04 / AssuranceLevelsDetailsType | Replace flat string with ETSI-structured LoA + policy + auth object |
| E5 — Structured entity identity | EntityDetailsType, UserDetailsType | Replace string arrays with SAML-attribute-like identity objects |
| E6 — Evidence reason granularity | G04 EventReasons | Consider per-evidence-type requirements |
| E7 — Non-standard endpoint label | `GET /status` | Mark explicitly as implementation-specific, not ETSI-defined |

---

## Overall Compliance Scorecard

| Area | Mandatory fields | Status |
|---|---|---|
| Relay metadata core | MD01, MD08, MD10, MD13, MD14 | ⚠ All present; MD08 and MD10 structurally partial |
| Evidence core | G01–G05, R02, R03, M02 | ✓ Mostly complete; R03 profile unspecified |
| Evidence messaging | M03 | ✗ Missing |
| Identifier model | Clause 5.2 | ✗ Structurally non-conformant |
| Transport binding | Clause 7 | ⚠ Governance decision pending |
| Optional relay metadata | MD02–MD07, MD09, MD11, MD12, MD15 | ○ Conformant by absence |

**29 ETSI requirements mapped. Complete: 9 | Partial: 12 | Missing (required): 2 | Optional, not implemented: 8 | Out of ETSI scope: 1**

---

## Recommended Decision Points for Directors

Three decisions are needed before the profile can be published as a conformant ERDS interoperability proposal:

**Decision 1 — Identifier model** *(blocking)*  
Choose: structured object `{ schemeName, value }` vs. canonical serialization string `scheme:value`. This drives schema changes in `RelayMetadata` and `UserDetails`.

**Decision 2 — Signing obligation governance** *(important, no schema change required)*  
Confirm: does PDND transport-layer authentication satisfy the ETSI clause 7 "shall sign" obligation? If yes, document formally in the profile. If no, add a relay metadata Signature component.

**Decision 3 — Evidence type scope** *(important, bounded scope)*  
Which evidence types (G, R, I, M) are in scope for the initial profile? This determines whether M03 (`SubmissionDateAndTime`) and G04 (`EventReasons`) strictness are required.

---

## Scope Boundary

This analysis covers relay interface semantic conformance against ETSI EN 319 522 Parts 1–3.  
The following are explicitly out of scope for this report:

- ETSI EN 319 522-4 (protocol bindings) — not yet ingested; HTTP binding compliance assessment deferred
- PDND/Interop internal specification conformance
- Legal/eIDAS regulation compliance beyond ETSI EN 319 522

---

*Analysis generated by Kipi — ETSI Compliance Validator. Source artifacts available in the project repository.*  
*This report reflects the relay interface draft state as of 2026-04-13. It should be re-evaluated after each material change to the interface specification.*

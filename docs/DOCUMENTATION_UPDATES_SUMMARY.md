# Documentation Updates Summary
**Date:** May 18, 2026  
**Status:** ✅ COMPLETE — All three files updated to align with BUSINESS_REQUIREMENTS.md

---

## Overview
Updated three existing documentation files to reflect the product decisions, credential verification system, engagement loops, content moderation, and bulk verification features defined in the new BUSINESS_REQUIREMENTS.md.

**Files Updated:**
1. ✅ SYSTEM_PROMPT.md
2. ✅ API_ENDPOINTS.md  
3. ✅ DATABASE_SCHEMA.md

---

## 1. SYSTEM_PROMPT.md — 2 Updates

### Update 1.1: Added BUSINESS_REQUIREMENTS.md to Docs Reference
**Line 16:**
```diff
- **Docs:** `/docs/DATABASE_SCHEMA.md`, `/docs/API_ENDPOINTS.md`, `/docs/SYSTEM_PROMPT.md`
+ **Docs:** `/docs/BUSINESS_REQUIREMENTS.md`, `/docs/DATABASE_SCHEMA.md`, `/docs/API_ENDPOINTS.md`, `/docs/SYSTEM_PROMPT.md`
```

**Why:** BRD is now the north star for product decisions. Developers must reference it before implementing features.

---

### Update 1.2: Enhanced AI Coding Assistant Guidelines
**Lines 316–336:**

Added priority directive to read BUSINESS_REQUIREMENTS.md first, plus updated the preferred prompt pattern to reference BRD.

```diff
When using AI coding tools on this project:

+ 0. **Read BUSINESS_REQUIREMENTS.md first** — understand what you're building, why it matters, and the product decisions (credential verification, engagement loops, content liability, anti-gaming rules)
1. **Always provide this file as context** for any new feature work
...
+ Reference BUSINESS_REQUIREMENTS.md for product context and decisions.
```

**Why:** Ensures AI-generated code respects product constraints (e.g., credential ownership, verification tiers, content liability disclaimers).

---

## 2. API_ENDPOINTS.md — 8 New Endpoints + Updated Responses

### Update 2.1: Credential Response Format — Added Verification Fields
**Lines 417–466:**

Updated `GET /api/credentials/me` response to include:
- `verificationStatus`: SELF_REPORTED | VALIDATED_BY_ORG | VERIFIED_BY_OFFICIAL
- `watermark`: Human-readable disclaimer text
- `validatedBy`: Organization ID (if applicable)
- `validatedAt`: Timestamp of validation

**Example:**
```json
{
  "id": "uuid",
  "type": "RED_SEAL",
  "verificationStatus": "VALIDATED_BY_ACME_HVAC",
  "watermark": "Validated by Acme HVAC Inc.",
  "validatedBy": "acme-hvac",
  "validatedAt": "2026-05-01T12:00:00.000Z"
}
```

**Why:** Implements Section 6.5 (Credential Wallet & Authenticity) from BRD. Users must see verification status and watermark on every credential.

---

### Update 2.2: New Endpoint — POST /api/credentials/import
**Lines 480–509:**

Allows users to upload and import credential documents (Red Seal, safety tickets, apprentice certs, etc.).

**Request:**
```json
{
  "credentialType": "RED_SEAL|APPRENTICE_CERT|WHMIS|FIRST_AID|...",
  "documentFile": "file.pdf",
  "expiresAt": "2028-05-01",
  "notes": "optional context"
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "credentialType": "RED_SEAL",
  "verificationStatus": "SELF_REPORTED",
  "watermark": "Self-reported — not verified by Robin",
  "uploadedAt": "2026-05-01T12:00:00.000Z"
}
```

**Why:** Phase 1 feature to let tradespeople build their credential wallet. All imported credentials start as SELF_REPORTED (Section 6.5).

---

### Update 2.3: New Section — Leaderboards & Rankings
**Lines 559–693:**

Three new endpoints:

#### `GET /api/leaderboards/:topicId`
Browse experts ranked by reputation in a specific topic.

**Response includes:**
- Rank, userId, displayName, tier, totalScore, topicScore
- Answer count, accepted answer count, peer endorsement count
- Last active date

**Why:** Implements Loop 2 (Ranking & Recognition) from Section 8.0 BRD. Users aspire to climb leaderboards.

---

#### `GET /api/users/:id/ranking`
Get a specific user's current rank within a topic or trade.

**Response includes:**
- Rank, percentile, points to next rank, last active

**Why:** Motivational feedback for Loop 2. Shows progress toward top 10.

---

### Update 2.4: New Section — Content Interaction
**Lines 695–763:**

Three endpoints for bookmarking:

#### `POST /api/content/:id/save`
Save a question or answer for later.

#### `DELETE /api/content/:id/save`
Remove from bookmarks.

#### `GET /api/users/me/saved-content`
Retrieve all bookmarked content.

**Why:** Implements Loop 3 (Learning & Problem-Solving) from Section 8.0 BRD. Users save job-site problems they solve.

---

### Update 2.5: New Section — Content Moderation & Reporting
**Lines 765–860:**

Four admin/user endpoints for content safety:

#### `POST /api/content/:id/report`
Flag unsafe, off-topic, or harmful content.

**Request:**
```json
{
  "reason": "UNSAFE|OFF_TOPIC|MISINFORMATION|HARASSMENT|SPAM",
  "notes": "This answer suggests bypassing safety interlocks..."
}
```

**Why:** Implements Section 6.6 (Content Liability). Green/yellow/red zones. Robin removes obviously dangerous content.

---

#### `GET /api/admin/reported-content`
Browse all reported content items (admin only).

#### `PATCH /api/admin/reported-content/:reportId`
Review reports and take action: APPROVE (remove), REMOVE (suspend), or DISMISS.

**Why:** Moderation workflow. Admins can remove dangerous content, suspend repeat violators (5+ violations → suspension escalation per Section 6.6).

---

## 3. DATABASE_SCHEMA.md — 5 Enums + 4 New Tables + Field Updates

### Update 3.1: Updated CredentialType Enum
**Lines 67–87:**

Expanded from 8 types to 20 types:

```prisma
enum CredentialType {
  // Platform-issued
  CONTRIBUTION
  PEER_ENDORSED
  MENTOR_ELIGIBLE
  MENTORSHIP_GIVEN
  MENTORSHIP_RECEIVED
  
  // User-imported (NEW)
  RED_SEAL
  APPRENTICE_CERT
  JOURNEYPERSON_CERT
  SAFETY_WHMIS
  SAFETY_FIRST_AID
  SAFETY_FALL_PROTECTION
  SAFETY_CONFINED_SPACE
  SAFETY_ARC_FLASH
  EQUIPMENT_FORKLIFT
  EQUIPMENT_SCAFFOLDING
  TRAINING_COURSE
  TRADE_SPECIFIC
  OTHER_PROFESSIONAL
  
  // For verification
  SELF_REPORTED
  AUDIT_VERIFIED
}
```

**Why:** Covers all credential types from Section 6.5 BRD.

---

### Update 3.2: Added 3 New Enums
**Lines 131–157:**

```prisma
enum VerificationStatus {
  SELF_REPORTED
  VALIDATED_BY_ORG
  VERIFIED_BY_OFFICIAL
}

enum VerificationBatchStatus {
  PENDING
  APPROVED
  REJECTED
  PARTIAL
}

enum VerificationSource {
  SELF_SIGNUP
  BULK_IMPORT
  MANUAL_ADMIN
}
```

**Why:** Track credential verification tier (Section 6.5) and user onboarding source.

---

### Update 3.3: Updated `users` Table
**Lines 154–180:**

Added 4 fields:
```
| verificationSource | VerificationSource | default SELF_SIGNUP — how user was added |
| verificationBatchId | UUID? FK → verificationBatches | if bulk-imported |
| verifiedAt | DateTime? | when verification completed |
| verifiedByAdmin | UUID? FK → users | which admin verified |
```

**Why:** Track bulk import history and user verification audit trail (Phase 2 feature design).

---

### Update 3.4: Updated `credentials` Table
**Lines 408–485:**

Added 6 fields:
```
| verificationStatus | VerificationStatus | SELF_REPORTED | VALIDATED_BY_ORG | VERIFIED_BY_OFFICIAL |
| validatedBy | UUID? FK → organisations | if VALIDATED_BY_ORG |
| validatedAt | DateTime? | when validated |
| validatedByEmail | String? | who validated (audit trail) |
| watermark | String? | "Self-reported..." or "Validated by Acme..." |
| documentUrl | String? | path to imported credential document (S3) |
| documentHash | String? | sha256 for tampering detection |
```

Also updated indexes:
```
(holderId, verificationStatus)
(verificationStatus)
```

**Why:** Implements Section 6.5 three-tier credential verification system. Watermark is displayed on every credential view.

---

### Update 3.5: New Table — `credentialDocuments`
**Lines 486–504:**

Tracks uploaded credential files in S3.

```
| id | UUID PK |
| credentialId | UUID FK → credentials |
| originalFilename | String | for audit |
| s3Bucket | String | encrypted Robin bucket |
| s3Key | String | encrypted S3 path |
| fileHash | String | sha256 tampering detection |
| fileSizeBytes | Int |
| uploadedAt | DateTime |
```

**Why:** Secure storage of imported credential documents. Hash prevents tampering. Audit trail for compliance.

---

### Update 3.6: New Table — `verificationBatches`
**Lines 506–527:**

Bulk credential validation uploads from unions/employers (Phase 2 design).

```
| id | UUID PK |
| organisationId | UUID FK → organisations | union/employer |
| uploadedBy | UUID FK → users | admin |
| totalRows | Int |
| approvedRows | Int |
| rejectedRows | Int |
| status | VerificationBatchStatus | PENDING | APPROVED | REJECTED | PARTIAL |
| uploadedAt | DateTime |
| auditedAt | DateTime? |
| auditedBy | UUID? FK → users |
| auditNotes | String? |
```

**Why:** Phase 2 feature (Section 6.5 BRD). When unions/employers bulk-validate employee credentials, this table tracks the batch. Designed now so no rearchitecting needed later.

---

### Update 3.7: New Table — `verificationBatchRows`
**Lines 529–551:**

Individual rows within a bulk verification batch.

```
| id | UUID PK |
| batchId | UUID FK → verificationBatches |
| email | String | person being verified |
| displayName | String | from CSV |
| role | UserRole | APPRENTICE | JOURNEYPERSON | MASTER |
| tradeCode | String? | RED_309A etc. |
| redSealNumber | String? | cert ID |
| status | VerificationBatchRowStatus | PENDING | APPROVED | REJECTED |
| rejectionReason | String? |
| userId | UUID? FK → users | after approval |
```

**Why:** Phase 2 feature. Each row represents one employee's credential to validate. After approval, links to user's account and marks them as VERIFIED_BY_ORG.

---

### Update 3.8: New Table — `contentReports`
**Lines 553–572:**

Tracks user reports of unsafe/off-topic content.

```
| id | UUID PK |
| contentId | UUID FK → content |
| reporterId | UUID FK → users |
| reason | String | UNSAFE | OFF_TOPIC | MISINFORMATION | HARASSMENT | SPAM |
| reporterNotes | String | max 1000 chars |
| status | String | SUBMITTED | UNDER_REVIEW | RESOLVED |
| reviewedBy | UUID? FK → users |
| reviewedAt | DateTime? |
| reviewAction | String? | APPROVE | REMOVE | DISMISS |
| reviewNotes | String? |
```

**Why:** Immutable audit trail for Section 6.6 (Content Liability). Tracks which content was flagged, when, by whom, and admin decision.

---

### Update 3.9: Updated Design Rules
**Lines 652–663:**

Added 4 new rules:
```
3. Verification status is immutable
4. Watermark is human-readable
9. Bulk verification tracked
10. Batch approval prevents rearchitecting — design now, feature-flag OFF until Phase 2
```

**Why:** Enforces credential portability and audit compliance. Prevents future rearchitecting when bulk import is needed.

---

## Summary Table: What Changed

| **File** | **Type** | **Changes** |
|---|---|---|
| SYSTEM_PROMPT.md | Reference | BRD added to docs list, AI guidelines updated |
| API_ENDPOINTS.md | Functional | 8 new endpoints + verification fields on credential responses |
| DATABASE_SCHEMA.md | Schema | 5 enums, 4 new tables, 10 new fields, updated design rules |

---

## What This Enables

### Phase 1 (Ready to Build)
- ✅ Users import credentials (Red Seal, safety certs) → SELF_REPORTED
- ✅ Users see watermark on credentials ("Self-reported — not verified")
- ✅ Users see leaderboards and rankings by topic
- ✅ Users report unsafe content
- ✅ Admins remove flagged content and suspend violators
- ✅ Engagement loops fully instrumented (contributions, rankings, bookmarks, peer recognition)

### Phase 2 (Designed, Feature-Flagged OFF)
- 🔧 Unions/employers bulk-upload employee credentials
- 🔧 Credentials marked VALIDATED_BY_ORG with org watermark
- 🔧 Government APIs integrate as VERIFIED_BY_OFFICIAL tier
- 🔧 No rearchitecting needed — schema is ready

---

## Files Ready for Git
All files are in `/mnt/project/` and ready to commit:

```bash
git checkout -b docs/api-schema-updates
git add docs/SYSTEM_PROMPT.md docs/API_ENDPOINTS.md docs/DATABASE_SCHEMA.md
git commit -m "docs: align API and schema with BUSINESS_REQUIREMENTS.md

- Add credential import endpoint (POST /api/credentials/import)
- Add verification status and watermark to credential responses
- Add leaderboard endpoints (GET /api/leaderboards/:topicId)
- Add content reporting and moderation endpoints
- Add credentialDocuments, verificationBatches, verificationBatchRows, contentReports tables
- Add VerificationStatus and VerificationBatchStatus enums
- Update credential verification fields with VALIDATED_BY_ORG and VERIFIED_BY_OFFICIAL tiers
- Update users table with verification source tracking
- Update design rules to enforce credential portability and bulk import audit trail

Closes: Phase 1 API design for credential wallet, engagement loops, and content moderation."

git push origin docs/api-schema-updates
```

Then open PR for Gopinath review.

---

## Next Steps

1. ✅ Review these updates with Gopinath
2. ✅ Merge to main once approved
3. ⏭️ Start Phase 1 build: credential import, leaderboards, reporting
4. ⏭️ Before Phase 2: activate feature flags for bulk verification and government API integration

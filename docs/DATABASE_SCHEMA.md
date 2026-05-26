# DATABASE_SCHEMA.md

> **Living document.** Update this file whenever the Prisma schema changes.  
> If this file and `schema.prisma` disagree, `schema.prisma` is the source of truth.

---

## Overview

PostgreSQL 16. ORM: Prisma. All timestamps are `TIMESTAMPTZ` (UTC).  
Primary keys are UUIDs generated server-side.  
Canadian data residency: AWS `ca-central-1` only.

### Multi-tenancy model

**Option A — shared database with `organisation_id` column.**  
Every tenant-scoped table carries an `organisation_id` foreign key.  
All queries filter by `organisation_id` at the application layer.

**Critical rule:** An individual tradesperson's credential wallet is  
portable and belongs to them — not to their current union or employer.  
Credentials are never scoped to an organisation. They are scoped to a user.

---

## Enums

```prisma
enum UserRole {
  APPRENTICE
  JOURNEYPERSON
  MASTER
  EMPLOYER_ADMIN
  UNION_ADMIN
  PLATFORM_ADMIN
}

enum AccountStatus {
  ONBOARDING
  ACTIVE
  SUSPENDED
  DEACTIVATED
}

enum InstitutionType {
  UNION
  EMPLOYER
  COLLEGE
  APPRENTICESHIP_BOARD
  ONLINE_PROVIDER
}

enum ContentType {
  QUESTION
  ANSWER
  POST
}

enum ContentStatus {
  DRAFT
  PENDING_REVIEW
  PUBLISHED
  FLAGGED
  REMOVED
}

enum CredentialType {
  CONTRIBUTION
  PEER_ENDORSED
  MENTOR_ELIGIBLE
  MENTORSHIP_GIVEN
  MENTORSHIP_RECEIVED
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
  SELF_REPORTED
  AUDIT_VERIFIED
}

enum MentorshipStatus {
  REQUESTED
  ACTIVE
  COMPLETED
  DECLINED
  ABANDONED
}

enum ReputationEventType {
  POST_PUBLISHED
  ANSWER_ACCEPTED
  CONTENT_UPVOTED
  PEER_ENDORSEMENT_RECEIVED
  AUDIT_PASSED
  AUDIT_FAILED
  MENTORSHIP_COMPLETED
  MENTEE_MILESTONE_ACHIEVED
  CREDENTIAL_ISSUED
  PENALTY_APPLIED
}

enum EndorsementStatus {
  PENDING
  ACCEPTED
  REJECTED
  FLAGGED
}

enum AuditOutcome {
  PASSED
  FAILED
  ESCALATED
}

enum AuditTrigger {
  RANDOM
  NEW_HIGH_VOLUME
  DOMAIN_EXPANSION
  PATTERN_FLAG
}

enum NotificationType {
  ENDORSEMENT_RECEIVED
  MENTORSHIP_REQUESTED
  MENTORSHIP_ACCEPTED
  MENTORSHIP_MILESTONE
  CONTENT_UPVOTED
  ANSWER_ACCEPTED
  CREDENTIAL_ISSUED
  MENTOR_ELIGIBLE
  AUDIT_RESULT
}

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

enum VerificationBatchRowStatus {
  PENDING
  APPROVED
  REJECTED
}

enum VerificationSource {
  SELF_SIGNUP
  BULK_IMPORT
  MANUAL_ADMIN
}
```

---

## Tables

### `organisations`
Tenant root table. Every union local, employer, college, and apprenticeship  
board is an organisation. Platform itself is not an organisation.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| type | InstitutionType | |
| name | String | max 200 chars |
| provinceCode | String? | 2-char province code |
| websiteUrl | String? | |
| logoUrl | String? | |
| isPartner | Boolean | paying partner — default false |
| isActive | Boolean | default true |
| createdAt | DateTime | |

---

### `users`
Individual tradespeople, employers, and admins. Central to everything.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| auth0Id | String? UNIQUE | Auth0 `sub` claim |
| email | String UNIQUE | case-insensitive |
| displayName | String | max 120 chars |
| avatarUrl | String? | |
| role | UserRole | default APPRENTICE |
| status | AccountStatus | default ONBOARDING |
| provinceCode | String? | 2-char |
| yearsExperience | Int? | |
| employerName | String? | free text, not FK |
| unionLocalId | UUID? FK → organisations | optional |
| bio | String? | |
| onboardingStep | Int | default 0 |
| onboardingDone | Boolean | default false |
| lastActiveAt | DateTime? | |
| verificationSource | VerificationSource | default SELF_SIGNUP — how user was added to platform |
| verificationBatchId | UUID? FK → verificationBatches | if bulk-imported, which batch |
| verifiedAt | DateTime? | when user verification was completed |
| verifiedByAdmin | UUID? FK → users | which admin verified them |
| createdAt | DateTime | |
| updatedAt | DateTime | auto-updated |

**Indexes:** `auth0Id`, `email`, `status`, `verificationSource`

---

### `userTrades`
Associates a user with one or more Red Seal trades.  
`isPrimary` = true for their main trade (only one per user).

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| userId | UUID FK → users | |
| tradeId | UUID FK → trades | |
| specialisationId | UUID? FK → tradeSpecialisations | |
| isPrimary | Boolean | default false |
| verifiedAt | DateTime? | when ticket was verified |
| redSealNumber | String? | |
| createdAt | DateTime | |

**Unique constraint:** `(userId, tradeId)`

---

### `trades`
Reference table. Red Seal and provincial trades.  
Seeded on migration — not user-editable.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| code | String UNIQUE | e.g. `RED_309A` |
| name | String | |
| isRedSeal | Boolean | default true |
| provinceCode | String? | NULL = national |
| isActive | Boolean | default true |
| createdAt | DateTime | |

**Seed data (8 trades):**
- RED_309A — Electrician (Construction)
- RED_306A — Plumber
- RED_313A — Refrigeration & Air Conditioning Mechanic
- RED_308A — Steamfitter / Pipefitter
- RED_421A — Welder
- RED_310A — Industrial Electrician
- RED_433A — Ironworker (Generalist)
- RED_301A — Carpenter

---

### `tradeSpecialisations`
Sub-categories within a trade. Drives content tagging and peer matching.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| tradeId | UUID FK → trades | |
| name | String | max 120 chars |
| isActive | Boolean | default true |

---

### `expertiseTopics`
Granular topic tags for SME content. Scoped to a trade.  
Used for content tagging, peer endorsements, and feed filtering.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| tradeId | UUID? FK → trades | NULL = cross-trade |
| name | String | max 120 chars |
| slug | String UNIQUE | URL-safe, e.g. `panel-installation-wiring` |
| description | String? | |
| isActive | Boolean | default true |

---

### `organisationMembers`
Links users to organisations (unions, employers).  
A user can belong to multiple organisations.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| organisationId | UUID FK → organisations | |
| userId | UUID FK → users | |
| memberNumber | String? | union member number |
| role | String? | e.g. `apprentice_coordinator` |
| joinedAt | DateTime? | |
| createdAt | DateTime | |

**Unique constraint:** `(organisationId, userId)`

---

### `reputationScores`
One row per user. Updated asynchronously by background job.  
Never written to directly from API routes — use `reputationEvents`.

| Column | Type | Notes |
|--------|------|-------|
| userId | UUID PK FK → users | one-to-one |
| totalScore | Int | default 0 |
| contentScore | Int | from posts and answers |
| peerEndorsementScore | Int | from verified peers |
| mentorshipScore | Int | from mentorship outcomes |
| auditScore | Int | from human audit results |
| mentorEligible | Boolean | default false |
| mentorEligibleAt | DateTime? | when threshold was first crossed |
| tier | String | default `apprentice` |
| calculatedAt | DateTime | |

---

### `reputationEvents`
Immutable audit trail. Every point change is recorded here.  
The reputation score is a materialised view of this table.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| userId | UUID FK → users | |
| eventType | ReputationEventType | |
| points | Int | can be negative |
| referenceId | UUID? | post_id, endorsement_id, etc. |
| metadata | Json? | |
| createdAt | DateTime | |

**Index:** `(userId, createdAt DESC)`

---

### `peerEndorsements`
A verified user endorses another's expertise in a specific topic.  
Written rationale is required — no one-click endorsements.  
`weight` > 1.0 for endorsements from outside the endorser's immediate network.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| endorserId | UUID FK → users | must be verified in same trade |
| recipientId | UUID FK → users | |
| topicId | UUID FK → expertiseTopics | |
| rationale | String | required, no empty strings |
| status | EndorsementStatus | default PENDING |
| weight | Decimal | default 1.0 — cross-network gets >1.0 |
| isSameTrade | Boolean | |
| reviewedAt | DateTime? | |
| createdAt | DateTime | |

**Constraint:** `endorserId ≠ recipientId`  
**Index:** `(recipientId, status)`

---

### `content`
Questions, answers, and knowledge posts.  
All content passes through AI screening before publishing.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| authorId | UUID FK → users | |
| type | ContentType | |
| parentId | UUID? FK → content | answers reference parent question |
| tradeId | UUID? FK → trades | |
| topicId | UUID? FK → expertiseTopics | |
| title | String? | questions and posts only, max 300 |
| body | String | min 20 chars |
| status | ContentStatus | default PENDING_REVIEW |
| upvoteCount | Int | default 0 — denormalised for performance |
| viewCount | Int | default 0 |
| isAccepted | Boolean | accepted answer flag, default false |
| aiQualityScore | Decimal? | 0.00–1.00 |
| aiDomainScore | Decimal? | 0.00–1.00 |
| aiScreenedAt | DateTime? | |
| publishedAt | DateTime? | |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Indexes:** `(authorId)`, `(tradeId, topicId, status)`, `(parentId)`  
**Full-text index:** `to_tsvector('english', coalesce(title,'') || ' ' || body)`

---

### `contentVotes`
One vote per user per content item. Drives `upvoteCount`.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| contentId | UUID FK → content | |
| voterId | UUID FK → users | |
| createdAt | DateTime | |

**Unique constraint:** `(contentId, voterId)`

---

### `aiScreeningResults`
One row per AI screening run per content item.  
Preserved for calibration against human audit outcomes.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| contentId | UUID FK → content | |
| qualityScore | Decimal | |
| domainScore | Decimal | |
| flags | String[] | e.g. `['off_topic', 'low_detail']` |
| modelUsed | String | e.g. `claude-sonnet-4-20250514` |
| promptVersion | String | e.g. `1.0.0` |
| rawResponse | Json? | |
| screenedAt | DateTime | |

---

### `contentAudits`
Human audit records. Triggered randomly or by behavioural pattern flags.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| contentId | UUID FK → content | |
| auditorId | UUID FK → users | must be PLATFORM_ADMIN |
| triggerType | AuditTrigger | |
| outcome | AuditOutcome | |
| notes | String? | |
| auditedAt | DateTime | |

---

### `credentials`
Portable Open Badges 3.0 credentials. Owned by the individual — never by an organisation.  
`issuedBy` is NULL for platform-issued credentials.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| holderId | UUID FK → users | |
| issuedBy | UUID? FK → organisations | NULL = platform issued |
| type | CredentialType | |
| name | String | max 200 chars |
| description | String? | |
| tradeId | UUID? FK → trades | |
| topicId | UUID? FK → expertiseTopics | |
| badgeUrl | String? | Open Badge JSON endpoint URL |
| imageUrl | String? | |
| criteriaUrl | String? | |
| issuedAt | DateTime | |
| expiresAt | DateTime? | |
| revokedAt | DateTime? | NULL = not revoked |
| revocationReason | String? | |
| ob3Assertion | Json? | full Open Badges 3.0 assertion |
| verificationHash | String? | cryptographic signature |
| isPublic | Boolean | default true |
| verificationStatus | VerificationStatus | default SELF_REPORTED — see Section 6.5 BRD |
| validatedBy | UUID? FK → organisations | organisation that validated (if status = VALIDATED_BY_ORG) |
| validatedAt | DateTime? | when organisation marked as validated |
| validatedByEmail | String? | email of person who validated (audit trail) |
| watermark | String? | human-readable text: "Self-reported — not verified by Robin" or "Validated by [Org]" |
| documentUrl | String? | path to stored document (credential import) — S3 encrypted |
| documentHash | String? | sha256 of original file for tampering detection |
| createdAt | DateTime | |

**Indexes:** `(holderId, type)`, `(holderId, verificationStatus)`, `(isPublic, issuedAt DESC)`, `(verificationStatus)`

---

### `credentialDocuments`
Tracks uploaded credential documents (Red Seal, safety certs, apprentice records, etc.).  
Files stored in S3 encrypted at rest. Used for verification and audit trails.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| credentialId | UUID FK → credentials | |
| originalFilename | String | for audit trail |
| s3Bucket | String | default `robin-credentials-ca-central-1` |
| s3Key | String | encrypted path in S3 |
| fileHash | String | sha256 for tampering detection |
| fileSizeBytes | Int | |
| uploadedAt | DateTime | |
| createdAt | DateTime | |

**Indexes:** `credentialId`, `uploadedAt`

---

### `verificationBatches`
Bulk credential verification upload from unions/employers (Phase 2 feature, design now).  
Tracks which credentials were validated by an organisation in bulk.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| organisationId | UUID FK → organisations | union or employer |
| uploadedBy | UUID FK → users | admin who uploaded batch |
| totalRows | Int | total rows in CSV |
| approvedRows | Int | rows marked APPROVED |
| rejectedRows | Int | rows marked REJECTED |
| status | VerificationBatchStatus | PENDING → APPROVED → done |
| uploadedAt | DateTime | |
| auditedAt | DateTime? | when batch was reviewed |
| auditedBy | UUID? FK → users | which admin audited |
| auditNotes | String? | reason for rejection if REJECTED |
| createdAt | DateTime | |

**Indexes:** `(organisationId, status)`, `uploadedAt`

---

### `verificationBatchRows`
Individual rows within a bulk verification batch.  
Each row represents one credential to validate (email + trade + cert type).

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| batchId | UUID FK → verificationBatches | which batch |
| email | String | person being verified |
| displayName | String | from CSV |
| role | UserRole | APPRENTICE \| JOURNEYPERSON \| MASTER from CSV |
| tradeCode | String? | RED_309A etc. |
| redSealNumber | String? | credential ID if available |
| status | VerificationBatchRowStatus | PENDING → APPROVED → done |
| rejectionReason | String? | why rejected if status = REJECTED |
| userId | UUID? FK → users | after approval, links to user account |
| createdAt | DateTime | |

**Indexes:** `(batchId, status)`, `email`

---

### `contentReports`
User-generated reports of unsafe, off-topic, or harmful content.  
Immutable audit trail. Used for moderation and pattern detection.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| contentId | UUID FK → content | which content was reported |
| reporterId | UUID FK → users | who reported it |
| reason | String | UNSAFE \| OFF_TOPIC \| MISINFORMATION \| HARASSMENT \| SPAM |
| reporterNotes | String | max 1000 chars — context |
| status | String | SUBMITTED \| UNDER_REVIEW \| RESOLVED |
| reviewedBy | UUID? FK → users | which admin reviewed |
| reviewedAt | DateTime? | when reviewed |
| reviewAction | String? | APPROVE \| REMOVE \| DISMISS |
| reviewNotes | String? | why approved/dismissed |
| createdAt | DateTime | |

**Indexes:** `(contentId, status)`, `reporterId`, `(status, createdAt DESC)`

---
Structured mentorship between a mentor and mentee.  
Both must be on the platform. Mentor must have `mentorEligible = true`.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| mentorId | UUID FK → users | must have mentorEligible = true |
| menteeId | UUID FK → users | |
| tradeId | UUID? FK → trades | |
| status | MentorshipStatus | default REQUESTED |
| goals | String | required — what the mentee wants to achieve |
| requestNote | String? | |
| startedAt | DateTime? | |
| completedAt | DateTime? | |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Constraint:** `mentorId ≠ menteeId`

---

### `mentorshipMilestones`
Goals within a mentorship relationship. Set collaboratively.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| relationshipId | UUID FK → mentorshipRelationships | |
| title | String | max 200 chars |
| description | String? | |
| achievedAt | DateTime? | NULL = not yet achieved |
| createdAt | DateTime | |

---

### `mentorshipReviews`
Post-completion review. One per party per relationship.  
Permanent and visible on both profiles.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| relationshipId | UUID FK → mentorshipRelationships | |
| reviewerId | UUID FK → users | |
| rating | Int | 1–5 |
| reviewText | String? | |
| isPublic | Boolean | default true |
| createdAt | DateTime | |

**Unique constraint:** `(relationshipId, reviewerId)`

---

### `notifications`
In-app notifications. Not email — use a separate email service for that.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| userId | UUID FK → users | |
| type | NotificationType | |
| title | String | max 200 chars |
| body | String? | |
| referenceId | UUID? | links to relevant entity |
| isRead | Boolean | default false |
| createdAt | DateTime | |

**Index:** `(userId, isRead, createdAt DESC)`

---

## Migration History

| File | Date | Description |
|------|------|-------------|
| 001_initial_schema.sql | 2026-05 | Initial schema — all core tables |
| 002_prisma_migration | TBD | Prisma migration — translates 001 |

---

## Design Rules

1. **Never delete data** — use soft deletes (`revokedAt`, `status = REMOVED`, `isActive = false`)
2. **Credentials are individual-owned** — no `organisationId` on the credentials table, ever
3. **Verification status is immutable** — once VALIDATED_BY_ORG, cannot be changed back to SELF_REPORTED
4. **Watermark is human-readable** — "Self-reported — not verified by Robin" or "Validated by [Org Name]"
5. **Reputation is event-sourced** — write to `reputationEvents`, never directly to `reputationScores`
6. **AI scores are advisory** — human audit outcomes always take precedence
7. **All PII in `ca-central-1`** — Canadian data residency is non-negotiable
8. **UUIDs everywhere** — never expose sequential integer IDs in URLs
9. **Bulk verification tracked** — all organisations must log which users they verified, when, and by whom
10. **Batch approval prevents rearchitecting** — design verificationBatches now (Phase 1) but feature-flag OFF until Phase 2 when first enterprise requests it

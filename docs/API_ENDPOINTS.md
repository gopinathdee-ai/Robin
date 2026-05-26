# API_ENDPOINTS.md

> **Living document.** Update this file whenever an endpoint is added, changed, or removed.  
> Base URL: `http://localhost:4000` (development) — `https://api.trades-platform.ca` (production)

---

## Conventions

- All endpoints are prefixed with `/api`
- All request and response bodies are `application/json`
- All timestamps are ISO 8601 UTC strings: `2026-05-01T12:00:00.000Z`
- All IDs are UUIDs
- Authentication via Auth0 JWT in `Authorization: Bearer <token>` header
- Pagination uses `?page=1&limit=20` — default limit is 20, max is 100
- Errors always return `{ "error": "message", "details"?: [...] }`

---

## Authentication

### `POST /api/auth/callback`
Auth0 callback handler. Exchanges Auth0 code for session.  
Handled by `@auth0/nextjs-auth0` — not a custom route.

### `GET /api/auth/me`
Returns the current authenticated user's profile.

**Auth:** Required

**Response 200:**
```json
{
  "id": "uuid",
  "email": "mike@example.com",
  "displayName": "Mike T.",
  "role": "JOURNEYPERSON",
  "status": "ACTIVE",
  "onboardingDone": true,
  "avatarUrl": "https://...",
  "provinceCode": "AB",
  "yearsExperience": 8,
  "createdAt": "2026-05-01T12:00:00.000Z"
}
```

---

## Users

### `PATCH /api/users/me`
Update the current user's profile or onboarding step.

**Auth:** Required

**Request body** (all fields optional):
```json
{
  "displayName": "Mike T.",
  "provinceCode": "AB",
  "yearsExperience": 8,
  "employerName": "ABC Electrical Ltd.",
  "bio": "15 years in commercial electrical.",
  "onboardingStep": 2,
  "onboardingDone": false
}
```

**Response 200:** Updated user object (same shape as `GET /api/auth/me`)

**Validation:**
- `displayName` min 2 chars, max 120
- `provinceCode` must be a valid Canadian province/territory code
- `yearsExperience` 0–60

---

### `GET /api/users/:id`
Get a public user profile by ID.

**Auth:** Not required for public profiles

**Response 200:**
```json
{
  "id": "uuid",
  "displayName": "Mike T.",
  "role": "JOURNEYPERSON",
  "provinceCode": "AB",
  "avatarUrl": "https://...",
  "bio": "...",
  "trades": [
    { "code": "RED_309A", "name": "Electrician (Construction)", "isPrimary": true }
  ],
  "reputationTier": "journeyperson",
  "totalScore": 420,
  "mentorEligible": false,
  "credentialCount": 7,
  "createdAt": "2026-05-01T12:00:00.000Z"
}
```

---

## Trades

### `GET /api/trades`
List all active trades. Cached — changes infrequently.

**Auth:** Not required

**Response 200:**
```json
{
  "items": [
    {
      "id": "uuid",
      "code": "RED_309A",
      "name": "Electrician (Construction)",
      "isRedSeal": true,
      "provinceCode": null
    }
  ]
}
```

---

### `GET /api/trades/:id/specialisations`
List specialisations for a trade.

**Auth:** Not required

**Response 200:**
```json
{
  "tradeId": "uuid",
  "items": [
    { "id": "uuid", "name": "Panel installation & wiring" }
  ]
}
```

---

### `GET /api/trades/:id/topics`
List expertise topics for a trade. Used for content tagging and endorsements.

**Auth:** Not required

**Response 200:**
```json
{
  "tradeId": "uuid",
  "items": [
    { "id": "uuid", "name": "Panel installation & wiring", "slug": "panel-installation-wiring" }
  ]
}
```

---

### `POST /api/users/me/trades`
Associate a trade with the current user.

**Auth:** Required

**Request body:**
```json
{
  "tradeId": "uuid",
  "specialisationId": "uuid",
  "isPrimary": true,
  "redSealNumber": "309A-12345"
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "tradeId": "uuid",
  "isPrimary": true,
  "createdAt": "2026-05-01T12:00:00.000Z"
}
```

**Validation:**
- Only one `isPrimary: true` per user — setting a new primary demotes the previous one
- `tradeId` must exist and be active

---

## Content

### `GET /api/content`
Paginated content feed filtered by trade and/or topic.  
Only returns `PUBLISHED` content with `aiQualityScore >= 0.35`.

**Auth:** Not required (authenticated users get personalised ranking)

**Query params:**
- `tradeId` — filter by trade
- `topicId` — filter by topic
- `type` — `question` | `answer` | `post`
- `page` — default 1
- `limit` — default 20, max 100

**Response 200:**
```json
{
  "items": [
    {
      "id": "uuid",
      "type": "question",
      "title": "What's the most common mistake...",
      "body": "...",
      "author": {
        "id": "uuid",
        "displayName": "Mike T.",
        "reputationTier": "journeyperson"
      },
      "trade": { "code": "RED_309A", "name": "Electrician (Construction)" },
      "topic": { "slug": "panel-installation-wiring", "name": "Panel installation & wiring" },
      "upvoteCount": 12,
      "answerCount": 3,
      "publishedAt": "2026-05-01T12:00:00.000Z"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 143
}
```

---

### `GET /api/content/:id`
Single content item with its answers.

**Auth:** Not required

**Response 200:**
```json
{
  "id": "uuid",
  "type": "question",
  "title": "...",
  "body": "...",
  "author": { "id": "uuid", "displayName": "Mike T.", "reputationTier": "journeyperson" },
  "upvoteCount": 12,
  "isAccepted": false,
  "publishedAt": "2026-05-01T12:00:00.000Z",
  "answers": [
    {
      "id": "uuid",
      "body": "...",
      "author": { "id": "uuid", "displayName": "Sarah K.", "reputationTier": "master" },
      "upvoteCount": 8,
      "isAccepted": true,
      "publishedAt": "2026-05-01T14:00:00.000Z"
    }
  ]
}
```

---

### `POST /api/content`
Submit new content. All submissions enter `PENDING_REVIEW` status.  
AI screening runs asynchronously — do not poll; listen for notification.

**Auth:** Required  
**Rate limit:** 10 requests per minute per user

**Request body:**
```json
{
  "type": "question",
  "tradeId": "uuid",
  "topicId": "uuid",
  "title": "What is the correct torque spec for...",
  "body": "I am working on a 200A panel and want to confirm..."
}
```

For answers, omit `title` and include `parentId`:
```json
{
  "type": "answer",
  "parentId": "uuid",
  "body": "The torque spec for that breaker is..."
}
```

**Response 202:**
```json
{
  "id": "uuid",
  "status": "PENDING_REVIEW",
  "message": "Your contribution is being reviewed and will be published shortly."
}
```

**Validation:**
- `body` min 20 chars, max 10,000
- `title` required for `question` and `post`, min 10 chars, max 300
- `parentId` required for `answer`
- `type` must be `question` | `answer` | `post`

---

### `POST /api/content/:id/vote`
Upvote a content item. Idempotent — voting twice removes the vote.

**Auth:** Required

**Response 200:**
```json
{ "upvoteCount": 13, "voted": true }
```

---

## Reputation

### `GET /api/users/me/reputation`
Current user's reputation breakdown and progress toward mentor tier.

**Auth:** Required

**Response 200:**
```json
{
  "totalScore": 420,
  "tier": "journeyperson",
  "mentorEligible": false,
  "mentorThreshold": 750,
  "progressPercent": 56,
  "breakdown": {
    "contentScore": 210,
    "peerEndorsementScore": 145,
    "mentorshipScore": 0,
    "auditScore": 65
  },
  "recentEvents": [
    {
      "eventType": "CONTENT_UPVOTED",
      "points": 5,
      "createdAt": "2026-05-01T12:00:00.000Z"
    }
  ]
}
```

---

## Endorsements

### `POST /api/endorsements`
Endorse a peer's expertise in a specific topic.  
Endorser must be verified in the same trade as the topic.

**Auth:** Required

**Request body:**
```json
{
  "recipientId": "uuid",
  "topicId": "uuid",
  "rationale": "Sarah has consistently demonstrated deep knowledge of panel installation. Her answers on three separate questions were the most technically accurate and practical I have seen on this platform."
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "status": "PENDING",
  "weight": 1.4,
  "createdAt": "2026-05-01T12:00:00.000Z"
}
```

**Validation:**
- Cannot endorse yourself
- `rationale` min 80 chars — no short endorsements
- Must have verified status in the same trade as the topic's trade

---

### `GET /api/users/:id/endorsements`
List endorsements received by a user.

**Auth:** Not required

**Response 200:**
```json
{
  "items": [
    {
      "id": "uuid",
      "topic": { "name": "Panel installation & wiring" },
      "endorser": { "displayName": "Mike T.", "reputationTier": "master" },
      "rationale": "...",
      "weight": 1.4,
      "createdAt": "2026-05-01T12:00:00.000Z"
    }
  ]
}
```

---

## Credentials

### `GET /api/credentials/me`
Current user's full credential wallet.

**Auth:** Required

**Response 200:**
```json
{
  "items": [
    {
      "id": "uuid",
      "type": "CONTRIBUTION",
      "name": "First Contribution",
      "description": "Awarded for first published knowledge contribution.",
      "trade": { "code": "RED_309A", "name": "Electrician (Construction)" },
      "issuedAt": "2026-05-01T12:00:00.000Z",
      "expiresAt": null,
      "isPublic": true,
      "badgeUrl": "https://api.trades-platform.ca/credentials/uuid/badge.json",
      "verificationHash": "sha256:abc123...",
      "verificationStatus": "SELF_REPORTED",
      "watermark": "Self-reported — not verified by Robin",
      "validatedBy": null,
      "validatedAt": null
    },
    {
      "id": "uuid",
      "type": "RED_SEAL",
      "name": "Red Seal Electrician",
      "description": "Red Seal Certification - Electrician (Construction)",
      "trade": { "code": "RED_309A", "name": "Electrician (Construction)" },
      "issuedAt": "2020-06-15T00:00:00.000Z",
      "expiresAt": null,
      "isPublic": true,
      "badgeUrl": null,
      "verificationHash": null,
      "verificationStatus": "VALIDATED_BY_ACME_HVAC",
      "watermark": "Validated by Acme HVAC Inc.",
      "validatedBy": "acme-hvac",
      "validatedAt": "2026-05-01T12:00:00.000Z"
    }
  ]
}
```

**Fields:**
- `verificationStatus`: `SELF_REPORTED` | `VALIDATED_BY_[ORG_NAME]` | `VERIFIED_BY_OFFICIAL`
- `watermark`: Human-readable text shown on credential display
- `validatedBy`: Organization ID that validated (if applicable)
- `validatedAt`: Timestamp of validation

---

### `GET /api/credentials/:id`
Single public credential. Used for external verification.

**Auth:** Not required

**Response 200:** Single credential object (same shape as above)  
**Response 404:** Credential not found or not public

---

### `POST /api/credentials/import`
Upload and import a credential document (Red Seal, safety ticket, apprentice cert, etc.).

**Auth:** Required

**Content-Type:** multipart/form-data

**Request:**
- `credentialType`: string (e.g., "RED_SEAL", "APPRENTICE_CERT", "JOURNEYPERSON_CERT", "WHMIS", "FIRST_AID", "FALL_PROTECTION", "FORKLIFT", "TRADE_COURSE", "OTHER")
- `documentFile`: binary file (PDF, JPG, PNG; max 10MB)
- `expiresAt`: optional ISO 8601 date (when credential expires)
- `notes`: optional string (context about the credential)

**Response 201:**
```json
{
  "id": "uuid",
  "credentialType": "RED_SEAL",
  "verificationStatus": "SELF_REPORTED",
  "watermark": "Self-reported — not verified by Robin",
  "documentUrl": "https://api.trades-platform.ca/credentials/uuid/document",
  "uploadedAt": "2026-05-01T12:00:00.000Z",
  "expiresAt": null,
  "isPublic": true
}
```

**Validation:**
- `credentialType` must be from allowed list
- `documentFile` required, max 10MB
- File format must be PDF, JPG, or PNG
- `expiresAt` must be valid ISO 8601 date if provided

**Response 400:** Validation failed  
**Response 413:** File too large

---

### `GET /api/credentials/:id/badge.json`
Open Badges 3.0 assertion JSON. Used by badge verifiers and wallets.

**Auth:** Not required  
**Content-Type:** `application/json`

**Response 200:**
```json
{
  "@context": ["https://www.w3.org/2018/credentials/v1", "https://imsglobal.github.io/openbadges-specification/ob_v3p0.html"],
  "type": ["VerifiableCredential", "OpenBadgeCredential"],
  "id": "https://api.trades-platform.ca/credentials/uuid/badge.json",
  "issuer": {
    "id": "https://api.trades-platform.ca/issuers/main",
    "type": "Profile",
    "name": "Trades Platform"
  },
  "issuanceDate": "2026-05-01T12:00:00.000Z",
  "credentialSubject": {
    "id": "did:example:holder-uuid",
    "type": "AchievementSubject",
    "achievement": {
      "id": "https://api.trades-platform.ca/achievements/first-contribution",
      "type": "Achievement",
      "name": "First Contribution",
      "description": "Awarded for first published knowledge contribution.",
      "criteria": { "narrative": "User published their first knowledge contribution that passed AI quality screening." }
    }
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2026-05-01T12:00:00.000Z",
    "verificationMethod": "https://api.trades-platform.ca/issuers/main#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "..."
  }
}
```

---

## Leaderboards & Rankings

### `GET /api/leaderboards/:topicId`
Browse experts ranked by reputation in a specific expertise topic.

**Auth:** Not required  
**Query params:**
- `limit`: default 20, max 100
- `offset`: default 0

**Response 200:**
```json
{
  "topicId": "uuid",
  "topicName": "Panel installation & wiring",
  "items": [
    {
      "rank": 1,
      "userId": "uuid",
      "displayName": "Sarah K.",
      "reputationTier": "master",
      "totalScore": 850,
      "topicScore": 420,
      "answerCount": 47,
      "acceptedAnswerCount": 12,
      "peerEndorsementCount": 8,
      "provinceCode": "AB",
      "avatarUrl": "https://...",
      "lastActiveAt": "2026-05-17T14:00:00.000Z"
    },
    {
      "rank": 2,
      "userId": "uuid",
      "displayName": "Mike T.",
      "reputationTier": "journeyperson",
      "totalScore": 420,
      "topicScore": 285,
      "answerCount": 23,
      "acceptedAnswerCount": 6,
      "peerEndorsementCount": 3,
      "provinceCode": "AB",
      "avatarUrl": "https://...",
      "lastActiveAt": "2026-05-16T10:30:00.000Z"
    }
  ]
}
```

---

### `GET /api/users/:id/ranking`
Get a specific user's current rank within a topic or trade.

**Auth:** Not required

**Query params:**
- `topicId`: UUID (required if `tradeId` not provided)
- `tradeId`: UUID (required if `topicId` not provided)

**Response 200:**
```json
{
  "userId": "uuid",
  "displayName": "Sarah K.",
  "topicId": "uuid",
  "topicName": "Panel installation & wiring",
  "rank": 1,
  "totalUsers": 247,
  "percentile": 99,
  "totalScore": 850,
  "topicScore": 420,
  "nextRankAt": null,
  "pointsToNextRank": null,
  "lastActiveAt": "2026-05-17T14:00:00.000Z"
}
```

---

## Content Interaction

### `POST /api/content/:id/save`
Save/bookmark a question or answer for later reference.

**Auth:** Required

**Response 201:**
```json
{
  "contentId": "uuid",
  "saved": true,
  "savedAt": "2026-05-01T12:00:00.000Z"
}
```

---

### `DELETE /api/content/:id/save`
Remove a saved item from bookmarks.

**Auth:** Required

**Response 204:** No content

---

### `GET /api/users/me/saved-content`
Retrieve all saved/bookmarked content for current user.

**Auth:** Required

**Query params:**
- `page`: default 1
- `limit`: default 20, max 100

**Response 200:**
```json
{
  "items": [
    {
      "id": "uuid",
      "type": "question",
      "title": "What is the correct torque spec for...",
      "author": { "id": "uuid", "displayName": "Mike T.", "reputationTier": "journeyperson" },
      "upvoteCount": 12,
      "savedAt": "2026-05-01T12:00:00.000Z",
      "trade": { "code": "RED_309A", "name": "Electrician (Construction)" }
    }
  ]
}
```

---

## Content Moderation & Reporting

### `POST /api/content/:id/report`
Flag potentially unsafe, off-topic, or harmful content.

**Auth:** Required

**Request body:**
```json
{
  "reason": "UNSAFE" | "OFF_TOPIC" | "MISINFORMATION" | "HARASSMENT" | "SPAM",
  "notes": "This answer suggests bypassing electrical safety interlocks, which could cause serious injury or death."
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "contentId": "uuid",
  "status": "SUBMITTED",
  "createdAt": "2026-05-01T12:00:00.000Z",
  "message": "Thank you for the report. Our moderation team will review this within 24 hours."
}
```

**Validation:**
- `reason` required — must be from enum
- `notes` min 20 chars, max 1000
- Rate limit: 5 reports per minute per user
- Cannot report own content

**Response 429:** Rate limit exceeded

---

### `GET /api/admin/reported-content`
Admin endpoint: Browse all reported content items (PLATFORM_ADMIN only).

**Auth:** Required (PLATFORM_ADMIN role)

**Query params:**
- `status`: SUBMITTED | UNDER_REVIEW | RESOLVED (default: all)
- `reason`: UNSAFE | OFF_TOPIC | MISINFORMATION | HARASSMENT | SPAM (optional filter)
- `limit`: default 20, max 100
- `offset`: default 0

**Response 200:**
```json
{
  "items": [
    {
      "reportId": "uuid",
      "contentId": "uuid",
      "contentType": "answer",
      "contentBody": "This answer suggests bypassing...",
      "author": { "id": "uuid", "displayName": "Mike T.", "reputationTier": "journeyperson" },
      "reason": "UNSAFE",
      "reporterNotes": "Could cause serious injury",
      "reportedAt": "2026-05-01T12:00:00.000Z",
      "status": "SUBMITTED",
      "reviewedBy": null,
      "reviewedAt": null,
      "reviewNotes": null
    }
  ]
}
```

---

### `PATCH /api/admin/reported-content/:reportId`
Admin endpoint: Review a report and take action (PLATFORM_ADMIN only).

**Auth:** Required (PLATFORM_ADMIN role)

**Request body:**
```json
{
  "action": "APPROVE" | "REMOVE" | "DISMISS",
  "notes": "Content removed. User suspended for 30 days per Section 6.6 Content Liability policy."
}
```

**Outcomes:**
- `APPROVE`: Mark report as valid, remove content (soft delete), send notification to author
- `REMOVE`: Content status → REMOVED, author receives warning
- `DISMISS`: Report deemed incorrect, reporter notified

**Response 200:**
```json
{
  "reportId": "uuid",
  "status": "RESOLVED",
  "action": "REMOVE",
  "contentRemoved": true,
  "authorNotified": true,
  "reviewedAt": "2026-05-01T13:00:00.000Z"
}
```

**Validation:**
- `action` required
- `notes` min 10 chars required for REMOVE actions
- Only PLATFORM_ADMIN can perform

---

## Mentorship

### `GET /api/mentors`
Browse available mentors. Requires authentication.  
Only returns users with `mentorEligible = true`.

**Auth:** Required

**Query params:**
- `tradeId` — filter by trade
- `provinceCode` — filter by province
- `page`, `limit`

**Response 200:**
```json
{
  "items": [
    {
      "id": "uuid",
      "displayName": "Sarah K.",
      "trade": { "code": "RED_309A", "name": "Electrician (Construction)" },
      "reputationTier": "master",
      "totalScore": 1240,
      "mentorshipCount": 3,
      "provinceCode": "AB",
      "bio": "..."
    }
  ]
}
```

---

### `POST /api/mentorships`
Request a mentorship relationship.

**Auth:** Required

**Request body:**
```json
{
  "mentorId": "uuid",
  "tradeId": "uuid",
  "goals": "I want to improve my understanding of commercial panel work and prepare for my journeyperson exam.",
  "requestNote": "I have seen your answers on the platform and found them very clear."
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "status": "REQUESTED",
  "mentorId": "uuid",
  "menteeId": "uuid",
  "createdAt": "2026-05-01T12:00:00.000Z"
}
```

**Validation:**
- `goals` min 50 chars
- Cannot request mentorship from yourself
- Mentor must have `mentorEligible = true`
- Cannot have more than 2 active mentorship relationships simultaneously

---

### `PATCH /api/mentorships/:id`
Accept, decline, or complete a mentorship.

**Auth:** Required (mentor or mentee depending on action)

**Request body:**
```json
{ "status": "ACTIVE" }
```

Valid transitions:
- `REQUESTED → ACTIVE` (mentor only)
- `REQUESTED → DECLINED` (mentor only)
- `ACTIVE → COMPLETED` (either party)
- `ACTIVE → ABANDONED` (either party)

---

### `GET /api/mentorships/me`
All mentorship relationships for the current user (as mentor or mentee).

**Auth:** Required

**Response 200:**
```json
{
  "asMentor": [ { "id": "uuid", "status": "ACTIVE", "mentee": { "displayName": "..." } } ],
  "asMentee": [ { "id": "uuid", "status": "REQUESTED", "mentor": { "displayName": "..." } } ]
}
```

---

### `POST /api/mentorships/:id/reviews`
Submit a post-completion review. One per party per relationship.

**Auth:** Required

**Request body:**
```json
{
  "rating": 5,
  "reviewText": "Sarah was an excellent mentor. Patient, knowledgeable, and always available.",
  "isPublic": true
}
```

**Validation:**
- Relationship must have `status = COMPLETED`
- `rating` must be 1–5
- Cannot review your own mentorship

---

## Notifications

### `GET /api/notifications`
Current user's notifications, most recent first.

**Auth:** Required

**Query params:** `?unreadOnly=true`

**Response 200:**
```json
{
  "items": [
    {
      "id": "uuid",
      "type": "CREDENTIAL_ISSUED",
      "title": "New credential earned",
      "body": "You earned the First Contribution badge.",
      "isRead": false,
      "createdAt": "2026-05-01T12:00:00.000Z"
    }
  ],
  "unreadCount": 3
}
```

---

### `PATCH /api/notifications/:id`
Mark a notification as read.

**Auth:** Required

**Request body:** `{ "isRead": true }`

**Response 200:** Updated notification object

---

## Health

### `GET /health`
API health check. No auth required. Used by Docker and load balancer.

**Response 200:**
```json
{
  "status": "ok",
  "timestamp": "2026-05-01T12:00:00.000Z",
  "version": "0.1.0"
}
```

---

## Error Reference

| Status | Meaning | Common causes |
|--------|---------|---------------|
| 400 | Bad request | Validation failed — check `details` array |
| 401 | Unauthorised | Missing or expired Auth0 token |
| 403 | Forbidden | Authenticated but not allowed (e.g. wrong role) |
| 404 | Not found | Resource doesn't exist or isn't public |
| 409 | Conflict | Duplicate — e.g. voting twice, duplicate trade |
| 422 | Unprocessable | Business rule violation — e.g. endorsing yourself |
| 429 | Rate limited | Slow down — check `Retry-After` header |
| 500 | Server error | Something went wrong — check API logs |

---

## Rate Limits

| Endpoint group | Limit |
|----------------|-------|
| All `/api` routes | 200 requests / 15 minutes |
| `POST /api/content` | 10 requests / minute |
| `POST /api/endorsements` | 5 requests / minute |
| `POST /api/mentorships` | 3 requests / hour |

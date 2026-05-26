-- =============================================================
-- Trades Credential & Mentorship Platform
-- Database Schema — v0.1.0
-- PostgreSQL 16
-- =============================================================
-- Run order: this file only. Subsequent changes go in
-- numbered migration files: 002_add_x.sql, etc.
-- =============================================================

-- ── Extensions ───────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- fuzzy text search
CREATE EXTENSION IF NOT EXISTS "citext";     -- case-insensitive text

-- =============================================================
-- REFERENCE DATA
-- =============================================================

-- ── Trades (Red Seal and provincial) ─────────────────────────
CREATE TABLE trades (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code          VARCHAR(20) NOT NULL UNIQUE,   -- e.g. 'RED_309A'
  name          VARCHAR(120) NOT NULL,
  is_red_seal   BOOLEAN NOT NULL DEFAULT true,
  province_code CHAR(2),                       -- NULL = national
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Trade specialisations ─────────────────────────────────────
CREATE TABLE trade_specialisations (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trade_id  UUID NOT NULL REFERENCES trades(id) ON DELETE CASCADE,
  name      VARCHAR(120) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- ── Expertise topics (drives SME content tagging) ────────────
CREATE TABLE expertise_topics (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trade_id    UUID REFERENCES trades(id) ON DELETE SET NULL,
  name        VARCHAR(120) NOT NULL,
  slug        VARCHAR(120) NOT NULL UNIQUE,
  description TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true
);

-- =============================================================
-- USERS & IDENTITY
-- =============================================================

CREATE TYPE user_role AS ENUM (
  'apprentice',
  'journeyperson',
  'master',
  'employer_admin',
  'union_admin',
  'platform_admin'
);

CREATE TYPE account_status AS ENUM (
  'onboarding',     -- completing initial setup
  'active',
  'suspended',
  'deactivated'
);

CREATE TABLE users (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth0_id          VARCHAR(128) UNIQUE,        -- Auth0 sub claim
  email             CITEXT NOT NULL UNIQUE,
  display_name      VARCHAR(120) NOT NULL,
  avatar_url        TEXT,
  role              user_role NOT NULL DEFAULT 'apprentice',
  status            account_status NOT NULL DEFAULT 'onboarding',
  province_code     CHAR(2),
  years_experience  SMALLINT,
  employer_name     VARCHAR(200),
  union_local_id    UUID,                       -- FK added after union table
  bio               TEXT,
  onboarding_step   SMALLINT NOT NULL DEFAULT 0,
  onboarding_done   BOOLEAN NOT NULL DEFAULT false,
  last_active_at    TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_auth0_id    ON users(auth0_id);
CREATE INDEX idx_users_email       ON users(email);
CREATE INDEX idx_users_status      ON users(status);

-- ── User trade associations ───────────────────────────────────
CREATE TABLE user_trades (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trade_id             UUID NOT NULL REFERENCES trades(id),
  specialisation_id    UUID REFERENCES trade_specialisations(id),
  is_primary           BOOLEAN NOT NULL DEFAULT false,
  verified_at          TIMESTAMPTZ,             -- when ticket was verified
  red_seal_number      VARCHAR(50),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, trade_id)
);

-- =============================================================
-- INSTITUTIONS (Unions, Employers, Colleges)
-- =============================================================

CREATE TYPE institution_type AS ENUM (
  'union',
  'employer',
  'college',
  'apprenticeship_board',
  'online_provider'
);

CREATE TABLE institutions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type          institution_type NOT NULL,
  name          VARCHAR(200) NOT NULL,
  province_code CHAR(2),
  website_url   TEXT,
  logo_url      TEXT,
  is_partner    BOOLEAN NOT NULL DEFAULT false,  -- paying partner
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE institution_members (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  member_number  VARCHAR(80),
  role           VARCHAR(80),                    -- e.g. 'apprentice_coordinator'
  joined_at      TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(institution_id, user_id)
);

-- Add union FK now that institutions exists
ALTER TABLE users ADD CONSTRAINT fk_users_union
  FOREIGN KEY (union_local_id) REFERENCES institutions(id) ON DELETE SET NULL;

-- =============================================================
-- REPUTATION SYSTEM
-- =============================================================

-- ── Reputation score (one row per user, updated async) ───────
CREATE TABLE reputation_scores (
  user_id               UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_score           INTEGER NOT NULL DEFAULT 0,
  content_score         INTEGER NOT NULL DEFAULT 0,  -- from posts/answers
  peer_endorsement_score INTEGER NOT NULL DEFAULT 0, -- from verified peers
  mentorship_score      INTEGER NOT NULL DEFAULT 0,  -- from mentorship outcomes
  audit_score           INTEGER NOT NULL DEFAULT 0,  -- from audit results
  mentor_eligible       BOOLEAN NOT NULL DEFAULT false,
  mentor_eligible_at    TIMESTAMPTZ,
  tier                  VARCHAR(40) NOT NULL DEFAULT 'apprentice',
  calculated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Reputation events (immutable audit trail) ─────────────────
CREATE TYPE reputation_event_type AS ENUM (
  'post_published',
  'answer_accepted',
  'content_upvoted',
  'peer_endorsement_received',
  'audit_passed',
  'audit_failed',
  'mentorship_completed',
  'mentee_milestone_achieved',
  'credential_issued',
  'penalty_applied'
);

CREATE TABLE reputation_events (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type   reputation_event_type NOT NULL,
  points       INTEGER NOT NULL,               -- can be negative
  reference_id UUID,                           -- post_id, endorsement_id, etc.
  metadata     JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reputation_events_user ON reputation_events(user_id, created_at DESC);

-- ── Peer endorsements ─────────────────────────────────────────
CREATE TYPE endorsement_status AS ENUM ('pending', 'accepted', 'rejected', 'flagged');

CREATE TABLE peer_endorsements (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  endorser_id     UUID NOT NULL REFERENCES users(id),
  recipient_id    UUID NOT NULL REFERENCES users(id),
  topic_id        UUID NOT NULL REFERENCES expertise_topics(id),
  rationale       TEXT NOT NULL,               -- required written justification
  status          endorsement_status NOT NULL DEFAULT 'pending',
  weight          NUMERIC(4,2) NOT NULL DEFAULT 1.0,  -- >1.0 for cross-network
  is_same_trade   BOOLEAN NOT NULL DEFAULT false,
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (endorser_id <> recipient_id)
);

CREATE INDEX idx_endorsements_recipient ON peer_endorsements(recipient_id, status);

-- =============================================================
-- CONTENT — SME KNOWLEDGE COMMUNITY
-- =============================================================

CREATE TYPE content_type AS ENUM ('question', 'answer', 'post');
CREATE TYPE content_status AS ENUM (
  'draft',
  'pending_review',   -- awaiting AI screening
  'published',
  'flagged',
  'removed'
);

CREATE TABLE content (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id        UUID NOT NULL REFERENCES users(id),
  type             content_type NOT NULL,
  parent_id        UUID REFERENCES content(id) ON DELETE CASCADE,  -- for answers
  trade_id         UUID REFERENCES trades(id),
  topic_id         UUID REFERENCES expertise_topics(id),
  title            VARCHAR(300),               -- questions and posts only
  body             TEXT NOT NULL,
  status           content_status NOT NULL DEFAULT 'pending_review',
  upvote_count     INTEGER NOT NULL DEFAULT 0,
  view_count       INTEGER NOT NULL DEFAULT 0,
  is_accepted      BOOLEAN NOT NULL DEFAULT false,   -- accepted answer
  ai_quality_score NUMERIC(4,2),              -- 0.00–1.00 from Anthropic screening
  ai_domain_score  NUMERIC(4,2),              -- domain relevance score
  ai_screened_at   TIMESTAMPTZ,
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_content_author      ON content(author_id);
CREATE INDEX idx_content_trade_topic ON content(trade_id, topic_id, status);
CREATE INDEX idx_content_parent      ON content(parent_id);
-- Full text search index
CREATE INDEX idx_content_fts ON content
  USING gin(to_tsvector('english', coalesce(title,'') || ' ' || body));

-- ── Content votes ─────────────────────────────────────────────
CREATE TABLE content_votes (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  voter_id   UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(content_id, voter_id)
);

-- ── AI screening results (one row per screening run) ──────────
CREATE TABLE ai_screening_results (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id        UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  quality_score     NUMERIC(4,2) NOT NULL,
  domain_score      NUMERIC(4,2) NOT NULL,
  flags             TEXT[],                    -- e.g. ['off_topic', 'low_detail']
  model_used        VARCHAR(80) NOT NULL,
  prompt_version    VARCHAR(20) NOT NULL,
  raw_response      JSONB,
  screened_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Human audit log ───────────────────────────────────────────
CREATE TYPE audit_outcome AS ENUM ('passed', 'failed', 'escalated');
CREATE TYPE audit_trigger AS ENUM ('random', 'new_high_volume', 'domain_expansion', 'pattern_flag');

CREATE TABLE content_audits (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id    UUID NOT NULL REFERENCES content(id),
  auditor_id    UUID NOT NULL REFERENCES users(id),   -- platform_admin
  trigger_type  audit_trigger NOT NULL,
  outcome       audit_outcome NOT NULL,
  notes         TEXT,
  audited_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- CREDENTIALS — OPEN BADGES 3.0
-- =============================================================

CREATE TYPE credential_type AS ENUM (
  'contribution',       -- SME content milestones
  'peer_endorsed',      -- peer endorsement threshold reached
  'mentor_eligible',    -- earned mentor status
  'mentorship_given',   -- completed mentorship as mentor
  'mentorship_received',-- completed mentorship as mentee
  'self_reported',      -- imported ticket/certificate
  'audit_verified',     -- self-reported credential verified by audit
  'red_seal'            -- Red Seal completion
);

CREATE TABLE credentials (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  holder_id        UUID NOT NULL REFERENCES users(id),
  issued_by        UUID REFERENCES institutions(id),  -- NULL = platform-issued
  type             credential_type NOT NULL,
  name             VARCHAR(200) NOT NULL,
  description      TEXT,
  trade_id         UUID REFERENCES trades(id),
  topic_id         UUID REFERENCES expertise_topics(id),
  badge_url        TEXT,                       -- Open Badge JSON URL
  image_url        TEXT,
  criteria_url     TEXT,
  issued_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at       TIMESTAMPTZ,
  revoked_at       TIMESTAMPTZ,
  revocation_reason TEXT,
  ob3_assertion    JSONB,                      -- full Open Badges 3.0 assertion
  verification_hash VARCHAR(128),             -- cryptographic signature
  is_public        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_credentials_holder   ON credentials(holder_id, type);
CREATE INDEX idx_credentials_public   ON credentials(is_public, issued_at DESC);

-- =============================================================
-- MENTORSHIP
-- =============================================================

CREATE TYPE mentorship_status AS ENUM (
  'requested',
  'active',
  'completed',
  'declined',
  'abandoned'
);

CREATE TABLE mentorship_relationships (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id     UUID NOT NULL REFERENCES users(id),
  mentee_id     UUID NOT NULL REFERENCES users(id),
  trade_id      UUID REFERENCES trades(id),
  status        mentorship_status NOT NULL DEFAULT 'requested',
  goals         TEXT NOT NULL,                -- what the mentee wants to achieve
  request_note  TEXT,
  started_at    TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (mentor_id <> mentee_id)
);

CREATE TABLE mentorship_milestones (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  relationship_id  UUID NOT NULL REFERENCES mentorship_relationships(id) ON DELETE CASCADE,
  title            VARCHAR(200) NOT NULL,
  description      TEXT,
  achieved_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE mentorship_reviews (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  relationship_id  UUID NOT NULL REFERENCES mentorship_relationships(id),
  reviewer_id      UUID NOT NULL REFERENCES users(id),
  rating           SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text      TEXT,
  is_public        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(relationship_id, reviewer_id)
);

-- =============================================================
-- NOTIFICATIONS
-- =============================================================

CREATE TYPE notification_type AS ENUM (
  'endorsement_received',
  'mentorship_requested',
  'mentorship_accepted',
  'mentorship_milestone',
  'content_upvoted',
  'answer_accepted',
  'credential_issued',
  'mentor_eligible',
  'audit_result'
);

CREATE TABLE notifications (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type         notification_type NOT NULL,
  title        VARCHAR(200) NOT NULL,
  body         TEXT,
  reference_id UUID,
  is_read      BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

-- =============================================================
-- UPDATED_AT TRIGGERS
-- =============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_content_updated_at
  BEFORE UPDATE ON content FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_mentorship_updated_at
  BEFORE UPDATE ON mentorship_relationships FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================
-- SEED: REFERENCE DATA
-- =============================================================

INSERT INTO trades (code, name, is_red_seal) VALUES
  ('RED_309A', 'Electrician (Construction)', true),
  ('RED_306A', 'Plumber', true),
  ('RED_313A', 'Refrigeration & Air Conditioning Mechanic', true),
  ('RED_308A', 'Steamfitter/Pipefitter', true),
  ('RED_421A', 'Welder', true),
  ('RED_310A', 'Industrial Electrician', true),
  ('RED_433A', 'Ironworker (Generalist)', true),
  ('RED_301A', 'Carpenter', true);

INSERT INTO expertise_topics (trade_id, name, slug) 
SELECT 
  t.id,
  topic.name,
  topic.slug
FROM trades t
CROSS JOIN (VALUES
  ('Panel Installation & Wiring', 'panel-installation-wiring'),
  ('Conduit & Cable Management', 'conduit-cable-management'),
  ('Code Compliance & Inspections', 'code-compliance-inspections'),
  ('Troubleshooting & Diagnostics', 'troubleshooting-diagnostics'),
  ('Safety Protocols', 'safety-protocols'),
  ('Apprenticeship & Mentoring', 'apprenticeship-mentoring'),
  ('Tools & Equipment', 'tools-equipment')
) AS topic(name, slug)
WHERE t.code = 'RED_309A';

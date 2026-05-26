-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('apprentice', 'journeyperson', 'master', 'employer_admin', 'union_admin', 'platform_admin');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('onboarding', 'active', 'suspended', 'deactivated');

-- CreateEnum
CREATE TYPE "InstitutionType" AS ENUM ('union', 'employer', 'college', 'apprenticeship_board', 'online_provider');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('question', 'answer', 'post');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('draft', 'pending_review', 'published', 'flagged', 'removed');

-- CreateEnum
CREATE TYPE "CredentialType" AS ENUM ('contribution', 'peer_endorsed', 'mentor_eligible', 'mentorship_given', 'mentorship_received', 'self_reported', 'audit_verified', 'red_seal');

-- CreateEnum
CREATE TYPE "MentorshipStatus" AS ENUM ('requested', 'active', 'completed', 'declined', 'abandoned');

-- CreateEnum
CREATE TYPE "ReputationEventType" AS ENUM ('post_published', 'answer_accepted', 'content_upvoted', 'peer_endorsement_received', 'audit_passed', 'audit_failed', 'mentorship_completed', 'mentee_milestone_achieved', 'credential_issued', 'penalty_applied');

-- CreateEnum
CREATE TYPE "EndorsementStatus" AS ENUM ('pending', 'accepted', 'rejected', 'flagged');

-- CreateEnum
CREATE TYPE "AuditOutcome" AS ENUM ('passed', 'failed', 'escalated');

-- CreateEnum
CREATE TYPE "AuditTrigger" AS ENUM ('random', 'new_high_volume', 'domain_expansion', 'pattern_flag');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('endorsement_received', 'mentorship_requested', 'mentorship_accepted', 'mentorship_milestone', 'content_upvoted', 'answer_accepted', 'credential_issued', 'mentor_eligible', 'audit_result');

-- CreateTable
CREATE TABLE "trades" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_red_seal" BOOLEAN NOT NULL DEFAULT true,
    "province_code" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trade_specialisations" (
    "id" TEXT NOT NULL,
    "trade_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "trade_specialisations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expertise_topics" (
    "id" TEXT NOT NULL,
    "trade_id" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "expertise_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "auth0_id" TEXT,
    "email" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'apprentice',
    "status" "AccountStatus" NOT NULL DEFAULT 'onboarding',
    "province_code" TEXT,
    "years_experience" INTEGER,
    "employer_name" TEXT,
    "union_local_id" TEXT,
    "bio" TEXT,
    "onboarding_step" INTEGER NOT NULL DEFAULT 0,
    "onboarding_done" BOOLEAN NOT NULL DEFAULT false,
    "last_active_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_trades" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "trade_id" TEXT NOT NULL,
    "specialisation_id" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "verified_at" TIMESTAMP(3),
    "red_seal_number" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_trades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institutions" (
    "id" TEXT NOT NULL,
    "type" "InstitutionType" NOT NULL,
    "name" TEXT NOT NULL,
    "province_code" TEXT,
    "website_url" TEXT,
    "logo_url" TEXT,
    "is_partner" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "institutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institution_members" (
    "id" TEXT NOT NULL,
    "institution_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "member_number" TEXT,
    "role" TEXT,
    "joined_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "institution_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reputation_scores" (
    "user_id" TEXT NOT NULL,
    "total_score" INTEGER NOT NULL DEFAULT 0,
    "content_score" INTEGER NOT NULL DEFAULT 0,
    "peer_endorsement_score" INTEGER NOT NULL DEFAULT 0,
    "mentorship_score" INTEGER NOT NULL DEFAULT 0,
    "audit_score" INTEGER NOT NULL DEFAULT 0,
    "mentor_eligible" BOOLEAN NOT NULL DEFAULT false,
    "mentor_eligible_at" TIMESTAMP(3),
    "tier" TEXT NOT NULL DEFAULT 'apprentice',
    "calculated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reputation_scores_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "reputation_events" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "event_type" "ReputationEventType" NOT NULL,
    "points" INTEGER NOT NULL,
    "reference_id" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reputation_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "peer_endorsements" (
    "id" TEXT NOT NULL,
    "endorser_id" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "topic_id" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,
    "status" "EndorsementStatus" NOT NULL DEFAULT 'pending',
    "weight" DECIMAL(65,30) NOT NULL DEFAULT 1.0,
    "is_same_trade" BOOLEAN NOT NULL DEFAULT false,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "peer_endorsements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "type" "ContentType" NOT NULL,
    "parent_id" TEXT,
    "trade_id" TEXT,
    "topic_id" TEXT,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'pending_review',
    "upvote_count" INTEGER NOT NULL DEFAULT 0,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "is_accepted" BOOLEAN NOT NULL DEFAULT false,
    "ai_quality_score" DECIMAL(65,30),
    "ai_domain_score" DECIMAL(65,30),
    "ai_screened_at" TIMESTAMP(3),
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_votes" (
    "id" TEXT NOT NULL,
    "content_id" TEXT NOT NULL,
    "voter_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_screening_results" (
    "id" TEXT NOT NULL,
    "content_id" TEXT NOT NULL,
    "quality_score" DECIMAL(65,30) NOT NULL,
    "domain_score" DECIMAL(65,30) NOT NULL,
    "flags" TEXT[],
    "model_used" TEXT NOT NULL,
    "prompt_version" TEXT NOT NULL,
    "raw_response" JSONB,
    "screened_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_screening_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_audits" (
    "id" TEXT NOT NULL,
    "content_id" TEXT NOT NULL,
    "auditor_id" TEXT NOT NULL,
    "trigger_type" "AuditTrigger" NOT NULL,
    "outcome" "AuditOutcome" NOT NULL,
    "notes" TEXT,
    "audited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credentials" (
    "id" TEXT NOT NULL,
    "holder_id" TEXT NOT NULL,
    "issued_by" TEXT,
    "type" "CredentialType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "trade_id" TEXT,
    "topic_id" TEXT,
    "badge_url" TEXT,
    "image_url" TEXT,
    "criteria_url" TEXT,
    "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "revocation_reason" TEXT,
    "ob3_assertion" JSONB,
    "verification_hash" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentorship_relationships" (
    "id" TEXT NOT NULL,
    "mentor_id" TEXT NOT NULL,
    "mentee_id" TEXT NOT NULL,
    "trade_id" TEXT,
    "status" "MentorshipStatus" NOT NULL DEFAULT 'requested',
    "goals" TEXT NOT NULL,
    "request_note" TEXT,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mentorship_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentorship_milestones" (
    "id" TEXT NOT NULL,
    "relationship_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "achieved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "topicId" TEXT,

    CONSTRAINT "mentorship_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentorship_reviews" (
    "id" TEXT NOT NULL,
    "relationship_id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "review_text" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mentorship_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "reference_id" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trades_code_key" ON "trades"("code");

-- CreateIndex
CREATE UNIQUE INDEX "expertise_topics_slug_key" ON "expertise_topics"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_auth0_id_key" ON "users"("auth0_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_auth0_id_idx" ON "users"("auth0_id");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE UNIQUE INDEX "user_trades_user_id_trade_id_key" ON "user_trades"("user_id", "trade_id");

-- CreateIndex
CREATE UNIQUE INDEX "institution_members_institution_id_user_id_key" ON "institution_members"("institution_id", "user_id");

-- CreateIndex
CREATE INDEX "reputation_events_user_id_created_at_idx" ON "reputation_events"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "peer_endorsements_recipient_id_status_idx" ON "peer_endorsements"("recipient_id", "status");

-- CreateIndex
CREATE INDEX "content_author_id_idx" ON "content"("author_id");

-- CreateIndex
CREATE INDEX "content_trade_id_topic_id_status_idx" ON "content"("trade_id", "topic_id", "status");

-- CreateIndex
CREATE INDEX "content_parent_id_idx" ON "content"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_votes_content_id_voter_id_key" ON "content_votes"("content_id", "voter_id");

-- CreateIndex
CREATE INDEX "credentials_holder_id_type_idx" ON "credentials"("holder_id", "type");

-- CreateIndex
CREATE INDEX "credentials_is_public_issued_at_idx" ON "credentials"("is_public", "issued_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "mentorship_reviews_relationship_id_reviewer_id_key" ON "mentorship_reviews"("relationship_id", "reviewer_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_is_read_created_at_idx" ON "notifications"("user_id", "is_read", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "trade_specialisations" ADD CONSTRAINT "trade_specialisations_trade_id_fkey" FOREIGN KEY ("trade_id") REFERENCES "trades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expertise_topics" ADD CONSTRAINT "expertise_topics_trade_id_fkey" FOREIGN KEY ("trade_id") REFERENCES "trades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_union_local_id_fkey" FOREIGN KEY ("union_local_id") REFERENCES "institutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_trades" ADD CONSTRAINT "user_trades_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_trades" ADD CONSTRAINT "user_trades_trade_id_fkey" FOREIGN KEY ("trade_id") REFERENCES "trades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_trades" ADD CONSTRAINT "user_trades_specialisation_id_fkey" FOREIGN KEY ("specialisation_id") REFERENCES "trade_specialisations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_members" ADD CONSTRAINT "institution_members_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_members" ADD CONSTRAINT "institution_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reputation_scores" ADD CONSTRAINT "reputation_scores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reputation_events" ADD CONSTRAINT "reputation_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peer_endorsements" ADD CONSTRAINT "peer_endorsements_endorser_id_fkey" FOREIGN KEY ("endorser_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peer_endorsements" ADD CONSTRAINT "peer_endorsements_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peer_endorsements" ADD CONSTRAINT "peer_endorsements_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "expertise_topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_trade_id_fkey" FOREIGN KEY ("trade_id") REFERENCES "trades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "expertise_topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_votes" ADD CONSTRAINT "content_votes_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_votes" ADD CONSTRAINT "content_votes_voter_id_fkey" FOREIGN KEY ("voter_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_screening_results" ADD CONSTRAINT "ai_screening_results_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_audits" ADD CONSTRAINT "content_audits_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_audits" ADD CONSTRAINT "content_audits_auditor_id_fkey" FOREIGN KEY ("auditor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_holder_id_fkey" FOREIGN KEY ("holder_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_issued_by_fkey" FOREIGN KEY ("issued_by") REFERENCES "institutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_trade_id_fkey" FOREIGN KEY ("trade_id") REFERENCES "trades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "expertise_topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentorship_relationships" ADD CONSTRAINT "mentorship_relationships_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentorship_relationships" ADD CONSTRAINT "mentorship_relationships_mentee_id_fkey" FOREIGN KEY ("mentee_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentorship_relationships" ADD CONSTRAINT "mentorship_relationships_trade_id_fkey" FOREIGN KEY ("trade_id") REFERENCES "trades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentorship_milestones" ADD CONSTRAINT "mentorship_milestones_relationship_id_fkey" FOREIGN KEY ("relationship_id") REFERENCES "mentorship_relationships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentorship_milestones" ADD CONSTRAINT "mentorship_milestones_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "expertise_topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentorship_reviews" ADD CONSTRAINT "mentorship_reviews_relationship_id_fkey" FOREIGN KEY ("relationship_id") REFERENCES "mentorship_relationships"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentorship_reviews" ADD CONSTRAINT "mentorship_reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

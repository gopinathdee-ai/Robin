-- CreateTable
CREATE TABLE "platform_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "endorsement_min_contributions" INTEGER NOT NULL DEFAULT 20,
    "endorsement_min_reputation" INTEGER NOT NULL DEFAULT 50,
    "endorsement_min_account_age_days" INTEGER NOT NULL DEFAULT 60,
    "endorsement_cooldown_days" INTEGER NOT NULL DEFAULT 30,
    "mentor_tier_threshold" INTEGER NOT NULL DEFAULT 750,
    "content_review_sla_hours" INTEGER NOT NULL DEFAULT 24,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "platform_settings_pkey" PRIMARY KEY ("id")
);

/**
 * Reputation system configuration
 * Point values, tier thresholds, and polling intervals
 * All values configurable for future admin dashboard
 */

export const REPUTATION_CONFIG = {
  points: {
    POST_PUBLISHED: 10,
    ANSWER_ACCEPTED: 15,
    CONTENT_UPVOTED: 1,
    PEER_ENDORSEMENT_RECEIVED: 25,
    AUDIT_PASSED: 50,
    AUDIT_FAILED: -25,
    MENTORSHIP_COMPLETED: 100,
    MENTEE_MILESTONE_ACHIEVED: 20,
    CREDENTIAL_ISSUED: 30,
    PENALTY_APPLIED: -50,
  },

  tiers: [
    { name: 'Apprentice', minPoints: 0, maxPoints: 199 },
    { name: 'Journeyperson', minPoints: 200, maxPoints: 499 },
    { name: 'Expert', minPoints: 500, maxPoints: 749 },
    { name: 'Mentor Eligible', minPoints: 750, maxPoints: Infinity },
  ],

  polling: {
    intervalMs: 30000, // 30 seconds - configurable in admin later
  },
} as const

export type ReputationTier = (typeof REPUTATION_CONFIG.tiers)[number]['name']

import { REPUTATION_CONFIG, type ReputationTier } from './reputation-config'

export function getTier(totalPoints: number): ReputationTier {
  for (const tier of REPUTATION_CONFIG.tiers) {
    if (totalPoints >= tier.minPoints && totalPoints <= tier.maxPoints) {
      return tier.name
    }
  }
  return 'Apprentice'
}

export function getPointsToNextTier(totalPoints: number): number {
  const currentTierIndex = REPUTATION_CONFIG.tiers.findIndex(
    (tier) => totalPoints >= tier.minPoints && totalPoints <= tier.maxPoints
  )

  if (currentTierIndex === -1 || currentTierIndex >= REPUTATION_CONFIG.tiers.length - 1) {
    return 0 // Already at max tier
  }

  const nextTier = REPUTATION_CONFIG.tiers[currentTierIndex + 1]
  return Math.max(0, nextTier.minPoints - totalPoints)
}

export function getNextTierName(totalPoints: number): ReputationTier {
  const currentTierIndex = REPUTATION_CONFIG.tiers.findIndex(
    (tier) => totalPoints >= tier.minPoints && totalPoints <= tier.maxPoints
  )

  if (currentTierIndex === -1 || currentTierIndex >= REPUTATION_CONFIG.tiers.length - 1) {
    return 'Mentor Eligible' // Already at max
  }

  return REPUTATION_CONFIG.tiers[currentTierIndex + 1].name
}

export function isMentorEligible(totalPoints: number): boolean {
  return totalPoints >= 750
}

export type ScoreBreakdown = {
  total: number
  contributions: number // posts published
  answers: number // answer accepted points
  upvotes: number // content upvoted
  endorsements: number // peer endorsements received
  other: number // audit, mentorship, credentials, penalties
}

export function createScoreBreakdown(
  postScore: number,
  answerScore: number,
  upvoteScore: number,
  endorsementScore: number,
  otherScore: number = 0
): ScoreBreakdown {
  return {
    contributions: postScore,
    answers: answerScore,
    upvotes: upvoteScore,
    endorsements: endorsementScore,
    other: otherScore,
    total: postScore + answerScore + upvoteScore + endorsementScore + otherScore,
  }
}

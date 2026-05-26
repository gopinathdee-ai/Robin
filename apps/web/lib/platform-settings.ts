import { prisma } from '@trades/db'

export interface PlatformSettings {
  endorsementMinContributions: number
  endorsementMinReputation: number
  endorsementMinAccountAgeDays: number
  endorsementCooldownDays: number
  mentorTierThreshold: number
  contentReviewSLAHours: number
}

// Dev mode overrides for easier testing
const DEV_SETTINGS: PlatformSettings = {
  endorsementMinContributions: 2,
  endorsementMinReputation: 20,
  endorsementMinAccountAgeDays: 0,
  endorsementCooldownDays: 30,
  mentorTierThreshold: 750,
  contentReviewSLAHours: 24,
}

const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true'

export async function getPlatformSettings(): Promise<PlatformSettings> {
  if (isDevMode) {
    return DEV_SETTINGS
  }

  try {
    const settings = await prisma.platformSettings.findUnique({
      where: { id: 'singleton' },
    })

    if (!settings) {
      console.warn('Platform settings not found in database, using defaults')
      return {
        endorsementMinContributions: 20,
        endorsementMinReputation: 50,
        endorsementMinAccountAgeDays: 60,
        endorsementCooldownDays: 30,
        mentorTierThreshold: 750,
        contentReviewSLAHours: 24,
      }
    }

    return {
      endorsementMinContributions: settings.endorsementMinContributions,
      endorsementMinReputation: settings.endorsementMinReputation,
      endorsementMinAccountAgeDays: settings.endorsementMinAccountAgeDays,
      endorsementCooldownDays: settings.endorsementCooldownDays,
      mentorTierThreshold: settings.mentorTierThreshold,
      contentReviewSLAHours: settings.contentReviewSLAHours,
    }
  } catch (error) {
    console.error('Failed to fetch platform settings:', error)
    // Return production defaults on error
    return {
      endorsementMinContributions: 20,
      endorsementMinReputation: 50,
      endorsementMinAccountAgeDays: 60,
      endorsementCooldownDays: 30,
      mentorTierThreshold: 750,
      contentReviewSLAHours: 24,
    }
  }
}

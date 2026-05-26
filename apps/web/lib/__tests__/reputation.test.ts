import { describe, it, expect } from 'vitest'
import {
  getTier,
  getPointsToNextTier,
  getNextTierName,
  isMentorEligible,
  createScoreBreakdown,
} from '../reputation'

describe('reputation calculations', () => {
  describe('getTier', () => {
    it('returns Apprentice for 0-199 points', () => {
      expect(getTier(0)).toBe('Apprentice')
      expect(getTier(100)).toBe('Apprentice')
      expect(getTier(199)).toBe('Apprentice')
    })

    it('returns Journeyperson for 200-499 points', () => {
      expect(getTier(200)).toBe('Journeyperson')
      expect(getTier(350)).toBe('Journeyperson')
      expect(getTier(499)).toBe('Journeyperson')
    })

    it('returns Expert for 500-749 points', () => {
      expect(getTier(500)).toBe('Expert')
      expect(getTier(600)).toBe('Expert')
      expect(getTier(749)).toBe('Expert')
    })

    it('returns Mentor Eligible for 750+ points', () => {
      expect(getTier(750)).toBe('Mentor Eligible')
      expect(getTier(1000)).toBe('Mentor Eligible')
      expect(getTier(999999)).toBe('Mentor Eligible')
    })
  })

  describe('getPointsToNextTier', () => {
    it('calculates points to Journeyperson from Apprentice', () => {
      expect(getPointsToNextTier(0)).toBe(200)
      expect(getPointsToNextTier(100)).toBe(100)
      expect(getPointsToNextTier(199)).toBe(1)
    })

    it('calculates points to Expert from Journeyperson', () => {
      expect(getPointsToNextTier(200)).toBe(300)
      expect(getPointsToNextTier(400)).toBe(100)
      expect(getPointsToNextTier(499)).toBe(1)
    })

    it('calculates points to Mentor from Expert', () => {
      expect(getPointsToNextTier(500)).toBe(250)
      expect(getPointsToNextTier(600)).toBe(150)
      expect(getPointsToNextTier(749)).toBe(1)
    })

    it('returns 0 when already at Mentor Eligible', () => {
      expect(getPointsToNextTier(750)).toBe(0)
      expect(getPointsToNextTier(1000)).toBe(0)
    })
  })

  describe('getNextTierName', () => {
    it('returns Journeyperson when Apprentice', () => {
      expect(getNextTierName(100)).toBe('Journeyperson')
    })

    it('returns Expert when Journeyperson', () => {
      expect(getNextTierName(300)).toBe('Expert')
    })

    it('returns Mentor Eligible when Expert', () => {
      expect(getNextTierName(600)).toBe('Mentor Eligible')
    })

    it('returns Mentor Eligible when already Mentor Eligible', () => {
      expect(getNextTierName(750)).toBe('Mentor Eligible')
      expect(getNextTierName(1000)).toBe('Mentor Eligible')
    })
  })

  describe('isMentorEligible', () => {
    it('returns false below 750 points', () => {
      expect(isMentorEligible(0)).toBe(false)
      expect(isMentorEligible(500)).toBe(false)
      expect(isMentorEligible(749)).toBe(false)
    })

    it('returns true at or above 750 points', () => {
      expect(isMentorEligible(750)).toBe(true)
      expect(isMentorEligible(1000)).toBe(true)
    })
  })

  describe('createScoreBreakdown', () => {
    it('creates correct breakdown with all categories', () => {
      const breakdown = createScoreBreakdown(100, 50, 25, 40, 10)
      expect(breakdown).toEqual({
        contributions: 100,
        answers: 50,
        upvotes: 25,
        endorsements: 40,
        other: 10,
        total: 225,
      })
    })

    it('creates correct breakdown with zero other', () => {
      const breakdown = createScoreBreakdown(100, 50, 25, 40)
      expect(breakdown).toEqual({
        contributions: 100,
        answers: 50,
        upvotes: 25,
        endorsements: 40,
        other: 0,
        total: 215,
      })
    })

    it('handles negative points', () => {
      const breakdown = createScoreBreakdown(100, 50, 0, 0, -25)
      expect(breakdown).toEqual({
        contributions: 100,
        answers: 50,
        upvotes: 0,
        endorsements: 0,
        other: -25,
        total: 125,
      })
    })
  })
})

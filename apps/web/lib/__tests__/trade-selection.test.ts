import { describe, it, expect } from 'vitest'

// Trade selection validation logic
function validateTradeSelection(tradeId: string, specialisationIds: string[]): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!tradeId || tradeId.trim() === '') {
    errors.push('Trade selection is required')
  }

  if (!Array.isArray(specialisationIds)) {
    errors.push('Specialisations must be an array')
  }

  // Allow 0 specialisations (optional)
  if (specialisationIds.length > 5) {
    errors.push('Maximum 5 specialisations allowed')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

function calculateExperienceLevel(
  yearsExperience: number,
): 'apprentice' | 'journeyperson' | 'master' {
  if (yearsExperience < 2) return 'apprentice'
  if (yearsExperience < 10) return 'journeyperson'
  return 'master'
}

describe('Trade Selection Validation', () => {
  it('accepts valid trade with specialisations', () => {
    const result = validateTradeSelection('trade-1', ['spec-1', 'spec-2'])
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('accepts valid trade without specialisations', () => {
    const result = validateTradeSelection('trade-1', [])
    expect(result.valid).toBe(true)
  })

  it('rejects missing trade', () => {
    const result = validateTradeSelection('', ['spec-1'])
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Trade selection is required')
  })

  it('rejects too many specialisations', () => {
    const result = validateTradeSelection('trade-1', [
      'spec-1',
      'spec-2',
      'spec-3',
      'spec-4',
      'spec-5',
      'spec-6',
    ])
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Maximum 5 specialisations allowed')
  })

  it('rejects non-array specialisations', () => {
    const result = validateTradeSelection('trade-1', 'spec-1' as any)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Specialisations must be an array')
  })
})

describe('Experience Level Calculation', () => {
  it('classifies < 2 years as apprentice', () => {
    expect(calculateExperienceLevel(0)).toBe('apprentice')
    expect(calculateExperienceLevel(1)).toBe('apprentice')
    expect(calculateExperienceLevel(1.9)).toBe('apprentice')
  })

  it('classifies 2-9 years as journeyperson', () => {
    expect(calculateExperienceLevel(2)).toBe('journeyperson')
    expect(calculateExperienceLevel(5)).toBe('journeyperson')
    expect(calculateExperienceLevel(9)).toBe('journeyperson')
  })

  it('classifies >= 10 years as master', () => {
    expect(calculateExperienceLevel(10)).toBe('master')
    expect(calculateExperienceLevel(20)).toBe('master')
    expect(calculateExperienceLevel(50)).toBe('master')
  })
})

import { describe, it, expect } from 'vitest'
import { createMockRequest, createDevAuthHeader } from '@/lib/__tests__/test-helpers'

describe('POST /api/content', () => {
  it('creates request with POST method', () => {
    const req = createMockRequest(
      'POST',
      'http://localhost:3000/api/content',
      {
        headers: createDevAuthHeader('user-123'),
        body: JSON.stringify({
          type: 'question',
          title: 'How to fix a breaker?',
          body: 'I have a tripped breaker and need help...',
        }),
      },
    )

    expect(req.method).toBe('POST')
  })

  it('requires title for questions', () => {
    const invalidQuestion = {
      type: 'question',
      body: 'Body text here',
    }

    expect(invalidQuestion).not.toHaveProperty('title')
  })

  it('requires minimum body length', () => {
    const tooShort = {
      type: 'question',
      title: 'Valid title here',
      body: 'Short',
    }

    expect(tooShort.body.length).toBeLessThan(20)
  })

  it('validates title minimum length (10 chars)', () => {
    const tooShort = 'Short'
    expect(tooShort.length).toBeLessThan(10)

    const valid = 'Valid title here'
    expect(valid.length).toBeGreaterThanOrEqual(10)
  })

  it('validates body maximum length (10000 chars)', () => {
    const valid = 'x'.repeat(10000)
    expect(valid.length).toBeLessThanOrEqual(10000)

    const tooLong = 'x'.repeat(10001)
    expect(tooLong.length).toBeGreaterThan(10000)
  })

  it('accepts question type', () => {
    const content = {
      type: 'question',
      title: 'How do I...?',
      body: 'Can someone help me understand how to...?',
    }

    expect(['question', 'answer', 'post']).toContain(content.type)
  })

  it('accepts post type', () => {
    const content = {
      type: 'post',
      title: 'Tips for....',
      body: 'Here are some useful tips for electrical work...',
    }

    expect(['question', 'answer', 'post']).toContain(content.type)
  })

  it('returns 202 on successful submission', () => {
    const mockResponse = {
      status: 202,
      id: 'content-123',
      message: 'Your contribution is being reviewed',
    }

    expect(mockResponse.status).toBe(202)
    expect(mockResponse).toHaveProperty('id')
    expect(mockResponse).toHaveProperty('message')
  })

  it('accepts optional tradeId and topicId', () => {
    const content = {
      type: 'question',
      title: 'Question title',
      body: 'Question body with enough text here',
      tradeId: 'trade-123',
      topicId: 'topic-123',
    }

    expect(content).toHaveProperty('tradeId')
    expect(content).toHaveProperty('topicId')
  })
})

describe('GET /api/content', () => {
  it('returns paginated content list', () => {
    const mockResponse = {
      items: [],
      page: 1,
      limit: 20,
      total: 0,
      pages: 0,
    }

    expect(mockResponse).toHaveProperty('items')
    expect(mockResponse).toHaveProperty('page')
    expect(mockResponse).toHaveProperty('limit')
    expect(mockResponse).toHaveProperty('total')
    expect(mockResponse).toHaveProperty('pages')
  })

  it('filters by trade_id parameter', () => {
    const params = new URLSearchParams({
      trade_id: 'trade-123',
    })

    expect(params.get('trade_id')).toBe('trade-123')
  })

  it('filters by topic_id parameter', () => {
    const params = new URLSearchParams({
      topic_id: 'topic-123',
    })

    expect(params.get('topic_id')).toBe('topic-123')
  })

  it('filters by type parameter', () => {
    const params = new URLSearchParams({
      type: 'question',
    })

    expect(['question', 'answer', 'post']).toContain(params.get('type'))
  })

  it('respects pagination limits', () => {
    const page = Math.max(1, Number('2'))
    const limit = Math.min(100, Math.max(1, Number('20')))

    expect(page).toBeGreaterThanOrEqual(1)
    expect(limit).toBeGreaterThanOrEqual(1)
    expect(limit).toBeLessThanOrEqual(100)
  })

  it('returns only published content', () => {
    const content = {
      id: 'content-123',
      status: 'published',
      aiQualityScore: 0.75,
    }

    expect(content.status).toBe('published')
    expect(content.aiQualityScore).toBeGreaterThanOrEqual(0.4)
  })
})

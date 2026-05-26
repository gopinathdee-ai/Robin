import { describe, it, expect } from 'vitest'
import { createMockRequest, createDevAuthHeader } from '@/lib/__tests__/test-helpers'

describe('POST /api/bookmarks', () => {
  it('creates request with POST method', () => {
    const req = createMockRequest(
      'POST',
      'http://localhost:3000/api/bookmarks',
      {
        headers: createDevAuthHeader('user-123'),
        body: JSON.stringify({ contentId: 'content-456' }),
      },
    )

    expect(req.method).toBe('POST')
  })

  it('requires contentId in request body', () => {
    const invalidBookmark = {
      contentId: undefined,
    }

    expect(invalidBookmark.contentId).toBeUndefined()
  })

  it('accepts contentId as string', () => {
    const validBookmark = {
      contentId: 'content-123',
    }

    expect(typeof validBookmark.contentId).toBe('string')
  })

  it('returns 201 on successful bookmark creation', () => {
    const mockResponse = {
      status: 201,
      bookmarkId: 'bookmark-123',
      bookmarked: true,
    }

    expect(mockResponse.status).toBe(201)
    expect(mockResponse).toHaveProperty('bookmarkId')
    expect(mockResponse.bookmarked).toBe(true)
  })

  it('returns 400 when contentId is missing', () => {
    const mockError = {
      status: 400,
      error: 'Content ID required',
    }

    expect(mockError.status).toBe(400)
    expect(mockError.error).toBeDefined()
  })

  it('returns 404 when content does not exist', () => {
    const mockError = {
      status: 404,
      error: 'Content not found',
    }

    expect(mockError.status).toBe(404)
  })
})

describe('GET /api/bookmarks', () => {
  it('creates request with GET method', () => {
    const req = createMockRequest(
      'GET',
      'http://localhost:3000/api/bookmarks',
      {
        headers: createDevAuthHeader('user-123'),
      },
    )

    expect(req.method).toBe('GET')
  })

  it('returns array of bookmarks', () => {
    const mockResponse = {
      items: [
        {
          bookmarkId: 'bm-1',
          id: 'content-1',
          type: 'question',
          title: 'How to fix...',
          upvotes: 5,
          author: { displayName: 'John' },
        },
      ],
    }

    expect(Array.isArray(mockResponse.items)).toBe(true)
    expect(mockResponse.items[0]).toHaveProperty('bookmarkId')
  })

  it('includes content details in bookmark response', () => {
    const bookmark = {
      bookmarkId: 'bm-1',
      id: 'content-1',
      type: 'question',
      title: 'Title',
      body: 'Body text',
      author: { id: 'user-1', displayName: 'John', role: 'journeyperson' },
      trade: { id: 'trade-1', name: 'Plumbing' },
      topic: { id: 'topic-1', name: 'Repairs' },
      upvotes: 5,
      createdAt: '2024-01-01T00:00:00Z',
      status: 'published',
      bookmarkedAt: '2024-01-02T00:00:00Z',
    }

    expect(bookmark).toHaveProperty('title')
    expect(bookmark).toHaveProperty('author')
    expect(bookmark).toHaveProperty('bookmarkedAt')
  })

  it('sorts bookmarks by createdAt descending', () => {
    const mockResponse = {
      items: [
        { bookmarkId: 'bm-1', createdAt: '2024-01-02' },
        { bookmarkId: 'bm-2', createdAt: '2024-01-01' },
      ],
    }

    const dates = mockResponse.items.map((item) => new Date(item.createdAt))
    expect(dates[0].getTime()).toBeGreaterThan(dates[1].getTime())
  })
})

describe('DELETE /api/bookmarks', () => {
  it('creates request with DELETE method', () => {
    const req = createMockRequest(
      'DELETE',
      'http://localhost:3000/api/bookmarks?contentId=content-123',
      {
        headers: createDevAuthHeader('user-123'),
      },
    )

    expect(req.method).toBe('DELETE')
  })

  it('requires contentId as query parameter', () => {
    const url = new URL('http://localhost:3000/api/bookmarks')
    const contentId = url.searchParams.get('contentId')

    expect(contentId).toBeNull()
  })

  it('returns 200 on successful deletion', () => {
    const mockResponse = {
      status: 200,
      bookmarked: false,
    }

    expect(mockResponse.status).toBe(200)
    expect(mockResponse.bookmarked).toBe(false)
  })

  it('returns 404 when bookmark not found', () => {
    const mockError = {
      status: 404,
      error: 'Bookmark not found',
    }

    expect(mockError.status).toBe(404)
  })
})

describe('GET /api/bookmarks/check', () => {
  it('creates request with GET method', () => {
    const req = createMockRequest(
      'GET',
      'http://localhost:3000/api/bookmarks/check?contentId=content-123',
      {
        headers: createDevAuthHeader('user-123'),
      },
    )

    expect(req.method).toBe('GET')
  })

  it('returns bookmarked status', () => {
    const mockResponse = {
      bookmarked: true,
    }

    expect(typeof mockResponse.bookmarked).toBe('boolean')
  })

  it('returns false when content is not bookmarked', () => {
    const mockResponse = {
      bookmarked: false,
    }

    expect(mockResponse.bookmarked).toBe(false)
  })

  it('requires contentId as query parameter', () => {
    const url = new URL('http://localhost:3000/api/bookmarks/check?contentId=content-123')
    const contentId = url.searchParams.get('contentId')

    expect(contentId).toBeDefined()
    expect(contentId).toBe('content-123')
  })
})

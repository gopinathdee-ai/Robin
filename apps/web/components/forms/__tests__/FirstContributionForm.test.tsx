import { render, screen } from '@testing-library/react'
import { FirstContributionForm } from '../FirstContributionForm'
import { describe, it, expect, vi } from 'vitest'

const mockTopics = [
  { value: 'topic-1', label: 'Panel Installation' },
  { value: 'topic-2', label: 'Wiring' },
]

describe('FirstContributionForm', () => {
  const defaultProps = {
    contentType: 'question' as const,
    onContentTypeChange: vi.fn(),
    topicOptions: mockTopics,
    formData: { title: '', body: '', topicId: '' },
    onFormChange: vi.fn(),
    onSubmit: vi.fn(),
  }

  it('renders form with inputs', () => {
    const { container } = render(<FirstContributionForm {...defaultProps} />)
    const inputs = container.querySelectorAll('input, textarea')
    expect(inputs.length).toBeGreaterThan(0)
  })

  it('renders content type radio buttons', () => {
    const { container } = render(<FirstContributionForm {...defaultProps} />)

    const radios = container.querySelectorAll('input[type="radio"]')
    expect(radios.length).toBeGreaterThanOrEqual(2)
  })

  it('renders title input field', () => {
    const { container } = render(<FirstContributionForm {...defaultProps} />)

    const inputs = container.querySelectorAll('input[type="text"]')
    expect(inputs.length).toBeGreaterThan(0)
  })

  it('renders body textarea', () => {
    const { container } = render(<FirstContributionForm {...defaultProps} />)

    const textareas = container.querySelectorAll('textarea')
    expect(textareas.length).toBeGreaterThan(0)
  })

  it('shows publish button', () => {
    const { container } = render(<FirstContributionForm {...defaultProps} />)

    expect(container.textContent).toContain('Publish')
  })

  it('disables submit when title empty', () => {
    const { container } = render(
      <FirstContributionForm
        {...defaultProps}
        formData={{ title: '', body: 'Some body text here', topicId: 'topic-1' }}
      />,
    )

    const button = container.querySelector('button[type="submit"]') as HTMLButtonElement
    expect(button.disabled).toBe(true)
  })

  it('disables submit when body empty', () => {
    const { container } = render(
      <FirstContributionForm
        {...defaultProps}
        formData={{ title: 'Valid Title', body: '', topicId: 'topic-1' }}
      />,
    )

    const button = container.querySelector('button[type="submit"]') as HTMLButtonElement
    expect(button.disabled).toBe(true)
  })

  it('enables submit when all required fields populated', () => {
    const { container } = render(
      <FirstContributionForm
        {...defaultProps}
        formData={{
          title: 'How to fix breakers',
          body: 'This is a helpful guide about electrical breakers.',
          topicId: 'topic-1',
        }}
      />,
    )

    const button = container.querySelector('button[type="submit"]') as HTMLButtonElement
    expect(button.disabled).toBe(false)
  })

  it('shows loading state', () => {
    const { container } = render(
      <FirstContributionForm
        {...defaultProps}
        loading
        formData={{
          title: 'Title',
          body: 'Body content that is long enough',
          topicId: 'topic-1',
        }}
      />,
    )

    expect(container.textContent).toContain('Publishing')
  })

  it('displays error message', () => {
    const { container } = render(
      <FirstContributionForm
        {...defaultProps}
        error="Failed to submit content"
      />,
    )

    expect(container.textContent).toContain('Failed to submit content')
  })

  it('displays character counter', () => {
    const { container } = render(
      <FirstContributionForm
        {...defaultProps}
        formData={{
          title: 'Title',
          body: 'This is some text',
          topicId: 'topic-1',
        }}
      />,
    )

    expect(container.textContent).toMatch(/\d+\s*\/\s*5000/)
  })
})

import { render, screen } from '@testing-library/react'
import { ExpertiseTopics } from '../ExpertiseTopics'
import { describe, it, expect } from 'vitest'

describe('ExpertiseTopics', () => {
  const mockTopics = [
    { topicId: '1', topicName: 'Panel Installation', points: 250 },
    { topicId: '2', topicName: 'Troubleshooting Circuits', points: 120 },
    { topicId: '3', topicName: 'Safety Compliance', points: 80 },
  ]

  it('displays heading', () => {
    render(<ExpertiseTopics topics={mockTopics} />)
    expect(screen.getByText(/Expertise Topics/i)).toBeInTheDocument()
  })

  it('displays all topics', () => {
    render(<ExpertiseTopics topics={mockTopics} />)
    expect(screen.getByText('Panel Installation')).toBeInTheDocument()
    expect(screen.getByText('Troubleshooting Circuits')).toBeInTheDocument()
    expect(screen.getByText('Safety Compliance')).toBeInTheDocument()
  })

  it('displays topic points and percentage', () => {
    render(<ExpertiseTopics topics={mockTopics} />)
    expect(screen.getByText('250 pts (33%)')).toBeInTheDocument()
    expect(screen.getByText('120 pts (16%)')).toBeInTheDocument()
    expect(screen.getByText('80 pts (11%)')).toBeInTheDocument()
  })

  it('shows empty state when no topics', () => {
    render(<ExpertiseTopics topics={[]} />)
    expect(
      screen.getByText(/Your expertise topics will appear as you contribute/i)
    ).toBeInTheDocument()
  })

  it('shows empty state when topics is null', () => {
    render(<ExpertiseTopics topics={null as any} />)
    expect(
      screen.getByText(/Your expertise topics will appear as you contribute/i)
    ).toBeInTheDocument()
  })

  it('uses custom maxPoints for percentage calculation', () => {
    render(<ExpertiseTopics topics={mockTopics} maxPoints={1000} />)
    expect(screen.getByText('250 pts (25%)')).toBeInTheDocument()
    expect(screen.getByText('120 pts (12%)')).toBeInTheDocument()
  })

  it('caps percentage at 100', () => {
    const highPointsTopic = [{ topicId: '1', topicName: 'Expert Topic', points: 1000 }]
    render(<ExpertiseTopics topics={highPointsTopic} maxPoints={500} />)
    expect(screen.getByText('1000 pts (100%)')).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBox } from '../SearchBox'
import { describe, it, expect, vi } from 'vitest'

describe('SearchBox', () => {
  it('renders search input with placeholder', () => {
    const onSearch = vi.fn()
    render(<SearchBox onSearch={onSearch} />)
    const input = screen.getByPlaceholderText('What do you want to know?')
    expect(input).toBeInTheDocument()
  })

  it('calls onSearch when user types', async () => {
    const onSearch = vi.fn()
    const user = userEvent.setup()
    render(<SearchBox onSearch={onSearch} />)

    const input = screen.getByPlaceholderText('What do you want to know?') as HTMLInputElement
    await user.type(input, 'circuit')

    // Called for each character
    expect(onSearch).toHaveBeenCalledWith('c')
    expect(onSearch).toHaveBeenCalledWith('circuit')
  })

  it('accepts custom placeholder text', () => {
    const onSearch = vi.fn()
    render(<SearchBox onSearch={onSearch} placeholder="Search questions..." />)
    expect(screen.getByPlaceholderText('Search questions...')).toBeInTheDocument()
  })

  it('updates input value as user types', async () => {
    const onSearch = vi.fn()
    const user = userEvent.setup()
    render(<SearchBox onSearch={onSearch} />)

    const input = screen.getByPlaceholderText('What do you want to know?') as HTMLInputElement
    await user.type(input, 'test')

    expect(input.value).toBe('test')
  })

  it('includes search icon', () => {
    const onSearch = vi.fn()
    render(<SearchBox onSearch={onSearch} />)
    expect(screen.getByText('🔍')).toBeInTheDocument()
  })

  it('clears input when user deletes text', async () => {
    const onSearch = vi.fn()
    const user = userEvent.setup()
    render(<SearchBox onSearch={onSearch} />)

    const input = screen.getByPlaceholderText('What do you want to know?') as HTMLInputElement
    await user.type(input, 'test')
    await user.clear(input)

    expect(input.value).toBe('')
    expect(onSearch).toHaveBeenCalledWith('')
  })
})

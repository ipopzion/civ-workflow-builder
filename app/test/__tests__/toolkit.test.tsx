import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ToolkitPanel from '~/components/builder/ToolkitPanel'

describe('Toolkit panel', () => {
  it('renders all task type buttons', () => {
    render(<ToolkitPanel />)
    expect(screen.getByText('Log Message')).toBeInTheDocument()
    expect(screen.getByText('Calculate')).toBeInTheDocument()
    expect(screen.getByText('Send Email')).toBeInTheDocument()
  })

  it('renders a hint button for each task type', () => {
    render(<ToolkitPanel />)
    const hints = screen.getAllByText('?')
    expect(hints).toHaveLength(3)
  })
})
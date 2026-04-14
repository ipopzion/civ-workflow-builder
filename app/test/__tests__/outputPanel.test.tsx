import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useExecutionStore } from '~/store/executionStore'
import { OutputPanel } from '~/components/builder/OutputPanel'

beforeEach(() => {
  useExecutionStore.setState({ executionLog: [] })
})

describe('Output panel', () => {
  it('shows empty state when no logs', () => {
    render(<OutputPanel />)
    expect(screen.getByText('Run a workflow to see output here.')).toBeInTheDocument()
  })

  it('renders log entries', () => {
    useExecutionStore.setState({
      executionLog: [{
        timestamp: '12:00:00',
        level: 'LOG',
        stage: 'Log Message',
        status: 'success',
        output: { message: 'hello world' },
      }],
    })
    render(<OutputPanel />)
    expect(screen.getByText('Log Message::')).toBeInTheDocument()
    expect(screen.getByText('LOG')).toBeInTheDocument()
  })

  it('clears the log when clicking clear', () => {
    useExecutionStore.setState({
      executionLog: [{
        timestamp: '12:00:00',
        level: 'LOG',
        stage: 'Log Message',
        status: 'success',
        output: { message: 'hello' },
      }],
    })
    render(<OutputPanel />)
    fireEvent.click(screen.getByText('Clear'))
    expect(useExecutionStore.getState().executionLog).toHaveLength(0)
  })
})
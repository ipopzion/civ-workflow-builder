import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useWorkflowStepsStore } from '~/store/workflowStepsStore'
import { useExecutionStore } from '~/store/executionStore'
import BuilderPage from '~/routes/builder'

function renderBuilder() {
  return render(<BuilderPage />)
}

beforeEach(() => {
  useWorkflowStepsStore.setState({ tasks: [] })
  useExecutionStore.setState({ executionLog: [] })
})

describe('Builder page', () => {
  it('renders the toolkit panel', () => {
    renderBuilder()
    expect(screen.getByText('Tasks')).toBeInTheDocument()
  })

  it('renders the execution panel', () => {
    renderBuilder()
    expect(screen.getByText('Execution')).toBeInTheDocument()
  })

  it('renders the output panel', () => {
    renderBuilder()
    expect(screen.getByText('Output')).toBeInTheDocument()
  })

  it('run button is disabled when no tasks are queued', () => {
    renderBuilder()
    expect(screen.getByTitle('Run all tasks')).toBeDisabled()
  })

  it('adds a task when clicking Log Message in the toolkit', () => {
    renderBuilder()
    fireEvent.click(screen.getByTestId('task-creation-button-log'))
    expect(useWorkflowStepsStore.getState().tasks).toHaveLength(1)
  })

  it('run button becomes enabled after adding a task', () => {
    renderBuilder()
    fireEvent.click(screen.getByTestId('task-creation-button-log'))
    expect(screen.getByTitle('Run all tasks')).not.toBeDisabled()
  })

  it('task count updates in execution panel after adding tasks', () => {
    renderBuilder()
    fireEvent.click(screen.getByTestId('task-creation-button-log'))
    fireEvent.click(screen.getByTestId('task-creation-button-log'))
    expect(screen.getByText('Pending: 2')).toBeInTheDocument()
  })

  it('removes a task when clicking the remove button', () => {
    renderBuilder()
    fireEvent.click(screen.getByTestId('task-creation-button-log'))
    const removeButton = screen.getByTitle('Remove task')
    fireEvent.click(removeButton)
    expect(useWorkflowStepsStore.getState().tasks).toHaveLength(0)
  })
})
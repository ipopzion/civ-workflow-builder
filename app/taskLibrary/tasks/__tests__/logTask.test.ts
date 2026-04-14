import { describe, it, expect } from 'vitest'
import { logTask } from '../logTask'
import type { WorkflowTask } from '~/types/workflow'

const baseTask: WorkflowTask = {
  id: '1',
  type: 'log',
  status: 'idle',
  inputs: {},
  outputs: {},
}

describe('logTask', () => {
  it('returns success when message is provided', async () => {
    const task = { ...baseTask, inputs: { message: 'hello world' } }
    const result = await logTask.execute(task)
    expect(result.status).toBe('success')
    expect(result.output.message).toBe('hello world')
  })

  it('returns warning when message is empty', async () => {
    const task = { ...baseTask, inputs: { message: '' } }
    const result = await logTask.execute(task)
    expect(result.status).toBe('warning')
  })

  it('returns warning when message is missing', async () => {
    const task = { ...baseTask, inputs: {} }
    const result = await logTask.execute(task)
    expect(result.status).toBe('warning')
  })
})
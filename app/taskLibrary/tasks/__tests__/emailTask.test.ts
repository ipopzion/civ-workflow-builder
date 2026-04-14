import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { WorkflowTask } from '~/types/workflow'

const baseTask: WorkflowTask = {
  id: '3',
  type: 'email',
  status: 'idle',
  inputs: {},
  outputs: {},
}

// mock emailjs before importing emailTask
vi.mock('@emailjs/browser', () => ({
  default: { send: vi.fn() },
}))

describe('emailTask', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns warning when fields are missing', async () => {
    const { emailTask } = await import('../emailTask')
    const task = { ...baseTask, inputs: {} }
    const result = await emailTask.execute(task)
    expect(result.status).toBe('warning')
  })

  it('returns warning when recipient is missing', async () => {
    const { emailTask } = await import('../emailTask')
    const task = { ...baseTask, inputs: { subject: 'Hi', body: 'Hello' } }
    const result = await emailTask.execute(task)
    expect(result.status).toBe('warning')
  })

  it('returns success when emailjs resolves', async () => {
    const emailjs = await import('@emailjs/browser')
    vi.mocked(emailjs.default.send).mockResolvedValueOnce({ status: 200, text: 'OK' })

    const { emailTask } = await import('../emailTask')
    const task = { ...baseTask, inputs: { recipient: 'a@b.com', subject: 'Hi', body: 'Hello' } }
    const result = await emailTask.execute(task)
    expect(result.status).toBe('success')
    expect(result.output.status).toContain('a@b.com')
  })

  it('returns error when emailjs rejects', async () => {
    const emailjs = await import('@emailjs/browser')
    vi.mocked(emailjs.default.send).mockRejectedValueOnce(new Error('Network error'))

    const { emailTask } = await import('../emailTask')
    const task = { ...baseTask, inputs: { recipient: 'a@b.com', subject: 'Hi', body: 'Hello' } }
    const result = await emailTask.execute(task)
    expect(result.status).toBe('error')
  })
})
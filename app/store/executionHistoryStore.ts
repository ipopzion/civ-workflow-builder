import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ExecutionEntry } from '../types/workflow'

export interface WorkflowRun {
  id: string
  workflowName: string
  actor: string
  timestamp: string // ISO string for sorting
  displayTime: string // Formatted for display
  totalSteps: number
  successfulSteps: number
  failedSteps: number
  status: 'success' | 'failed' | 'partial'
  duration: number // in milliseconds
  entries: ExecutionEntry[]
}

interface ExecutionHistoryStore {
  runs: WorkflowRun[]
  addRun: (run: WorkflowRun) => void
  clearHistory: () => void
  getRun: (id: string) => WorkflowRun | undefined
}

export const useExecutionHistoryStore = create<ExecutionHistoryStore>()(
  persist(
    (set, get) => ({
      runs: [],

      addRun: (run) => {
        set((state) => ({
          runs: [run, ...state.runs] // Newest first
        }))
      },

      clearHistory: () => {
        set({ runs: [] })
      },

      getRun: (id) => {
        return get().runs.find(run => run.id === id)
      }
    }),
    {
      name: 'workflow-execution-history',
    }
  )
)
import { create } from 'zustand'

export interface Connection {
  id: string
  sourceTaskId: string
  sourceOutputKey: string
  targetTaskId: string
  targetInputKey: string
}

interface ConnectionStore {
  connections: Connection[]
  addConnection: (connection: Omit<Connection, 'id'>) => void
  removeConnection: (id: string) => void
  removeConnectionsForTask: (taskId: string) => void
  getConnectionsForTask: (taskId: string) => {
    incoming: Connection[]
    outgoing: Connection[]
  }
}

export const useConnectionStore = create<ConnectionStore>((set, get) => ({
  connections: [],

  addConnection: (connection) => {
    const id = crypto.randomUUID()
    set((state) => ({
      connections: [...state.connections, { ...connection, id }]
    }))
  },

  removeConnection: (id) =>
    set((state) => ({
      connections: state.connections.filter((c) => c.id !== id)
    })),

  removeConnectionsForTask: (taskId) =>
    set((state) => ({
      connections: state.connections.filter(
        (c) => c.sourceTaskId !== taskId && c.targetTaskId !== taskId
      )
    })),

  getConnectionsForTask: (taskId) => {
    const connections = get().connections
    return {
      incoming: connections.filter((c) => c.targetTaskId === taskId),
      outgoing: connections.filter((c) => c.sourceTaskId === taskId)
    }
  }
}))
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
  selectedConnectionId: string | null
  addConnection: (connection: Omit<Connection, 'id'>) => void
  removeConnection: (id: string) => void
  removeConnectionsForTask: (taskId: string) => void
  getConnectionsForTask: (taskId: string) => {
    incoming: Connection[]
    outgoing: Connection[]
  }
  wouldCreateCycle: (sourceTaskId: string, targetTaskId: string) => boolean
  getDependencies: (taskId: string) => string[]
  selectConnection: (id: string | null) => void
  deleteSelectedConnection: () => void
}

export const useConnectionStore = create<ConnectionStore>((set, get) => ({
  connections: [],
  selectedConnectionId: null,

  addConnection: (connection) => {
    const id = crypto.randomUUID()
    set((state) => ({
      connections: [...state.connections, { ...connection, id }]
    }))
  },

  removeConnection: (id) =>
    set((state) => ({
      connections: state.connections.filter((c) => c.id !== id),
      selectedConnectionId: state.selectedConnectionId === id ? null : state.selectedConnectionId
    })),

  removeConnectionsForTask: (taskId) =>
    set((state) => ({
      connections: state.connections.filter(
        (c) => c.sourceTaskId !== taskId && c.targetTaskId !== taskId
      ),
      selectedConnectionId: null // Clear selection when removing connections for a task
    })),

  getConnectionsForTask: (taskId) => {
    const connections = get().connections
    return {
      incoming: connections.filter((c) => c.targetTaskId === taskId),
      outgoing: connections.filter((c) => c.sourceTaskId === taskId)
    }
  },

  wouldCreateCycle: (sourceTaskId: string, targetTaskId: string): boolean => {
    const { connections } = get()

    // Build adjacency list
    const graph = new Map<string, Set<string>>()

    connections.forEach(conn => {
      if (!graph.has(conn.sourceTaskId)) {
        graph.set(conn.sourceTaskId, new Set())
      }
      graph.get(conn.sourceTaskId)!.add(conn.targetTaskId)
    })

    // Add the proposed connection
    if (!graph.has(sourceTaskId)) {
      graph.set(sourceTaskId, new Set())
    }
    graph.get(sourceTaskId)!.add(targetTaskId)

    // DFS to detect cycle
    const visited = new Set<string>()
    const recursionStack = new Set<string>()

    const hasCycle = (node: string): boolean => {
      visited.add(node)
      recursionStack.add(node)

      const neighbors = graph.get(node) || new Set()
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (hasCycle(neighbor)) return true
        } else if (recursionStack.has(neighbor)) {
          return true
        }
      }

      recursionStack.delete(node)
      return false
    }

    // Check all nodes
    for (const node of graph.keys()) {
      if (!visited.has(node)) {
        if (hasCycle(node)) return true
      }
    }

    return false
  },

  getDependencies: (taskId: string): string[] => {
    const { connections } = get()
    const dependencies = new Set<string>()

    const collectDependencies = (currentId: string) => {
      const incoming = connections.filter(c => c.targetTaskId === currentId)
      incoming.forEach(conn => {
        if (!dependencies.has(conn.sourceTaskId)) {
          dependencies.add(conn.sourceTaskId)
          collectDependencies(conn.sourceTaskId)
        }
      })
    }

    collectDependencies(taskId)
    return Array.from(dependencies)
  },

  selectConnection: (id: string | null) => {
    set({ selectedConnectionId: id })
  },

  deleteSelectedConnection: () => {
    const { selectedConnectionId, removeConnection } = get()
    if (selectedConnectionId) {
      removeConnection(selectedConnectionId)
    }
  }
}))
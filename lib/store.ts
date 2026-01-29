import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'

export interface Message {
  id: string
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface TrainingExample {
  id: string
  messages: Message[]
  tags: string[]
  score: number
  createdAt: string
  updatedAt: string
}

export interface Dataset {
  id: string
  name: string
  description: string
  examples: TrainingExample[]
  createdAt: string
  updatedAt: string
}

interface TrainerStore {
  datasets: Dataset[]
  activeDatasetId: string | null
  
  // Dataset actions
  createDataset: (name: string, description?: string) => string
  deleteDataset: (id: string) => void
  setActiveDataset: (id: string | null) => void
  
  // Example actions
  addExample: (datasetId: string, messages: Message[], tags?: string[]) => void
  updateExample: (datasetId: string, exampleId: string, updates: Partial<TrainingExample>) => void
  deleteExample: (datasetId: string, exampleId: string) => void
  
  // Getters
  getActiveDataset: () => Dataset | null
  getDatasetById: (id: string) => Dataset | null
}

export const useTrainerStore = create<TrainerStore>()(
  persist(
    (set, get) => ({
      datasets: [],
      activeDatasetId: null,
      
      createDataset: (name, description = '') => {
        const id = nanoid()
        const now = new Date().toISOString()
        const dataset: Dataset = {
          id,
          name,
          description,
          examples: [],
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({
          datasets: [...state.datasets, dataset],
          activeDatasetId: id,
        }))
        return id
      },
      
      deleteDataset: (id) => {
        set((state) => ({
          datasets: state.datasets.filter((d) => d.id !== id),
          activeDatasetId: state.activeDatasetId === id ? null : state.activeDatasetId,
        }))
      },
      
      setActiveDataset: (id) => {
        set({ activeDatasetId: id })
      },
      
      addExample: (datasetId, messages, tags = []) => {
        const example: TrainingExample = {
          id: nanoid(),
          messages,
          tags,
          score: calculateScore(messages),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({
          datasets: state.datasets.map((d) =>
            d.id === datasetId
              ? { ...d, examples: [...d.examples, example], updatedAt: new Date().toISOString() }
              : d
          ),
        }))
      },
      
      updateExample: (datasetId, exampleId, updates) => {
        set((state) => ({
          datasets: state.datasets.map((d) =>
            d.id === datasetId
              ? {
                  ...d,
                  examples: d.examples.map((e) =>
                    e.id === exampleId
                      ? { ...e, ...updates, updatedAt: new Date().toISOString() }
                      : e
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : d
          ),
        }))
      },
      
      deleteExample: (datasetId, exampleId) => {
        set((state) => ({
          datasets: state.datasets.map((d) =>
            d.id === datasetId
              ? {
                  ...d,
                  examples: d.examples.filter((e) => e.id !== exampleId),
                  updatedAt: new Date().toISOString(),
                }
              : d
          ),
        }))
      },
      
      getActiveDataset: () => {
        const state = get()
        return state.datasets.find((d) => d.id === state.activeDatasetId) || null
      },
      
      getDatasetById: (id) => {
        return get().datasets.find((d) => d.id === id) || null
      },
    }),
    {
      name: 'ai-trainer-storage',
    }
  )
)

// Simple quality scoring
function calculateScore(messages: Message[]): number {
  let score = 0
  
  // Has system prompt
  if (messages.some((m) => m.role === 'system' && m.content.length > 10)) {
    score += 20
  }
  
  // Has user message
  const userMessages = messages.filter((m) => m.role === 'user')
  if (userMessages.length > 0) {
    score += 20
    // Quality of user message
    if (userMessages.some((m) => m.content.length > 20)) score += 10
  }
  
  // Has assistant response
  const assistantMessages = messages.filter((m) => m.role === 'assistant')
  if (assistantMessages.length > 0) {
    score += 20
    // Quality of response
    if (assistantMessages.some((m) => m.content.length > 50)) score += 15
    if (assistantMessages.some((m) => m.content.length > 200)) score += 15
  }
  
  return Math.min(100, score)
}

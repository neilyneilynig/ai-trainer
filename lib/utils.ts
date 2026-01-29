import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Dataset, TrainingExample } from './store'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Export to JSONL format (OpenAI fine-tuning compatible)
export function exportToJSONL(examples: TrainingExample[]): string {
  return examples
    .map((example) => {
      const formatted = {
        messages: example.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }
      return JSON.stringify(formatted)
    })
    .join('\n')
}

// Export to CSV
export function exportToCSV(examples: TrainingExample[]): string {
  const headers = ['id', 'system', 'user', 'assistant', 'tags', 'score', 'created_at']
  const rows = examples.map((e) => {
    const system = e.messages.find((m) => m.role === 'system')?.content || ''
    const user = e.messages.find((m) => m.role === 'user')?.content || ''
    const assistant = e.messages.find((m) => m.role === 'assistant')?.content || ''
    return [
      e.id,
      `"${system.replace(/"/g, '""')}"`,
      `"${user.replace(/"/g, '""')}"`,
      `"${assistant.replace(/"/g, '""')}"`,
      `"${e.tags.join(', ')}"`,
      e.score.toString(),
      e.createdAt,
    ].join(',')
  })
  return [headers.join(','), ...rows].join('\n')
}

// Export to Alpaca format
export function exportToAlpaca(examples: TrainingExample[]): string {
  return examples
    .map((example) => {
      const instruction = example.messages.find((m) => m.role === 'user')?.content || ''
      const output = example.messages.find((m) => m.role === 'assistant')?.content || ''
      const systemPrompt = example.messages.find((m) => m.role === 'system')?.content || ''
      
      return JSON.stringify({
        instruction,
        input: systemPrompt,
        output,
      })
    })
    .join('\n')
}

// Download file helper
export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Calculate dataset stats
export function getDatasetStats(dataset: Dataset) {
  const examples = dataset.examples
  const totalExamples = examples.length
  const avgScore = totalExamples > 0
    ? Math.round(examples.reduce((sum, e) => sum + e.score, 0) / totalExamples)
    : 0
  const totalTokens = examples.reduce((sum, e) => {
    return sum + e.messages.reduce((msgSum, m) => msgSum + m.content.split(/\s+/).length, 0)
  }, 0)
  
  return {
    totalExamples,
    avgScore,
    totalTokens,
    estimatedCost: (totalTokens / 1000 * 0.008).toFixed(4), // Rough estimate
  }
}

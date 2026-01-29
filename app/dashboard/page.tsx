'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Brain, Plus, Trash2, FileJson, Download, 
  BarChart3, Tag, Clock, ChevronRight 
} from 'lucide-react'
import { useTrainerStore, type Dataset } from '@/lib/store'
import { formatDate, getDatasetStats, exportToJSONL, exportToCSV, downloadFile } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function Dashboard() {
  const { datasets, createDataset, deleteDataset, setActiveDataset } = useTrainerStore()
  const [showNewModal, setShowNewModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')

  const handleCreate = () => {
    if (newName.trim()) {
      createDataset(newName.trim(), newDesc.trim())
      setNewName('')
      setNewDesc('')
      setShowNewModal(false)
    }
  }

  const handleExport = (dataset: Dataset, format: 'jsonl' | 'csv') => {
    const content = format === 'jsonl' 
      ? exportToJSONL(dataset.examples)
      : exportToCSV(dataset.examples)
    const filename = `${dataset.name.toLowerCase().replace(/\s+/g, '-')}.${format}`
    downloadFile(content, filename, format === 'jsonl' ? 'application/jsonl' : 'text/csv')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2">
              <Brain className="w-7 h-7 text-primary" />
              <span className="font-bold text-lg">AI Trainer</span>
            </Link>
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              <Plus className="w-4 h-4" />
              New Dataset
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Datasets</h1>
          <p className="text-muted-foreground">
            Create and manage your AI training data
          </p>
        </div>

        {datasets.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-xl">
            <FileJson className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No datasets yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first dataset to start building training data
            </p>
            <button
              onClick={() => setShowNewModal(true)}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition"
            >
              <Plus className="w-4 h-4" />
              Create Dataset
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {datasets.map((dataset) => {
              const stats = getDatasetStats(dataset)
              return (
                <div
                  key={dataset.id}
                  className="border border-border/40 rounded-xl p-5 bg-secondary/10 hover:bg-secondary/20 transition group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{dataset.name}</h3>
                      {dataset.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {dataset.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteDataset(dataset.id)}
                      className="text-muted-foreground hover:text-destructive transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileJson className="w-4 h-4" />
                      <span>{stats.totalExamples} examples</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <BarChart3 className="w-4 h-4" />
                      <span>Score: {stats.avgScore}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Tag className="w-4 h-4" />
                      <span>~{stats.totalTokens} tokens</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(dataset.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/builder?dataset=${dataset.id}`}
                      onClick={() => setActiveDataset(dataset.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
                    >
                      Open Builder
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleExport(dataset, 'jsonl')}
                      className="p-2 border border-border rounded-lg hover:bg-secondary/50 transition"
                      title="Export JSONL"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* New Dataset Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Dataset</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="My Training Data"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (optional)</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="What is this dataset for?"
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 rounded-lg border border-border hover:bg-secondary/50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

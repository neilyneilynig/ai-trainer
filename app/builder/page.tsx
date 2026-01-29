'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Brain, ArrowLeft, Plus, Trash2, Save, Copy, 
  User, Bot, Settings, Tag, CheckCircle 
} from 'lucide-react'
import { useTrainerStore, type Message } from '@/lib/store'
import { cn } from '@/lib/utils'
import { nanoid } from 'nanoid'

export default function Builder() {
  const searchParams = useSearchParams()
  const datasetId = searchParams.get('dataset')
  
  const { getDatasetById, addExample, setActiveDataset } = useTrainerStore()
  const dataset = datasetId ? getDatasetById(datasetId) : null

  const [messages, setMessages] = useState<Message[]>([
    { id: nanoid(), role: 'system', content: '' },
    { id: nanoid(), role: 'user', content: '' },
    { id: nanoid(), role: 'assistant', content: '' },
  ])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (datasetId) {
      setActiveDataset(datasetId)
    }
  }, [datasetId, setActiveDataset])

  const updateMessage = (id: string, content: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, content } : m))
    )
    setSaved(false)
  }

  const addMessage = (role: 'user' | 'assistant') => {
    setMessages((prev) => [...prev, { id: nanoid(), role, content: '' }])
    setSaved(false)
  }

  const removeMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id))
    setSaved(false)
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  const handleSave = () => {
    if (!datasetId) return
    
    const validMessages = messages.filter((m) => m.content.trim())
    if (validMessages.length < 2) return

    addExample(datasetId, validMessages, tags)
    
    // Reset for next example
    setMessages([
      { id: nanoid(), role: 'system', content: messages[0]?.content || '' },
      { id: nanoid(), role: 'user', content: '' },
      { id: nanoid(), role: 'assistant', content: '' },
    ])
    setTags([])
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleCopyJSON = () => {
    const json = JSON.stringify({
      messages: messages
        .filter((m) => m.content.trim())
        .map((m) => ({ role: m.role, content: m.content })),
    }, null, 2)
    navigator.clipboard.writeText(json)
  }

  if (!dataset) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Dataset not found</p>
          <Link href="/dashboard" className="text-primary hover:underline">
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary" />
                <span className="font-semibold">{dataset.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {dataset.examples.length} examples
              </span>
              <button
                onClick={handleCopyJSON}
                className="p-2 text-muted-foreground hover:text-foreground transition"
                title="Copy as JSON"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={cn(
                'rounded-xl border border-border/40 overflow-hidden',
                message.role === 'system' && 'bg-secondary/30',
                message.role === 'user' && 'bg-blue-500/5',
                message.role === 'assistant' && 'bg-green-500/5'
              )}
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-background/50">
                <div className="flex items-center gap-2">
                  {message.role === 'system' && <Settings className="w-4 h-4 text-muted-foreground" />}
                  {message.role === 'user' && <User className="w-4 h-4 text-blue-400" />}
                  {message.role === 'assistant' && <Bot className="w-4 h-4 text-green-400" />}
                  <span className="text-sm font-medium capitalize">{message.role}</span>
                </div>
                {index > 0 && (
                  <button
                    onClick={() => removeMessage(message.id)}
                    className="text-muted-foreground hover:text-destructive transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <textarea
                value={message.content}
                onChange={(e) => updateMessage(message.id, e.target.value)}
                placeholder={
                  message.role === 'system'
                    ? 'You are a helpful assistant...'
                    : message.role === 'user'
                    ? 'Enter the user message...'
                    : 'Enter the assistant response...'
                }
                rows={message.role === 'assistant' ? 6 : 3}
                className="w-full px-4 py-3 bg-transparent focus:outline-none resize-none"
              />
            </div>
          ))}
        </div>

        {/* Add Message Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => addMessage('user')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-secondary/50 transition text-sm"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
          <button
            onClick={() => addMessage('assistant')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-secondary/50 transition text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Assistant
          </button>
        </div>

        {/* Tags */}
        <div className="mt-8">
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-sm"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:text-destructive"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              placeholder="Add a tag..."
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <button
              onClick={addTag}
              className="px-4 py-2 rounded-lg border border-border hover:bg-secondary/50 transition"
            >
              <Tag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={messages.filter((m) => m.content.trim()).length < 2}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition',
              saved
                ? 'bg-green-500 text-white'
                : 'bg-primary text-primary-foreground hover:opacity-90',
              'disabled:opacity-50'
            )}
          >
            {saved ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Example
              </>
            )}
          </button>
        </div>

        {/* Recent Examples */}
        {dataset.examples.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-semibold mb-4">Recent Examples</h2>
            <div className="space-y-3">
              {dataset.examples.slice(-5).reverse().map((example) => (
                <div
                  key={example.id}
                  className="p-4 rounded-lg border border-border/40 bg-secondary/10"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2">
                      {example.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-full bg-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Score: {example.score}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {example.messages.find((m) => m.role === 'user')?.content || 'No user message'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

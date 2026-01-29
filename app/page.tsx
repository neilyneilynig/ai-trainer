'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Brain, Database, FileJson, Sparkles, ArrowRight, Github } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm fixed top-0 w-full z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-primary" />
              <span className="font-bold text-xl">AI Trainer</span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="https://github.com/neilyneilynig/ai-trainer"
                className="text-muted-foreground hover:text-foreground transition"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link 
                href="/dashboard"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full text-sm mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Build better AI models with better data</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            Create Training Data
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
              That Actually Works
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            An intuitive platform for building, managing, and exporting high-quality 
            datasets for fine-tuning LLMs. No more messy spreadsheets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-medium hover:opacity-90 transition"
            >
              Start Building
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/demo"
              className="inline-flex items-center justify-center gap-2 border border-border px-8 py-4 rounded-lg text-lg font-medium hover:bg-secondary/50 transition"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-t border-border/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to build training data
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Database className="w-8 h-8" />}
              title="Dataset Management"
              description="Organize your training examples with tags, categories, and smart search. Never lose track of your data."
            />
            <FeatureCard
              icon={<FileJson className="w-8 h-8" />}
              title="Multiple Export Formats"
              description="Export to JSONL, CSV, or OpenAI-compatible formats. Ready for fine-tuning in seconds."
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title="Quality Scoring"
              description="Automatic analysis of clarity, completeness, and diversity. Build better datasets faster."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-border/40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to build better AI?</h2>
          <p className="text-muted-foreground mb-8">
            Start creating high-quality training data in minutes.
          </p>
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-medium hover:opacity-90 transition"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            <span className="font-semibold">AI Trainer</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ for the AI community
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="p-6 rounded-xl border border-border/40 bg-secondary/20 hover:bg-secondary/40 transition">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

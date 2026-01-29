# 🧠 AI Trainer

A modern web application for creating, managing, and exporting high-quality AI training datasets.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)

## ✨ Features

- **📝 Conversation Builder** - Create chat-style training data with an intuitive UI
- **📊 Dataset Management** - Organize, tag, and search your training examples
- **🔍 Quality Scoring** - Automatic quality metrics for your training data
- **🔄 Deduplication** - Find and remove similar/duplicate entries
- **📤 Export Formats** - JSONL, CSV, and OpenAI-compatible formats
- **🏷️ Smart Tagging** - Auto-categorize entries by topic and complexity
- **📈 Analytics** - Track dataset growth and quality over time

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/neilyneilynig/ai-trainer.git
cd ai-trainer

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start building your dataset.

## 📁 Project Structure

```
ai-trainer/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── dashboard/         # Main dashboard
│   ├── datasets/          # Dataset management
│   ├── builder/           # Conversation builder
│   └── export/            # Export functionality
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── builder/          # Builder-specific components
│   └── dashboard/        # Dashboard components
├── lib/                   # Utilities and helpers
│   ├── scoring/          # Quality scoring algorithms
│   ├── export/           # Export formatters
│   └── db/               # Database utilities
└── public/               # Static assets
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: SQLite (local) / PostgreSQL (production)
- **State**: Zustand
- **Forms**: React Hook Form + Zod

## 📊 Training Data Formats

### Chat Format (OpenAI-compatible)
```json
{
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is machine learning?"},
    {"role": "assistant", "content": "Machine learning is..."}
  ]
}
```

### Instruction Format
```json
{
  "instruction": "Explain quantum computing",
  "input": "",
  "output": "Quantum computing is..."
}
```

## 🔧 Configuration

Create a `.env.local` file:

```env
# Database
DATABASE_URL="file:./data/trainer.db"

# Optional: OpenAI for auto-suggestions
OPENAI_API_KEY="sk-..."

# Optional: Analytics
NEXT_PUBLIC_POSTHOG_KEY="phc_..."
```

## 📈 Quality Metrics

AI Trainer automatically scores your training data on:

| Metric | Description |
|--------|-------------|
| **Clarity** | How clear and unambiguous the instruction is |
| **Completeness** | Whether the response fully addresses the prompt |
| **Consistency** | Alignment with other similar examples |
| **Diversity** | Uniqueness compared to existing dataset |

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ for the AI community

# Hugging Face AI Integration (2025)

## Overview

This implementation uses the latest 2025 approach for integrating Hugging Face AI models with Next.js applications. It provides robust, free-tier AI capabilities with intelligent fallbacks.

## Key Features

### 🔄 Multi-Model Strategy
- Tries multiple free-tier models for maximum reliability
- Automatic fallback to template-based generation if AI fails
- Smart model selection based on task type

### 🛡️ Robust Error Handling
- Handles rate limiting (429 errors) with automatic retry
- Manages model loading states (503 errors)
- Implements timeout protection (15 seconds)
- Graceful degradation to templates

### 🎯 Enhanced Prompt Engineering
- Context-aware prompts for different tasks
- Structured prompts for consistent results
- Optimized parameters for quality output

### 📊 Usage Tracking
- Logs AI vs template usage
- Token estimation for cost tracking
- Performance monitoring

## Available Models

The system tries these models in order:

1. **microsoft/DialoGPT-medium** - Conversational responses
2. **facebook/blenderbot-400M-distill** - Natural language generation
3. **google/flan-t5-small** - Versatile text-to-text
4. **distilgpt2** - Lightweight GPT-2 variant
5. **microsoft/phi-2** - Microsoft's efficient model

## API Usage

### Generate Invoice Description

```typescript
const response = await fetch('/api/ai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'description_generation',
    input: 'web development service'
  })
})

const data = await response.json()
// Returns: { success: true, data: { description, quantity, price }, usedAI: true }
```

### Generate Payment Reminder

```typescript
const response = await fetch('/api/ai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'reminder_draft',
    input: 'Invoice #123 overdue by 15 days'
  })
})

const data = await response.json()
// Returns: { success: true, generated_text: "...", usedAI: true }
```

## Environment Setup

Add your Hugging Face API key:

```bash
HUGGINGFACE_API_KEY=your_api_key_here
```

## Smart Price Estimation

The system intelligently estimates prices based on keywords:
- **Premium/Advanced/Enterprise**: $400+
- **Consulting/Strategy**: $300+
- **Basic/Simple**: $100+
- **Default**: $150+

## Error Handling Strategy

1. **Try AI Models**: Attempts each model with timeout
2. **Rate Limit Handling**: Waits and retries on 429 errors
3. **Model Loading**: Waits for model initialization on 503
4. **Fallback to Templates**: Uses predefined templates if all AI fails
5. **Graceful Failure**: Never fails completely, always returns a response

## Performance Optimizations

- **Caching**: Uses Hugging Face cache when available
- **Timeout**: 15-second limit per model attempt
- **Retry Logic**: Intelligent retry with exponential backoff
- **Model Selection**: Prioritizes faster, more reliable models

## Testing

Use the test utility:

```typescript
import { testHuggingFaceIntegration } from '@/lib/test-ai'

// Run comprehensive tests
await testHuggingFaceIntegration()
```

This will test multiple inputs and log success/failure rates.

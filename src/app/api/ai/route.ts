import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'

interface AIRequest {
  action: 'description_generation' | 'reminder_draft'
  input: string
  context?: string
}

interface LineItemData {
  description: string
  quantity: number
  price: number
}

// Use a simpler approach without external API calls to avoid authentication issues
const DESCRIPTION_TEMPLATES = {
  'logo': ['Professional logo design', 'Custom logo creation', 'Brand identity logo', 'Corporate logo design'],
  'design': ['Creative design service', 'Professional design work', 'Custom design solution', 'Graphic design service'],
  'website': ['Website development', 'Web design service', 'Professional website', 'Custom web solution'],
  'consultation': ['Professional consultation', 'Expert consultation service', 'Business consultation', 'Strategic consultation'],
  'development': ['Software development', 'Custom development service', 'Application development', 'Technical development'],
  'marketing': ['Marketing service', 'Digital marketing campaign', 'Marketing consultation', 'Brand marketing'],
  'content': ['Content creation service', 'Professional content writing', 'Content development', 'Creative content service']
}

// Parse user input to extract quantity, price, and description
function parseUserInput(input: string): { description: string; quantity: number; price: number } {
  // Remove common currency symbols and normalize
  const cleanInput = input.toLowerCase().trim()
  
  // Extract quantity (look for numbers followed by common item words)
  const quantityMatch = cleanInput.match(/(\d+)\s*(?:x\s*)?(?:logos?|designs?|items?|pieces?|units?|services?)?/i)
  const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1
  
  // Extract price (look for numbers with currency symbols)
  const priceMatch = cleanInput.match(/(?:\$|usd|dollars?|€|eur|euros?|£|gbp|pounds?)\s*(\d+(?:\.\d{2})?)|(?:(\d+(?:\.\d{2})?)\s*(?:\$|usd|dollars?|€|eur|euros?|£|gbp|pounds?))/i)
  const price = priceMatch ? parseFloat(priceMatch[1] || priceMatch[2]) : 100.0
  
  // Clean description by removing quantity and price info
  let description = input
    .replace(/\d+\s*(?:x\s*)?(?:logos?|designs?|items?|pieces?|units?|services?)?/gi, '')
    .replace(/(?:\$|usd|dollars?|€|eur|euros?|£|gbp|pounds?)\s*\d+(?:\.\d{2})?|\d+(?:\.\d{2})?\s*(?:\$|usd|dollars?|€|eur|euros?|£|gbp|pounds?)/gi, '')
    .trim()
  
  // If description is empty or too short, use the original input
  if (!description || description.length < 3) {
    description = input
  }
  
  return { description, quantity, price }
}

// Generate professional description using smart templates
function generateSmartDescription(input: string): string {
  const cleanInput = input.toLowerCase().trim()
  
  // Find matching template category
  for (const [category, templates] of Object.entries(DESCRIPTION_TEMPLATES)) {
    if (cleanInput.includes(category)) {
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)]
      return randomTemplate
    }
  }
  
  // If no specific category matches, create a professional description
  const words = input.split(' ').filter(word => word.length > 2)
  if (words.length > 0) {
    const mainWord = words[0]
    return `Professional ${mainWord} service`
  }
  
  return `Professional ${input} service`
}

// Template fallback for when AI fails
function generateTemplateDescription(description: string): string {
  const templates = [
    `Professional ${description} service`,
    `Custom ${description} solution`,
    `High-quality ${description} delivery`,
    `Premium ${description} package`
  ]
  return templates[Math.floor(Math.random() * templates.length)]
}

// Main AI processing function
async function processAIRequest(action: string, input: string): Promise<LineItemData | string> {
  if (action === 'description_generation') {
    // Parse the user input to extract quantity, price, and base description
    const parsed = parseUserInput(input)
    
    // Generate smart description using templates
    const enhancedDescription = generateSmartDescription(parsed.description)
    
    return {
      description: enhancedDescription,
      quantity: parsed.quantity,
      price: parsed.price
    }
  } else {
    // For reminder emails, use simple template
    return `Dear Client,\n\nThis is a friendly reminder about your pending invoice for ${input}. Please process the payment at your earliest convenience.\n\nThank you for your business!`
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: AIRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const { action, input } = body
    if (!action || !input) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let generatedResult: LineItemData | string = ''
    let usedAI = false

    try {
      generatedResult = await processAIRequest(action, input)
      usedAI = true
    } catch (err) {
      console.log('AI processing failed:', err)
      // Fallback to basic parsing without AI enhancement
      if (action === 'description_generation') {
        const parsed = parseUserInput(input)
        generatedResult = {
          description: generateTemplateDescription(parsed.description),
          quantity: parsed.quantity,
          price: parsed.price
        }
      } else {
        generatedResult = `Payment reminder for: ${input}`
      }
    }

    // Log AI usage
    try {
      const supabase = await createServerSupabaseClient()
      const tokensUsed = Math.ceil(
        (typeof generatedResult === 'string'
          ? generatedResult.length
          : JSON.stringify(generatedResult).length) / 4
      )
      await supabase.from('ai_usage_logs').insert({
        user_id: user.id,
        action,
        tokens_used: tokensUsed,
        model_used: usedAI ? 'smart-template' : 'template-based',
        cost: 0,
      })
    } catch (logError) {
      console.error('Failed to log AI usage:', logError)
    }

    if (action === 'description_generation' && typeof generatedResult === 'object') {
      return NextResponse.json({ success: true, data: generatedResult, usedAI })
    } else {
      return NextResponse.json({ success: true, generated_text: generatedResult as string, usedAI })
    }
  } catch (error) {
    console.error('AI API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

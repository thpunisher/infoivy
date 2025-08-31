export interface LineItemData {
  description: string
  quantity: number
  price: number
}

export interface AIResponse {
  success: boolean
  generated_text?: string
  data?: LineItemData
  action: string
  model: string
}

export async function generateDescription(input: string): Promise<{ success: boolean; data?: LineItemData; error?: string }> {
  try {
    console.log('Generating description for input:', input)
    
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'description_generation',
        input: input.trim()
      })
    })

    console.log('Response status:', response.status, response.statusText)

    if (!response.ok) {
      let errorMessage = 'Failed to generate description'
      try {
        const errorData = await response.json()
        console.log('Error response data:', errorData)
        if (errorData.error) {
          errorMessage = errorData.error
        }
      } catch (parseError) {
        // If we can't parse the error response, use the status text
        console.log('Could not parse error response:', parseError)
        errorMessage = `Failed to generate description: ${response.status} ${response.statusText}`
      }
      
      console.log('Returning error:', errorMessage)
      return { success: false, error: errorMessage }
    }

    const data: AIResponse = await response.json()
    console.log('Success response data:', data)

    if (data.success && data.data) {
      return { success: true, data: data.data }
    } else {
      return { success: false, error: 'AI service returned invalid response' }
    }
  } catch (error) {
    console.error('Error generating description:', error)
    const errorMessage = error instanceof Error ? error.message : 'Network error occurred'
    return { success: false, error: errorMessage }
  }
}

export async function draftReminder(input: string, context?: string): Promise<{ success: boolean; text?: string; error?: string }> {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'reminder_draft',
        input: input.trim(),
        context: context || 'Payment is overdue'
      })
    })

    if (!response.ok) {
      let errorMessage = 'Failed to draft reminder'
      try {
        const errorData = await response.json()
        if (errorData.error) {
          errorMessage = errorData.error
        }
      } catch {
        // If we can't parse the error response, use the status text
        errorMessage = `Failed to draft reminder: ${response.status} ${response.statusText}`
      }
      
      return { success: false, error: errorMessage }
    }

    const data: AIResponse = await response.json()
    if (data.success && data.generated_text) {
      return { success: true, text: data.generated_text }
    } else {
      return { success: false, error: 'AI service returned invalid response' }
    }
  } catch (error) {
    console.error('Error drafting reminder:', error)
    const errorMessage = error instanceof Error ? error.message : 'Network error occurred'
    return { success: false, error: errorMessage }
  }
}

export function validateAIInput(input: string): { isValid: boolean; error?: string } {
  if (!input || input.trim().length === 0) {
    return { isValid: false, error: 'Input cannot be empty' }
  }

  if (input.trim().length < 5) {
    return { isValid: false, error: 'Input must be at least 5 characters long' }
  }

  if (input.trim().length > 200) {
    return { isValid: false, error: 'Input must be less than 200 characters' }
  }

  return { isValid: true }
}

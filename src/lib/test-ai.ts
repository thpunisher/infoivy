// Test file for AI integration
export async function testHuggingFaceIntegration() {
  const testInputs = [
    'web development service',
    'consulting services',
    'logo design',
    'marketing campaign'
  ]

  console.log('Testing Hugging Face AI Integration...')

  for (const input of testInputs) {
    try {
      console.log(`\nTesting input: "${input}"`)

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

      if (!response.ok) {
        console.log(`❌ Failed for "${input}": ${response.status}`)
        continue
      }

      const data = await response.json()
      console.log(`✅ Success for "${input}":`)
      console.log(`   Used AI: ${data.usedAI}`)
      console.log(`   Model: ${data.model}`)
      if (data.data) {
        console.log(`   Description: ${data.data.description}`)
        console.log(`   Quantity: ${data.data.quantity}`)
        console.log(`   Price: $${data.data.price}`)
      } else {
        console.log(`   Text: ${data.generated_text?.substring(0, 100)}...`)
      }

    } catch (error) {
      console.log(`❌ Error for "${input}":`, error instanceof Error ? error.message : String(error))
    }
  }
}

// Helper function to run tests
export function runAITests() {
  if (typeof window !== 'undefined') {
    // Browser environment
    testHuggingFaceIntegration()
  } else {
    // Node.js environment
    console.log('AI tests should be run in browser environment')
  }
}
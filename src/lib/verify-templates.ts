'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { getUser } from '@/lib/auth'

export async function verifyTemplatesTable() {
  try {
    const user = await getUser()
    if (!user) {
      return { error: 'Not authenticated' }
    }

    const supabase = await createServerSupabaseClient()
    
    // Try to access the invoice_templates table
    const { data, error } = await supabase
      .from('invoice_templates')
      .select('*')
      .eq('user_id', user.id)
      .limit(1)

    if (error) {
      return { error: error.message, code: error.code }
    }

    return { success: true, data }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

import { createClient } from "./supabase/client"

export interface InvoiceTemplate {
  id: string
  user_id: string
  template_name: string
  logo_url?: string
  primary_color: string
  secondary_color: string
  accent_color: string
  font_family: string
  footer_text: string
  watermark_enabled: boolean
  created_at: string
  updated_at: string
}

export const TEMPLATE_PRESETS = {
  modern: {
    name: 'Modern',
    primary_color: '#3B82F6',
    secondary_color: '#1F2937',
    accent_color: '#10B981',
    font_family: 'Inter',
    description: 'Clean, professional design with blue accents'
  },
  minimalist: {
    name: 'Minimalist',
    primary_color: '#000000',
    secondary_color: '#6B7280',
    accent_color: '#374151',
    font_family: 'Inter',
    description: 'Simple, elegant design with minimal colors'
  },
  classic: {
    name: 'Classic',
    primary_color: '#1F2937',
    secondary_color: '#4B5563',
    accent_color: '#DC2626',
    font_family: 'Georgia',
    description: 'Traditional business design with serif fonts'
  },
  vibrant: {
    name: 'Vibrant',
    primary_color: '#7C3AED',
    secondary_color: '#1F2937',
    accent_color: '#F59E0B',
    font_family: 'Inter',
    description: 'Bold, colorful design for creative businesses'
  }
}

export async function getInvoiceTemplate(): Promise<InvoiceTemplate | null> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('invoice_templates')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No template found, create default
        return await createDefaultTemplate(user.id)
      }
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching invoice template:', error)
    return null
  }
}

export async function updateInvoiceTemplate(updates: Partial<InvoiceTemplate>): Promise<InvoiceTemplate | null> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('invoice_templates')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error updating invoice template:', error)
    return null
  }
}

export async function createDefaultTemplate(userId: string): Promise<InvoiceTemplate | null> {
  try {
    const supabase = createClient()
    
    const defaultTemplate = {
      user_id: userId,
      template_name: 'modern',
      primary_color: TEMPLATE_PRESETS.modern.primary_color,
      secondary_color: TEMPLATE_PRESETS.modern.secondary_color,
      accent_color: TEMPLATE_PRESETS.modern.accent_color,
      font_family: TEMPLATE_PRESETS.modern.font_family,
      footer_text: 'Thank you for your business!',
      watermark_enabled: true
    }

    const { data, error } = await supabase
      .from('invoice_templates')
      .insert(defaultTemplate)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error creating default template:', error)
    return null
  }
}

export async function applyTemplatePreset(presetName: keyof typeof TEMPLATE_PRESETS): Promise<InvoiceTemplate | null> {
  try {
    const preset = TEMPLATE_PRESETS[presetName]
    if (!preset) {
      throw new Error('Invalid preset name')
    }

    const updates = {
      template_name: presetName,
      primary_color: preset.primary_color,
      secondary_color: preset.secondary_color,
      accent_color: preset.accent_color,
      font_family: preset.font_family
    }

    return await updateInvoiceTemplate(updates)
  } catch (error) {
    console.error('Error applying template preset:', error)
    return null
  }
}

export async function uploadLogo(file: File): Promise<string | null> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-logo-${Date.now()}.${fileExt}`
    const filePath = `logos/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('invoice-assets')
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
      .from('invoice-assets')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('Error uploading logo:', error)
    return null
  }
}

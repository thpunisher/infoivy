export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          plan: 'free' | 'pro'
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan?: 'free' | 'pro'
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan?: 'free' | 'pro'
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          user_id: string
          number: string
          issue_date: string
          client_name: string
          client_email: string | null
          line_items: any
          subtotal: number
          tax: number
          total: number
          currency: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          number: string
          issue_date?: string
          client_name: string
          client_email?: string | null
          line_items?: any
          subtotal?: number
          tax?: number
          total?: number
          currency?: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          number?: string
          issue_date?: string
          client_name?: string
          client_email?: string | null
          line_items?: any
          subtotal?: number
          tax?: number
          total?: number
          currency?: string
          status?: string
          created_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          company: string | null
          tax_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          company?: string | null
          tax_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          company?: string | null
          tax_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoice_settings: {
        Row: {
          id: string
          user_id: string
          invoice_prefix: string
          next_number: number
          default_currency: string
          default_tax_rate: number
          company_name: string | null
          company_address: string | null
          company_email: string | null
          company_phone: string | null
          company_website: string | null
          logo_url: string | null
          footer_text: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          invoice_prefix?: string
          next_number?: number
          default_currency?: string
          default_tax_rate?: number
          company_name?: string | null
          company_address?: string | null
          company_email?: string | null
          company_phone?: string | null
          company_website?: string | null
          logo_url?: string | null
          footer_text?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          invoice_prefix?: string
          next_number?: number
          default_currency?: string
          default_tax_rate?: number
          company_name?: string | null
          company_address?: string | null
          company_email?: string | null
          company_phone?: string | null
          company_website?: string | null
          logo_url?: string | null
          footer_text?: string
          created_at?: string
          updated_at?: string
        }
      }
      usage_counters: {
        Row: {
          id: string
          user_id: string
          period_start: string
          invoices_created: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          period_start: string
          invoices_created?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          period_start?: string
          invoices_created?: number
          created_at?: string
        }
      }
      invoice_templates: {
        Row: {
          id: string
          user_id: string
          template_name: string
          logo_url: string | null
          primary_color: string
          secondary_color: string
          accent_color: string
          font_family: string
          footer_text: string
          watermark_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_name?: string
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          accent_color?: string
          font_family?: string
          footer_text?: string
          watermark_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          template_name?: string
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          accent_color?: string
          font_family?: string
          footer_text?: string
          watermark_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      ai_usage_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          tokens_used: number | null
          model_used: string
          cost: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          tokens_used?: number | null
          model_used: string
          cost?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          tokens_used?: number | null
          model_used?: string
          cost?: number
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type Invoice = Database['public']['Tables']['invoices']['Row']
export type Client = Database['public']['Tables']['clients']['Row']
export type InvoiceSettings = Database['public']['Tables']['invoice_settings']['Row']
export type UsageCounter = Database['public']['Tables']['usage_counters']['Row']
export type InvoiceTemplate = Database['public']['Tables']['invoice_templates']['Row']
export type AIUsageLog = Database['public']['Tables']['ai_usage_logs']['Row']

export interface LineItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  amount: number
}

export interface InvoiceFormData {
  number: string
  issue_date: string
  client_name: string
  client_email: string
  line_items: LineItem[]
  tax_rate: number
}

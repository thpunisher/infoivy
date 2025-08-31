import { createServerSupabaseClient } from '@/lib/supabase/server'

export interface SecurityAuditEvent {
  action: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

export async function logSecurityEvent(
  userId: string,
  event: SecurityAuditEvent
) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { error } = await supabase
      .from('security_audit_log')
      .insert({
        user_id: userId,
        action: event.action,
        details: event.details || {},
        ip_address: event.ipAddress,
        user_agent: event.userAgent
      })

    if (error) {
      console.error('Failed to log security event:', error)
    }
  } catch (error) {
    console.error('Error logging security event:', error)
  }
}

export async function getSecurityAuditLog(userId: string, limit = 50) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('security_audit_log')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching security audit log:', error)
    return []
  }
}

// Common security events
export const SecurityEvents = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  PASSWORD_CHANGE: 'password_change',
  TWO_FACTOR_ENABLE: '2fa_enable',
  TWO_FACTOR_DISABLE: '2fa_disable',
  FAILED_LOGIN: 'failed_login',
  ACCOUNT_LOCKED: 'account_locked',
  PASSWORD_RESET: 'password_reset',
  EMAIL_CHANGE: 'email_change',
  PROFILE_UPDATE: 'profile_update',
  API_KEY_CREATED: 'api_key_created',
  API_KEY_DELETED: 'api_key_deleted'
} as const

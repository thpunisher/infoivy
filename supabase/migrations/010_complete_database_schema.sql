-- Complete database schema for Invoice SaaS application
-- This migration creates all necessary tables and relationships

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  company TEXT,
  address TEXT,
  website TEXT,
  timezone TEXT DEFAULT 'UTC',
  currency TEXT DEFAULT 'USD',
  avatar_url TEXT,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret TEXT,
  two_factor_backup_codes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create business_info table
CREATE TABLE IF NOT EXISTS business_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT,
  company_address TEXT,
  company_email TEXT,
  company_phone TEXT,
  company_website TEXT,
  tax_id TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'US',
  website TEXT,
  logo_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT,
  tax_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoice_settings table
CREATE TABLE IF NOT EXISTS invoice_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  invoice_prefix TEXT DEFAULT 'INV',
  next_number INTEGER DEFAULT 1,
  default_currency TEXT DEFAULT 'USD',
  default_tax_rate DECIMAL(5,2) DEFAULT 0,
  payment_terms INTEGER DEFAULT 30,
  late_fee_percentage DECIMAL(5,2) DEFAULT 0,
  auto_send_reminders BOOLEAN DEFAULT false,
  reminder_days INTEGER[] DEFAULT '{7,14,30}',
  terms TEXT DEFAULT 'Thank you for your business!',
  notes TEXT,
  footer_text TEXT DEFAULT 'Thank you for your business!',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create notification_settings table
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email_notifications BOOLEAN DEFAULT TRUE,
  email_invoice_sent BOOLEAN DEFAULT true,
  email_payment_received BOOLEAN DEFAULT true,
  email_invoice_overdue BOOLEAN DEFAULT true,
  email_weekly_summary BOOLEAN DEFAULT false,
  push_notifications BOOLEAN DEFAULT false,
  invoice_sent BOOLEAN DEFAULT true,
  payment_received BOOLEAN DEFAULT true,
  overdue_reminders BOOLEAN DEFAULT true,
  weekly_reports BOOLEAN DEFAULT false,
  marketing_emails BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create invoice_templates table
CREATE TABLE IF NOT EXISTS invoice_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_name TEXT DEFAULT 'modern',
  logo_url TEXT,
  primary_color TEXT DEFAULT '#3B82F6',
  secondary_color TEXT DEFAULT '#1F2937',
  accent_color TEXT DEFAULT '#10B981',
  font_family TEXT DEFAULT 'Inter',
  footer_text TEXT DEFAULT 'Thank you for your business!',
  watermark_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  number TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  subtotal DECIMAL(12,2) DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  notes TEXT,
  terms TEXT,
  client_name TEXT,
  client_email TEXT,
  client_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, number)
);

-- Create invoice_line_items table
CREATE TABLE IF NOT EXISTS invoice_line_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  rate DECIMAL(12,2) NOT NULL DEFAULT 0,
  amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create security_audit_log table
CREATE TABLE IF NOT EXISTS security_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  plan_name TEXT DEFAULT 'free',
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add missing columns to existing tables
ALTER TABLE notification_settings ADD COLUMN IF NOT EXISTS email_invoice_overdue BOOLEAN DEFAULT TRUE;

-- Create indexes for better performance (only for existing columns)
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_invoice_id ON invoice_line_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON security_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_action ON security_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_profiles_two_factor_enabled ON profiles(two_factor_enabled) WHERE two_factor_enabled = TRUE;

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view own business info" ON business_info;
DROP POLICY IF EXISTS "Users can update own business info" ON business_info;
DROP POLICY IF EXISTS "Users can insert own business info" ON business_info;

DROP POLICY IF EXISTS "Users can view own clients" ON clients;
DROP POLICY IF EXISTS "Users can update own clients" ON clients;
DROP POLICY IF EXISTS "Users can insert own clients" ON clients;
DROP POLICY IF EXISTS "Users can delete own clients" ON clients;

DROP POLICY IF EXISTS "Users can view own invoice settings" ON invoice_settings;
DROP POLICY IF EXISTS "Users can update own invoice settings" ON invoice_settings;
DROP POLICY IF EXISTS "Users can insert own invoice settings" ON invoice_settings;

DROP POLICY IF EXISTS "Users can view own notification settings" ON notification_settings;
DROP POLICY IF EXISTS "Users can update own notification settings" ON notification_settings;
DROP POLICY IF EXISTS "Users can insert own notification settings" ON notification_settings;

DROP POLICY IF EXISTS "Users can view own invoice templates" ON invoice_templates;
DROP POLICY IF EXISTS "Users can update own invoice templates" ON invoice_templates;
DROP POLICY IF EXISTS "Users can insert own invoice templates" ON invoice_templates;

DROP POLICY IF EXISTS "Users can view own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can update own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can insert own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can delete own invoices" ON invoices;

DROP POLICY IF EXISTS "Users can view own invoice line items" ON invoice_line_items;
DROP POLICY IF EXISTS "Users can update own invoice line items" ON invoice_line_items;
DROP POLICY IF EXISTS "Users can insert own invoice line items" ON invoice_line_items;
DROP POLICY IF EXISTS "Users can delete own invoice line items" ON invoice_line_items;

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can insert own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;

DROP POLICY IF EXISTS "Users can view their own audit logs" ON security_audit_log;
DROP POLICY IF EXISTS "System can insert audit logs" ON security_audit_log;

DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscription" ON subscriptions;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for business_info
CREATE POLICY "Users can view own business info" ON business_info FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own business info" ON business_info FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own business info" ON business_info FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for clients
CREATE POLICY "Users can view own clients" ON clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own clients" ON clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own clients" ON clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own clients" ON clients FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for invoice_settings
CREATE POLICY "Users can view own invoice settings" ON invoice_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own invoice settings" ON invoice_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own invoice settings" ON invoice_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for notification_settings
CREATE POLICY "Users can view own notification settings" ON notification_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notification settings" ON notification_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notification settings" ON notification_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for invoice_templates
CREATE POLICY "Users can view own invoice templates" ON invoice_templates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own invoice templates" ON invoice_templates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own invoice templates" ON invoice_templates FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for invoices
CREATE POLICY "Users can view own invoices" ON invoices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own invoices" ON invoices FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own invoices" ON invoices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own invoices" ON invoices FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for invoice_line_items
CREATE POLICY "Users can view own invoice line items" ON invoice_line_items 
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM invoices WHERE id = invoice_id));
CREATE POLICY "Users can update own invoice line items" ON invoice_line_items 
  FOR UPDATE USING (auth.uid() = (SELECT user_id FROM invoices WHERE id = invoice_id));
CREATE POLICY "Users can insert own invoice line items" ON invoice_line_items 
  FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM invoices WHERE id = invoice_id));
CREATE POLICY "Users can delete own invoice line items" ON invoice_line_items 
  FOR DELETE USING (auth.uid() = (SELECT user_id FROM invoices WHERE id = invoice_id));

-- Create RLS policies for notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notifications" ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON notifications FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for security_audit_log
CREATE POLICY "Users can view their own audit logs" ON security_audit_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert audit logs" ON security_audit_log FOR INSERT WITH CHECK (true);

-- Create RLS policies for subscriptions
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own subscription" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscription" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_business_info_updated_at ON business_info;
DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
DROP TRIGGER IF EXISTS update_invoice_settings_updated_at ON invoice_settings;
DROP TRIGGER IF EXISTS update_notification_settings_updated_at ON notification_settings;
DROP TRIGGER IF EXISTS update_invoice_templates_updated_at ON invoice_templates;
DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_info_updated_at BEFORE UPDATE ON business_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoice_settings_updated_at BEFORE UPDATE ON invoice_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_settings_updated_at BEFORE UPDATE ON notification_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoice_templates_updated_at BEFORE UPDATE ON invoice_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE profiles IS 'User profiles extending auth.users with additional information';
COMMENT ON TABLE business_info IS 'Business information for invoice branding and details';
COMMENT ON TABLE clients IS 'Client/customer information for invoicing';
COMMENT ON TABLE invoice_settings IS 'User-specific invoice configuration and defaults';
COMMENT ON TABLE notification_settings IS 'User notification preferences for various events';
COMMENT ON TABLE invoice_templates IS 'Customizable invoice template settings';
COMMENT ON TABLE invoices IS 'Invoice records with client and payment information';
COMMENT ON TABLE invoice_line_items IS 'Individual line items for each invoice';
COMMENT ON TABLE notifications IS 'In-app notifications for users';
COMMENT ON TABLE security_audit_log IS 'Security audit log for tracking user security-related actions';
COMMENT ON TABLE subscriptions IS 'User subscription and billing information';

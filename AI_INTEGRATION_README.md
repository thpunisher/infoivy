# AI Integration & Invoice Template Features

This document describes the new features added to Invofy for AI-powered invoice assistance and customizable invoice templates.

## Features Added

### 1. Customizable Invoice Templates

- **Template Presets**: Choose from 4 professionally designed templates:
  - Modern: Clean, professional design with blue accents
  - Minimalist: Simple, elegant design with minimal colors
  - Classic: Traditional business design with serif fonts
  - Vibrant: Bold, colorful design for creative businesses

- **Customization Options**:
  - Logo upload and management
  - Color scheme customization (primary, secondary, accent colors)
  - Font family selection
  - Footer text customization
  - Watermark settings

### 2. AI Integration (Free + Lightweight)

- **AI Description Generator**: Automatically expand brief descriptions into professional invoice line items
- **AI Reminder Drafter**: Generate polite but firm payment reminder emails
- **Free Hugging Face Integration**: Uses Mistral-7B-Instruct model for cost-effective AI generation

## Database Schema Changes

### New Tables

#### `invoice_templates`
```sql
CREATE TABLE public.invoice_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  template_name text NOT NULL DEFAULT 'modern',
  logo_url text,
  primary_color text DEFAULT '#3B82F6',
  secondary_color text DEFAULT '#1F2937',
  accent_color text DEFAULT '#10B981',
  font_family text DEFAULT 'Inter',
  footer_text text DEFAULT 'Thank you for your business!',
  watermark_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### `ai_usage_logs`
```sql
CREATE TABLE public.ai_usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action text NOT NULL,
  tokens_used int,
  model_used text NOT NULL,
  cost numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
```

## API Endpoints

### AI Integration
- **POST** `/api/ai` - AI text generation endpoint
  - Supports `description_generation` and `reminder_draft` actions
  - Uses Hugging Face Inference API with Mistral-7B-Instruct model

## Environment Variables

Add these to your `.env.local`:

```bash
# AI Integration (Hugging Face)
HUGGINGFACE_API_KEY=your_huggingface_api_key

# Optional: OpenAI (for future use)
# OPENAI_API_KEY=your_openai_api_key
```

## Setup Instructions

### 1. Database Migration
Run the new migration in your Supabase dashboard:
```sql
-- File: supabase/migrations/003_invoice_templates.sql
```

### 2. Supabase Storage Bucket
Create a storage bucket for logo uploads:
```sql
-- In Supabase dashboard or SQL editor
INSERT INTO storage.buckets (id, name, public) 
VALUES ('invoice-assets', 'invoice-assets', true);
```

### 3. Hugging Face API Key
1. Sign up at [Hugging Face](https://huggingface.co/)
2. Go to Settings → Access Tokens
3. Create a new token with read permissions
4. Add to your `.env.local` file

## Usage

### Invoice Template Customization
1. Navigate to **Settings → Invoice Templates** or **Templates** in the sidebar
2. Choose a template preset or customize colors manually
3. Upload your company logo
4. Customize fonts and footer text
5. Save your preferences

### AI Helper Buttons
1. **AI Suggest Description**: Click on any line item description field
2. **AI Draft Reminder**: Use for overdue invoice reminders

## Components Added

- `InvoiceTemplateCustomizer` - Main template customization interface
- `AIHelperButtons` - AI assistance buttons for invoice creation
- Updated `InvoiceForm` with AI integration
- New settings page for template management

## Future Enhancements

- PDF generation with custom templates
- More AI models (OpenAI, Claude, etc.)
- Template sharing and marketplace
- Advanced branding options
- Email template customization

## Technical Notes

- Uses Hugging Face Inference API for cost-effective AI generation
- Template preferences stored per user in Supabase
- Logo uploads handled through Supabase Storage
- AI usage logged for monitoring and analytics
- Modular design allows easy swapping of AI providers

## Troubleshooting

### AI Not Working
1. Check `HUGGINGFACE_API_KEY` in environment variables
2. Verify Hugging Face API key has proper permissions
3. Check browser console for error messages

### Template Not Saving
1. Ensure user is authenticated
2. Check Supabase RLS policies
3. Verify database migration was applied

### Logo Upload Issues
1. Check Supabase Storage bucket exists
2. Verify storage policies allow uploads
3. Check file size and format restrictions

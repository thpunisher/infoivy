# Setup Guide - Invoify

This guide will help you set up Invoify locally with all required services.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git

## Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd invofyv1
npm install
```

## Step 2: Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_PRICE_ID_PRO=price_your_pro_plan_price_id

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 3: Supabase Setup

### 3.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Note down your project URL and API keys

### 3.2 Run Database Migration

1. Go to your Supabase dashboard → SQL Editor
2. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
3. Execute the migration

### 3.3 Configure Authentication

1. Go to Authentication → Settings
2. Enable Email/Password authentication
3. Configure Google OAuth (optional):
   - Go to Authentication → Providers → Google
   - Enable Google provider
   - Add your Google OAuth credentials
4. Set up redirect URLs:
   - Add `http://localhost:3000/auth/callback`

## Step 4: Stripe Setup

### 4.1 Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Switch to test mode

### 4.2 Create Product and Price

1. Go to Products → Add Product
2. Create a product named "Pro Plan" with:
   - Price: $5.00 USD
   - Billing: Monthly
3. Copy the Price ID (starts with `price_`)

### 4.3 Configure Webhooks (for local development)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run the webhook listener:
   ```bash
   npm run stripe:webhook
   ```
3. This will forward webhooks to your local development server

## Step 5: Update Environment Variables

Replace the placeholder values in your `.env.local` file with the actual values from Supabase and Stripe.

## Step 6: Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Step 7: Test the Application

1. **Test Registration**: Create a new account
2. **Test Invoice Creation**: Create your first invoice
3. **Test PDF Download**: Download the generated PDF
4. **Test Stripe Integration**: Try upgrading to Pro (use test card: 4242 4242 4242 4242)

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify your Supabase URL and keys
   - Check if the migration ran successfully
   - Ensure RLS policies are in place

2. **Authentication Issues**
   - Check Supabase redirect URLs
   - Verify Google OAuth configuration
   - Check browser console for errors

3. **Stripe Webhook Issues**
   - Ensure Stripe CLI is running
   - Check webhook endpoint URL
   - Verify webhook signing secret

4. **PDF Generation Issues**
   - Check server logs for errors
   - Verify file permissions
   - Test with smaller PDFs first

### Debug Commands

```bash
# Check TypeScript errors
npm run type-check

# Check build
npm run build

# View logs
npm run dev
```

## Next Steps

Once local development is working:

1. Deploy to Vercel (see DEPLOYMENT.md)
2. Set up production environment variables
3. Configure production webhooks
4. Test the full application flow

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the error logs in your terminal
3. Check Supabase and Stripe documentation
4. Create an issue in the repository

---

Your Invoify application should now be running locally! 🎉

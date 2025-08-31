# Deployment Guide - Invoify

This guide will walk you through deploying Invoify to Vercel with Supabase and Stripe integration.

## Prerequisites

- GitHub account
- Vercel account
- Supabase account
- Stripe account

## Step 1: Prepare Your Repository

1. Push your code to a GitHub repository
2. Ensure all environment variables are documented in `.env.local`

## Step 2: Supabase Setup

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and API keys

### 2.2 Run Database Migration

1. Go to your Supabase dashboard → SQL Editor
2. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
3. Execute the migration

### 2.3 Configure Authentication

1. Go to Authentication → Settings
2. Enable Email/Password authentication
3. Configure Google OAuth (optional):
   - Go to Authentication → Providers → Google
   - Enable Google provider
   - Add your Google OAuth credentials
4. Set up redirect URLs:
   - Add `https://your-domain.vercel.app/auth/callback`
   - Add `http://localhost:3000/auth/callback` for development

## Step 3: Stripe Setup

### 3.1 Create Stripe Product

1. Go to [stripe.com](https://stripe.com) and create an account
2. Go to Products → Add Product
3. Create a product named "Pro Plan" with:
   - Price: $5.00 USD
   - Billing: Monthly
4. Copy the Price ID (starts with `price_`)

### 3.2 Configure Webhooks

1. Go to Developers → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the webhook signing secret

## Step 4: Deploy to Vercel

### 4.1 Connect Repository

1. Go to [vercel.com](https://vercel.com) and create an account
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 4.2 Environment Variables

Add the following environment variables in Vercel:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_PRICE_ID_PRO=your_stripe_price_id_pro

# App
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 4.3 Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at `https://your-domain.vercel.app`

## Step 5: Post-Deployment Setup

### 5.1 Update Supabase Redirect URLs

1. Go to your Supabase dashboard → Authentication → Settings
2. Update the redirect URLs to include your production domain
3. Remove localhost URLs if not needed for development

### 5.2 Test the Application

1. Visit your deployed application
2. Test user registration and login
3. Test invoice creation
4. Test PDF download
5. Test Stripe checkout (use test card: 4242 4242 4242 4242)

### 5.3 Monitor Logs

1. Check Vercel function logs for any errors
2. Monitor Supabase logs for authentication issues
3. Check Stripe webhook delivery in the Stripe dashboard

## Step 6: Custom Domain (Optional)

1. Go to your Vercel project settings
2. Add your custom domain
3. Update DNS records as instructed
4. Update environment variables with the new domain
5. Update Supabase redirect URLs

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Check Supabase redirect URLs
   - Verify environment variables
   - Check Supabase logs

2. **Stripe Webhook Failures**
   - Verify webhook endpoint URL
   - Check webhook signing secret
   - Monitor Stripe webhook logs

3. **PDF Generation Issues**
   - Check server function logs
   - Verify file permissions
   - Test with smaller PDFs first

4. **Database Connection Issues**
   - Verify Supabase connection string
   - Check RLS policies
   - Test database queries

### Debug Commands

```bash
# Check build logs
vercel logs

# Check function logs
vercel logs --function api/stripe/webhook

# Test local build
npm run build

# Type check
npm run type-check
```

## Security Considerations

1. **Environment Variables**: Never commit sensitive keys to version control
2. **RLS Policies**: Ensure all database tables have proper RLS enabled
3. **API Routes**: Validate all input data in API routes
4. **CORS**: Configure CORS properly for production
5. **Rate Limiting**: Consider adding rate limiting for API routes

## Performance Optimization

1. **Image Optimization**: Use Next.js Image component for optimized images
2. **Caching**: Implement proper caching strategies
3. **Database Indexes**: Ensure proper database indexes are in place
4. **CDN**: Vercel provides global CDN by default

## Monitoring

1. **Vercel Analytics**: Enable Vercel Analytics for performance monitoring
2. **Error Tracking**: Consider adding error tracking (Sentry, etc.)
3. **Uptime Monitoring**: Set up uptime monitoring for your application
4. **Database Monitoring**: Monitor Supabase performance and usage

## Support

If you encounter issues during deployment:

1. Check the troubleshooting section above
2. Review Vercel, Supabase, and Stripe documentation
3. Check GitHub issues for similar problems
4. Contact support if needed

---

Your Invoify application should now be successfully deployed and ready for production use!

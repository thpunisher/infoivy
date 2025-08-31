# Invoify - Professional Invoice Management SaaS

A production-grade SaaS application for generating, managing, and exporting invoices as PDFs. Built with Next.js 15, TypeScript, Supabase, and Stripe.

## Features

### 🚀 Core Features
- **Professional Invoice Creation** - Create beautiful invoices with line items, tax calculations, and totals
- **PDF Export** - Download invoices as professional PDFs
- **Multi-tenant Architecture** - Secure data isolation with Row Level Security
- **Usage Tracking** - Monitor invoice creation limits for free plan users

### 💳 Subscription Plans
- **Free Plan**: 10 invoices per month, watermarked PDFs, basic features
- **Pro Plan ($5/month)**: Unlimited invoices, no watermarks, full customization

### 🔐 Authentication & Security
- Email/password authentication
- Google OAuth integration
- Row Level Security (RLS) enforced
- Secure API endpoints

### 💰 Payment Processing
- Stripe Checkout for subscriptions
- Stripe Customer Portal for billing management
- Webhook handling for subscription updates

### 🎨 Modern UI/UX
- Clean, professional design with shadcn/ui
- Responsive layout for all devices
- Dark/light theme support
- Intuitive navigation and forms

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide React icons
- **Backend**: Next.js Server Actions, Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe (Checkout, Customer Portal, Webhooks)
- **PDF Generation**: pdf-lib
- **Forms**: React Hook Form with Zod validation
- **State Management**: Server Actions + Zustand (client state)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account

### 1. Clone the Repository

```bash
git clone <repository-url>
cd invofyv1
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

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
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Supabase Setup

1. Create a new Supabase project
2. Run the database migration:

```sql
-- Copy and run the contents of supabase/migrations/001_initial_schema.sql
-- in your Supabase SQL editor
```

3. Configure Authentication:
   - Enable Email/Password authentication
   - Enable Google OAuth (configure Google OAuth credentials)
   - Set up redirect URLs for your domain

### 5. Stripe Setup

1. Create a Stripe account
2. Create a product for the Pro plan ($5/month)
3. Get the price ID and add it to your environment variables
4. Configure webhook endpoints:
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── app/               # Protected application pages
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions and configurations
└── middleware.ts         # Authentication middleware
```

## Key Components

### Authentication
- **Middleware**: Protects routes and handles authentication
- **Auth Actions**: Server actions for sign in, sign up, and sign out
- **OAuth**: Google OAuth integration with Supabase

### Invoice Management
- **Invoice Form**: Dynamic form with line items and calculations
- **PDF Generation**: Server-side PDF generation with watermarks for free plan
- **Usage Tracking**: Monthly invoice creation limits

### Billing
- **Stripe Integration**: Checkout sessions and customer portal
- **Webhook Handling**: Subscription status synchronization
- **Plan Management**: Free/Pro plan features and limits

## Database Schema

### Tables
- `profiles`: User profile information
- `subscriptions`: Stripe subscription data
- `invoices`: Invoice records with line items
- `usage_counters`: Monthly usage tracking

### Row Level Security
All tables have RLS enabled with policies ensuring users can only access their own data.

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to update `NEXT_PUBLIC_APP_URL` to your production domain.

## API Routes

- `POST /api/stripe/webhook`: Stripe webhook handler
- `GET /api/pdf/[id]`: PDF generation endpoint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@invoify.com or create an issue in the repository.

---

Built with ❤️ using Next.js, Supabase, and Stripe

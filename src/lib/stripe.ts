import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
}

export const STRIPE_PLANS = {
  FREE: 'free',
  PRO: 'pro',
} as const

export type StripePlan = typeof STRIPE_PLANS[keyof typeof STRIPE_PLANS]

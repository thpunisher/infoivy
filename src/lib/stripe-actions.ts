'use server'

import { stripe } from '@/lib/stripe'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function createCheckoutSession() {
  const user = await getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const supabase = await createServerSupabaseClient()

  // Check if user already has a Pro subscription
  const { data: existingSubscription } = await supabase
    .from('subscriptions')
    .select('plan, stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  if (existingSubscription?.plan === 'pro') {
    throw new Error('You already have a Pro subscription')
  }

  let customerId = existingSubscription?.stripe_customer_id

  if (!customerId) {
    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: user.email!,
      metadata: {
        supabase_user_id: user.id,
      },
    })

    customerId = customer.id

    // Save customer ID to database
    await supabase
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        stripe_customer_id: customerId,
        plan: 'free',
        status: 'active',
      })
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID_PRO,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/billing?canceled=true`,
    metadata: {
      user_id: user.id,
    },
  })

  redirect(session.url!)
}

export async function createCustomerPortalSession() {
  const user = await getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const supabase = await createServerSupabaseClient()

  let { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  if (!subscription?.stripe_customer_id) {
    // Ensure a subscriptions row exists
    if (!subscription) {
      await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          plan: 'free',
          status: 'active',
        })
    }

    // Create Stripe customer and persist id
    const customer = await stripe.customers.create({
      email: user.email!,
      metadata: { supabase_user_id: user.id },
    })

    const { data: updated } = await supabase
      .from('subscriptions')
      .update({ stripe_customer_id: customer.id })
      .eq('user_id', user.id)
      .select('stripe_customer_id')
      .single()

    subscription = updated
  }

  if (!subscription?.stripe_customer_id) {
    throw new Error('No Stripe customer ID found')
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/billing`,
    })

    redirect(session.url)
  } catch (error) {
    console.error('Stripe customer portal error:', error)
    // Allow Next.js redirect to propagate without wrapping
    if ((error as any)?.digest?.startsWith?.('NEXT_REDIRECT')) {
      throw error
    }
    // Provide actionable hint for portal not configured
    throw new Error(
      'Failed to create customer portal session. Ensure Stripe Customer Portal is configured in test mode.'
    )
  }
}

export async function getSubscription() {
  const user = await getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const supabase = await createServerSupabaseClient()
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return subscription
}

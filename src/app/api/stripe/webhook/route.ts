import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createAdminSupabaseClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  const supabase = await createAdminSupabaseClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any
      const userId = session.metadata.user_id

      // Update subscription to pro
      await supabase
        .from('subscriptions')
        .update({
          plan: 'pro',
          stripe_subscription_id: session.subscription,
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)

      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as any
      const customerId = subscription.customer

      // Find user by customer ID
      const { data: userSubscription } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (userSubscription) {
        const status = subscription.status
        const plan = status === 'active' ? 'pro' : 'free'

        await supabase
          .from('subscriptions')
          .update({
            plan,
            status,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userSubscription.user_id)
      }

      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as any
      const customerId = subscription.customer

      // Find user by customer ID
      const { data: userSubscription } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (userSubscription) {
        // Downgrade to free plan
        await supabase
          .from('subscriptions')
          .update({
            plan: 'free',
            status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userSubscription.user_id)
      }

      break
    }
  }

  return NextResponse.json({ received: true })
}

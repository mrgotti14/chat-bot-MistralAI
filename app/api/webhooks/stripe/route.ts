import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import dbConnect from '@/lib/mongoose';

/**
 * Initialize Stripe with the secret key
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * Webhook handler for Stripe events
 * Processes various subscription and payment events to update user status and record transactions
 * 
 * @param {Request} req - The incoming webhook request from Stripe
 * @returns {Promise<NextResponse>} JSON response indicating success or failure
 */
export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    await dbConnect();

    switch (event.type) {
      /**
       * Handles subscription creation and updates
       * Updates user subscription status and creates a transaction record
       */
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Retrieve price details and tier information
        const priceId = subscription.items.data[0].price.id;
        const price = await stripe.prices.retrieve(priceId);
        const subscriptionTier = price.metadata.tier || 'pro';

        const user = await User.findOneAndUpdate(
          { stripeCustomerId: customerId },
          {
            subscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
            subscriptionEnd: new Date(subscription.current_period_end * 1000),
            subscriptionTier: subscriptionTier,
          },
          { new: true }
        );

        if (user) {
          await Transaction.create({
            userId: user._id,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscription.id,
            amount: subscription.items.data[0].price.unit_amount || 0,
            currency: subscription.items.data[0].price.currency,
            status: subscription.status === 'active' ? 'succeeded' : 'pending',
            type: event.type === 'customer.subscription.created' ? 'subscription_created' : 'subscription_updated',
            metadata: {
              tier: subscriptionTier,
              priceId: priceId
            }
          });
        }
        break;

      /**
       * Handles subscription deletion
       * Updates user subscription status to canceled and records the cancellation
       */
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        const deletedCustomerId = deletedSubscription.customer as string;

        const deletedUser = await User.findOneAndUpdate(
          { stripeCustomerId: deletedCustomerId },
          {
            subscriptionStatus: 'canceled',
            subscriptionEnd: new Date(deletedSubscription.current_period_end * 1000),
            subscriptionTier: 'free',
          },
          { new: true }
        );

        if (deletedUser) {
          await Transaction.create({
            userId: deletedUser._id,
            stripeCustomerId: deletedCustomerId,
            stripeSubscriptionId: deletedSubscription.id,
            amount: deletedSubscription.items.data[0].price.unit_amount || 0,
            currency: deletedSubscription.items.data[0].price.currency,
            status: 'succeeded',
            type: 'subscription_deleted',
            metadata: {
              cancelAt: deletedSubscription.cancel_at ? new Date(deletedSubscription.cancel_at * 1000) : null,
              cancelReason: deletedSubscription.cancellation_details?.reason || null
            }
          });
        }
        break;

      /**
       * Handles trial end notifications
       * TODO: Implement trial end notification logic
       */
      case 'customer.subscription.trial_will_end':
        // TODO: Implement trial end notification logic
        break;

      /**
       * Handles failed payment events
       * Updates user subscription status to past_due and records the failed payment
       */
      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        const failedCustomerId = failedInvoice.customer as string;

        const failedUser = await User.findOneAndUpdate(
          { stripeCustomerId: failedCustomerId },
          {
            subscriptionStatus: 'past_due',
          },
          { new: true }
        );

        if (failedUser) {
          await Transaction.create({
            userId: failedUser._id,
            stripeCustomerId: failedCustomerId,
            stripeInvoiceId: failedInvoice.id,
            stripePaymentIntentId: failedInvoice.payment_intent as string,
            amount: failedInvoice.amount_due,
            currency: failedInvoice.currency,
            status: 'failed',
            type: 'payment_failed',
            metadata: {
              attemptCount: failedInvoice.attempt_count,
              nextPaymentAttempt: failedInvoice.next_payment_attempt ? new Date(failedInvoice.next_payment_attempt * 1000) : null
            }
          });
        }
        break;

      /**
       * Handles successful checkout session completion
       * Records the successful payment transaction for subscriptions
       */
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === 'subscription') {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          const sessionUser = await User.findOne({ stripeCustomerId: session.customer });

          if (sessionUser) {
            await Transaction.create({
              userId: sessionUser._id,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: subscription.id,
              stripePaymentIntentId: session.payment_intent as string,
              amount: session.amount_total || 0,
              currency: session.currency || 'usd',
              status: 'succeeded',
              type: 'payment_succeeded',
              metadata: {
                paymentStatus: session.payment_status,
                customerEmail: session.customer_details?.email
              }
            });
          }
        }
        break;

      /**
       * Handles successful payment intent completion
       * Records the successful payment transaction
       */
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const paymentUser = await User.findOne({ stripeCustomerId: paymentIntent.customer });

        if (paymentUser) {
          await Transaction.create({
            userId: paymentUser._id,
            stripeCustomerId: paymentIntent.customer as string,
            stripePaymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: 'succeeded',
            type: 'payment_succeeded',
            metadata: {
              paymentMethod: paymentIntent.payment_method_types[0],
              description: paymentIntent.description
            }
          });
        }
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 
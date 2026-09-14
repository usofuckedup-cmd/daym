import Stripe from 'stripe'

let stripeClient: Stripe | null = null

/**
 * Lazily creates the Stripe client on first use (at request time), instead of at
 * module load time. This lets the app build successfully even before
 * STRIPE_SECRET_KEY is configured as an environment variable — Next.js evaluates
 * route modules during the build's "collecting page data" step, and constructing
 * Stripe with an empty key at that point would crash the build.
 */
export function getStripe(): Stripe {
  if (!stripeClient) {
    const apiKey = process.env.STRIPE_SECRET_KEY
    if (!apiKey) {
      throw new Error(
        'STRIPE_SECRET_KEY is not set. Add it in your environment variables (see .env.example).',
      )
    }
    stripeClient = new Stripe(apiKey, { apiVersion: '2024-12-18.acacia' })
  }
  return stripeClient
}

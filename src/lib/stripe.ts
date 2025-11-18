import { loadStripe } from '@stripe/stripe-js';

// Inicializa o Stripe com a chave pública
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

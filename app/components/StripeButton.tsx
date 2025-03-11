'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeButtonProps {
  priceId: string;
  children: React.ReactNode;
  className?: string;
}

export default function StripeButton({ priceId, children, className = '' }: StripeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handlePayment = async () => {
    try {
      // Check if the user is connected
      if (status !== 'authenticated') {
        // Redirect to the login page with a return to the pricing page
        router.push(`/auth/login?callbackUrl=${encodeURIComponent('/pricing')}`);
        return;
      }

      setLoading(true);
      setError(null);

      if (!priceId) {
        throw new Error('Price ID not defined');
      }

      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error('Stripe public key not configured');
      }
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création de la session');
      }

      const { sessionId } = await response.json();
      
      if (!sessionId) {
        throw new Error('Session ID not received');
      }

      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Stripe could not be initialized');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (error) {
      console.error('Error during payment:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Chargement...' : children}
      </button>
      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error}
        </p>
      )}
    </div>
  );
} 
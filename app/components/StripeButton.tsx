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
      // Vérifier si l'utilisateur est connecté
      if (status !== 'authenticated') {
        // Rediriger vers la page de connexion avec un retour à la page de tarification
        router.push(`/auth/login?callbackUrl=${encodeURIComponent('/pricing')}`);
        return;
      }

      setLoading(true);
      setError(null);

      if (!priceId) {
        throw new Error('ID du prix non défini');
      }

      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error('Clé publique Stripe non configurée');
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
        throw new Error('Session ID non reçu');
      }

      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Stripe n\'a pas pu être initialisé');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
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
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      // Ici, vous pouvez ajouter une vérification de la session avec votre backend
      setStatus('success');
    } else {
      setStatus('error');
    }
  }, [searchParams]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#1C1D1F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-[#1C1D1F] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Une erreur est survenue</h1>
          <p className="text-gray-400 mb-8">Impossible de valider votre paiement.</p>
          <Link 
            href="/pricing"
            className="text-[#A435F0] hover:text-[#8710E0] transition-colors"
          >
            Retour aux tarifs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1D1F] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 bg-[#A435F0] rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-4">
          Paiement réussi !
        </h1>
        <p className="text-gray-400 mb-8">
          Merci pour votre abonnement. Vous pouvez maintenant accéder à toutes les fonctionnalités premium.
        </p>
        <Link 
          href="/chat"
          className="inline-block px-8 py-3 bg-[#A435F0] text-white rounded-lg hover:bg-[#8710E0] transition-colors"
        >
          Commencer à utiliser GottiAI
        </Link>
      </motion.div>
    </div>
  );
} 
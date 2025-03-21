'use client';

import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import StripeButton from '../components/StripeButton';
import { useRef, useState } from 'react';

// Composant MagneticButton
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ children, className = '' }) => {
  const magneticRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const deltaX = x - centerX;
    const deltaY = y - centerY;
    
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    const maxDistance = Math.sqrt((rect.width / 2) ** 2 + (rect.height / 2) ** 2);
    
    const strength = 15;
    const normalizedX = (deltaX / maxDistance) * strength;
    const normalizedY = (deltaY / maxDistance) * strength;
    
    target.style.transform = `translate(${normalizedX}px, ${normalizedY}px)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget: target } = e;
    target.style.transform = 'translate(0, 0)';
  };

  return (
    <motion.div
      ref={magneticRef}
      className={`magnetic-trigger ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.div>
  );
};

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <main className="min-h-screen bg-[#1C1D1F] overflow-hidden">
      <Navbar />
      
      {/* Hero Section avec titre */}
      <section className="pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Choisissez votre plan
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Des solutions adaptées à tous vos besoins, de l'utilisation personnelle aux projets d'entreprise
          </p>
          
          {/* Billing Switcher */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-lg ${!isYearly ? 'text-white' : 'text-gray-400'}`}>Mensuel</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-16 h-8 rounded-full bg-[#2D2F31] transition-colors"
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-[#A435F0] transition-transform ${
                  isYearly ? 'translate-x-8' : ''
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-lg ${isYearly ? 'text-white' : 'text-gray-400'}`}>Annuel</span>
              <span className="text-sm text-[#A435F0] font-semibold">-20%</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                plan: "Découverte",
                price: "0€",
                period: "pour toujours",
                priceId: null,
                features: [
                  "20 messages par jour",
                  "Accès au modèle Mistral de base",
                  "Réponses jusqu'à 12 000 caractères (~3000 tokens)",
                  "Une seule conversation active",
                  "Interface standard",
                  "✕ Export des conversations",
                  "✕ Personnalisation de l'IA",
                  "✕ Conversations multiples",
                  "✕ Accès API",
                  "✕ Support prioritaire"
                ]
              },
              {
                plan: "Pro",
                monthlyPrice: "9.99€",
                yearlyPrice: "7.99€",
                monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
                yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID,
                popular: true,
                features: [
                  "150 messages par jour",
                  "Paramètres optimisés",
                  "Réponses jusqu'à 40 000 caractères (~10 000 tokens)",
                  "5 conversations parallèles",
                  "Personnalisation du ton de l'IA",
                  "Export PDF/TXT",
                  "Bibliothèque de prompts",
                  "Clé API (limite mensuelle)",
                  "✕ Conversations illimitées",
                  "✕ Support prioritaire"
                ]
              },
              {
                plan: "Entreprise",
                monthlyPrice: "29.99€",
                yearlyPrice: "24.99€",
                monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID,
                yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PRICE_ID,
                features: [
                  "Messages illimités",
                  "Réponses jusqu'à 100 000 caractères (~25 000 tokens)",
                  "Conversations illimitées",
                  "Personnalisation complète",
                  "Export avancé (PDF, HTML, JSON)",
                  "Prompts spécialisés par domaine",
                  "Mode collaboratif",
                  "Tableau de bord d'analyse",
                  "API premium illimitée",
                  "Support prioritaire"
                ]
              }
            ].map((pricing, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-[#2D2F31] p-8 rounded-lg relative hover-trigger flex flex-col ${
                  pricing.popular ? 'border-2 border-[#A435F0]' : ''
                }`}
              >
                {pricing.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#A435F0] text-white text-sm font-semibold px-4 py-1 rounded-full">
                      Le Plus Populaire
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-4">{pricing.plan}</h3>
                <div className="flex flex-col mb-1">
                  <div className="flex items-end gap-1">
                    <p className="text-4xl font-bold text-[#A435F0]">
                      {pricing.monthlyPrice ? (isYearly ? pricing.yearlyPrice : pricing.monthlyPrice) : pricing.price}
                    </p>
                    <p className="text-gray-400 mb-1">
                      {pricing.monthlyPrice ? (isYearly ? '/mois (facturé annuellement)' : '/mois') : 'pour toujours'}
                    </p>
                  </div>
                  {isYearly && pricing.monthlyPrice && (
                    <p className="text-sm text-[#A435F0]">Économisez 20% avec l'abonnement annuel</p>
                  )}
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {pricing.features.map((feature, i) => (
                    <li key={i} className="text-gray-300 flex items-center">
                      <span className={`mr-2 ${feature.startsWith('✕') ? 'text-gray-500' : 'text-[#A435F0]'}`}>
                        {feature.startsWith('✕') ? '✕' : '✓'}
                      </span>
                      {feature.startsWith('✕') ? feature.slice(2) : feature}
                    </li>
                  ))}
                </ul>
                <MagneticButton className="w-full mt-auto">
                  {(pricing.monthlyPriceId || pricing.yearlyPriceId) ? (
                    <StripeButton
                      priceId={isYearly ? pricing.yearlyPriceId! : pricing.monthlyPriceId!}
                      className={`w-full px-6 py-3 rounded hover:bg-[#8710E0] transition-colors hover-trigger ${
                        pricing.popular ? 'bg-[#A435F0] text-white' : 'bg-transparent border border-[#A435F0] text-white hover:bg-[#A435F0]/10'
                      }`}
                    >
                      S'abonner
                    </StripeButton>
                  ) : (
                    <button
                      className={`w-full px-6 py-3 rounded hover:bg-[#8710E0] transition-colors hover-trigger ${
                        pricing.popular ? 'bg-[#A435F0] text-white' : 'bg-transparent border border-[#A435F0] text-white hover:bg-[#A435F0]/10'
                      }`}
                    >
                      Commencer
                    </button>
                  )}
                </MagneticButton>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#1C1D1F]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Vous avez des questions ?</h2>
          <MagneticButton>
            <a 
              href="mailto:support@gottiai.com" 
              className="text-[#A435F0] hover:text-[#8710E0] transition-colors text-lg"
            >
              Contactez notre équipe
            </a>
          </MagneticButton>
        </div>
      </section>
    </main>
  );
} 
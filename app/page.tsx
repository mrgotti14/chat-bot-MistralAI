'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Navbar from './components/Navbar';
import StripeButton from './components/StripeButton';

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

export default function Home() {
  const { status } = useSession();
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isYearly, setIsYearly] = useState(true);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#343541] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#1C1D1F] overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 overflow-hidden">
        {/* Background Effects */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }} 
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 overflow-hidden"
        >
          <motion.div 
            animate={{ 
              x: [-20, 20, -20],
              y: [-20, 20, -20]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#A435F0] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          />
          <motion.div 
            animate={{ 
              x: [20, -20, 20],
              y: [20, -20, 20]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/3 -right-1/4 w-96 h-96 bg-[#8710E0] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          />
          <motion.div 
            animate={{ 
              x: [-30, 30, -30],
              y: [30, -30, 30]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-1/4 left-1/3 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          />
        </motion.div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-8 opacity-20" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="space-y-4 sm:space-y-6 md:space-y-8"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight relative">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className="relative inline-block"
              >
                <span className="inline-block text-white">DÉCOUVREZ LA PUISSANCE DE </span>
                <motion.span 
                  className="inline-block bg-gradient-to-r from-[#A435F0] to-[#8710E0] text-transparent bg-clip-text"
                  animate={{ 
                    backgroundPosition: ['0%', '100%', '0%'],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: '200% 100%'
                  }}
                >
                  GOTTI AI
                </motion.span>
              </motion.div>
              <br />
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className="relative inline-block"
              >
                <span className="inline-block text-white">POUR VOS </span>
                <motion.span 
                  className="inline-block bg-gradient-to-r from-[#A435F0] to-[#8710E0] text-transparent bg-clip-text"
                  animate={{ 
                    backgroundPosition: ['0%', '100%', '0%'],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: '200% 100%'
                  }}
                >
                  CONVERSATIONS
                </motion.span>
              </motion.div>
            </h1>

            <motion.p 
              className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                delay: 0.4,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              Votre assistant IA{' '}
              <motion.span 
                className="text-[#A435F0]"
                animate={{ 
                  opacity: [1, 0.8, 1],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                personnel
              </motion.span>{' '}
              et{' '}
              <motion.span 
                className="text-[#A435F0]"
                animate={{ 
                  opacity: [1, 0.8, 1],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 2,
                  delay: 0.3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                puissant
              </motion.span>{' '}
              propulsé par{' '}
              <motion.span 
                className="text-[#A435F0]"
                animate={{ 
                  opacity: [1, 0.8, 1],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 2,
                  delay: 0.6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Mistral
              </motion.span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                delay: 0.6,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
            >
              <MagneticButton className="w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 w-full overflow-hidden hover-trigger"
                  onClick={() => router.push('/auth/register')}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#A435F0] to-[#8710E0] rounded-lg"></div>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-[#A435F0] to-[#8710E0] rounded-lg opacity-60"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  ></motion.div>
                  <div className="relative flex items-center justify-center text-white font-semibold">
                    Essayer Gratuitement
                    <motion.svg 
                      className="w-5 h-5 ml-2"
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      animate={{
                        x: [0, 4, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </motion.svg>
                  </div>
                </motion.button>
              </MagneticButton>

              <MagneticButton className="w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 w-full overflow-hidden hover-trigger"
                  onClick={() => status === 'authenticated' ? router.push('/chat') : router.push('/auth/login')}
                >
                  <motion.div 
                    className="absolute inset-0 border border-[#A435F0] rounded-lg"
                    animate={{
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  ></motion.div>
                  <div className="relative text-white font-semibold group-hover:text-[#A435F0] transition-colors flex items-center justify-center">
                    {status === 'authenticated' ? 'Accéder au Chat' : 'Voir la Démo'}
                    <motion.svg 
                      className="w-5 h-5 ml-2"
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      animate={{
                        x: [0, 4, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </motion.svg>
                  </div>
                </motion.button>
              </MagneticButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                delay: 0.8,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="flex items-center justify-center gap-8 pt-12"
            >
              {[
                { number: '10x', text: 'Plus Rapide' },
                { number: '100%', text: 'Personnalisable' },
                { number: '24/7', text: 'Disponible' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.div 
                    className="text-2xl font-bold text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 1 }}
                  >
                    {stat.number}
                  </motion.div>
                  <motion.div 
                    className="text-sm text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 1.2 }}
                  >
                    {stat.text}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div 
            className="w-6 h-10 border-2 border-white/20 rounded-full p-1"
            animate={{
              boxShadow: ['0 0 0 0 rgba(255,255,255,0.1)', '0 0 0 10px rgba(255,255,255,0)', '0 0 0 0 rgba(255,255,255,0)']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div 
              className="w-1.5 h-3 bg-white/60 rounded-full"
              animate={{
                y: [0, 15, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#A435F0] rounded-full mix-blend-multiply filter blur-[128px] opacity-10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
              Pourquoi Choisir GottiAI ?
            </h2>
            <p className="text-gray-400 text-lg">
              Une expérience IA personnalisée et puissante pour tous vos besoins
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "IA Ultra-Rapide",
                description: "Propulsé par Mistral, obtenez des réponses instantanées et pertinentes à toutes vos questions",
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )
              },
              {
                title: "Interface Élégante",
                description: "Un design moderne et intuitif avec support Markdown et coloration syntaxique du code",
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6H20C21.1046 6 22 6.89543 22 8V16C22 17.1046 21.1046 18 20 18H4C2.89543 18 2 17.1046 2 16V8C2 6.89543 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )
              },
              {
                title: "Sauvegarde Automatique",
                description: "Vos conversations sont automatiquement sauvegardées et accessibles à tout moment",
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )
              },
              {
                title: "Connexion Simplifiée",
                description: "Connectez-vous facilement avec votre email, Google ou GitHub en un clic",
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
              {
                title: "Multi-Plateforme",
                description: "Utilisez GottiAI sur tous vos appareils avec une expérience optimale",
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )
              },
              {
                title: "Productivité Maximale",
                description: "Raccourcis clavier, formatage avancé et personnalisation complète",
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-[#2D2F31] p-8 rounded-2xl hover:bg-[#3E4143] transition-all duration-300 hover-trigger"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#A435F0]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-[#A435F0]/10 rounded-xl flex items-center justify-center text-[#A435F0] mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#A435F0] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-8">Des Plans Adaptés à Vos Besoins</h2>
            
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
          </div>

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
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-[#1C1D1F]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
              Questions Fréquentes
            </h2>
            <p className="text-gray-400 text-lg">
              Tout ce que vous devez savoir sur GottiAI
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {[
              {
                question: "Qu'est-ce qui rend GottiAI unique ?",
                answer: "GottiAI se distingue par sa rapidité exceptionnelle, son interface élégante et son intégration native avec Mistral AI. Notre plateforme offre une expérience utilisateur optimisée avec support Markdown, sauvegarde automatique et personnalisation avancée."
              },
              {
                question: "Comment fonctionne la tarification ?",
                answer: "Nous proposons trois plans flexibles : Découverte (gratuit), Premium (9.99€/mois) et Business (sur mesure). Le plan gratuit vous permet de tester toutes les fonctionnalités de base avec 50 messages par jour, tandis que le plan Premium débloque un usage illimité et des fonctionnalités avancées."
              },
              {
                question: "Mes données sont-elles sécurisées ?",
                answer: "La sécurité est notre priorité absolue. En tant qu'entreprise française, nous respectons strictement le RGPD (Règlement Général sur la Protection des Données). Toutes les conversations sont chiffrées de bout en bout, et nous utilisons des protocoles de sécurité avancés. Vous gardez le contrôle total de vos données : droit d'accès, de modification et de suppression à tout moment. Nous n'utilisons jamais vos données à des fins commerciales et ne les partageons avec aucun tiers."
              },
              {
                question: "Puis-je utiliser GottiAI sur mobile ?",
                answer: "Absolument ! GottiAI est entièrement responsive et fonctionne parfaitement sur tous les appareils : ordinateurs, tablettes et smartphones. L'interface s'adapte automatiquement pour une expérience optimale."
              },
              {
                question: "Quels sont les moyens de connexion disponibles ?",
                answer: "Vous pouvez vous connecter via email/mot de passe, Google ou GitHub. Notre système de liaison de comptes permet de basculer facilement entre différentes méthodes d'authentification tout en conservant vos données."
              },
              {
                question: "Comment fonctionne le support client ?",
                answer: "Le support varie selon votre plan. Les utilisateurs gratuits ont accès au support basique, les utilisateurs Premium bénéficient d'un support prioritaire, et les clients Business profitent d'un support 24/7 dédié."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="mb-4"
              >
                <motion.div
                  className="bg-[#2D2F31] p-6 rounded-lg hover:bg-[#3E4143] transition-all duration-300 cursor-pointer hover-trigger group"
                  initial={false}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-white group-hover:text-[#A435F0] transition-colors">
                      {faq.question}
                    </h3>
                    <motion.div
                      className="w-6 h-6 flex items-center justify-center text-[#A435F0]"
                      animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </motion.div>
                  </div>
                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedFaq === index ? "auto" : 0,
                      opacity: expandedFaq === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-gray-400 mt-4">
                      {faq.answer}
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2D2F31] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">GottiAI</h3>
              <p className="text-gray-400">Votre compagnon IA intelligent au quotidien</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Carrières</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 GottiAI. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

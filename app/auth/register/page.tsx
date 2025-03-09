'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const backgroundVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.8
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.5,
      ease: "easeOut"
    }
  }
};

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      router.push('/auth/login');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const handleGitHubSignIn = () => {
    signIn('github', { callbackUrl: '/' });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#1C1D1F] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <motion.div 
          className="absolute inset-0"
          variants={backgroundVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#A435F0] rounded-full mix-blend-multiply filter blur-[128px] opacity-10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-[#1C1D1F] bg-[radial-gradient(#A435F0_1px,transparent_1px)] [background-size:32px_32px] opacity-5"></div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md w-full space-y-8 relative z-10"
        >
          <motion.div variants={itemVariants}>
            <motion.h2 
              className="mt-6 text-center text-4xl font-extrabold text-white"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: "200% auto",
                backgroundImage: "linear-gradient(90deg, #fff, #A435F0, #fff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Rejoignez GottiAI
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="mt-2 text-center text-sm text-gray-400"
            >
              Ou{' '}
              <Link href="/auth/login" className="font-medium text-[#A435F0] hover:text-[#8710E0] transition-colors">
                connectez-vous à votre compte
              </Link>
            </motion.p>
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#1C1D1F] text-gray-400">Inscrivez-vous avec</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignIn}
              className="group relative w-full flex justify-center items-center gap-3 py-3 px-4 text-sm font-medium rounded-lg text-white bg-[#2D2F31] hover:bg-[#3E4143] transition-all duration-300 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A435F0] focus:ring-offset-2 focus:ring-offset-[#1C1D1F] overflow-hidden"
            >
              <div className="absolute inset-0 w-0 bg-gradient-to-r from-[#A435F0] to-[#8710E0] transition-all duration-300 opacity-0 group-hover:w-full group-hover:opacity-10"></div>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuer avec Google
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGitHubSignIn}
              className="group relative w-full flex justify-center items-center gap-3 py-3 px-4 text-sm font-medium rounded-lg text-white bg-[#2D2F31] hover:bg-[#3E4143] transition-all duration-300 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A435F0] focus:ring-offset-2 focus:ring-offset-[#1C1D1F] overflow-hidden"
            >
              <div className="absolute inset-0 w-0 bg-gradient-to-r from-[#A435F0] to-[#8710E0] transition-all duration-300 opacity-0 group-hover:w-full group-hover:opacity-10"></div>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              Continuer avec GitHub
            </motion.button>
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#1C1D1F] text-gray-400">Ou avec votre email</span>
            </div>
          </motion.div>

          <motion.form 
            variants={itemVariants}
            className="mt-8 space-y-6" 
            onSubmit={handleSubmit}
          >
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg relative"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </motion.div>
            )}
            <div className="space-y-4">
              <motion.div 
                variants={itemVariants}
                className="group relative"
              >
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="peer appearance-none relative block w-full px-4 py-3 border border-gray-700 placeholder-transparent text-white bg-[#2D2F31] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A435F0] focus:border-[#A435F0] transition-all duration-300 sm:text-sm"
                  placeholder="Nom"
                />
                <label 
                  htmlFor="name"
                  className="absolute left-4 -top-6 text-sm text-gray-400 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-[#A435F0]"
                >
                  Nom
                </label>
              </motion.div>
              <motion.div 
                variants={itemVariants}
                className="group relative"
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="peer appearance-none relative block w-full px-4 py-3 border border-gray-700 placeholder-transparent text-white bg-[#2D2F31] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A435F0] focus:border-[#A435F0] transition-all duration-300 sm:text-sm"
                  placeholder="Adresse email"
                />
                <label 
                  htmlFor="email"
                  className="absolute left-4 -top-6 text-sm text-gray-400 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-[#A435F0]"
                >
                  Adresse email
                </label>
              </motion.div>
              <motion.div 
                variants={itemVariants}
                className="group relative"
              >
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="peer appearance-none relative block w-full px-4 py-3 border border-gray-700 placeholder-transparent text-white bg-[#2D2F31] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A435F0] focus:border-[#A435F0] transition-all duration-300 sm:text-sm"
                  placeholder="Mot de passe"
                />
                <label 
                  htmlFor="password"
                  className="absolute left-4 -top-6 text-sm text-gray-400 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-[#A435F0]"
                >
                  Mot de passe
                </label>
              </motion.div>
              <motion.div 
                variants={itemVariants}
                className="group relative"
              >
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="peer appearance-none relative block w-full px-4 py-3 border border-gray-700 placeholder-transparent text-white bg-[#2D2F31] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A435F0] focus:border-[#A435F0] transition-all duration-300 sm:text-sm"
                  placeholder="Confirmer le mot de passe"
                />
                <label 
                  htmlFor="confirmPassword"
                  className="absolute left-4 -top-6 text-sm text-gray-400 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-[#A435F0]"
                >
                  Confirmer le mot de passe
                </label>
              </motion.div>
            </div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#A435F0] to-[#8710E0] hover:from-[#8710E0] hover:to-[#A435F0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A435F0] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <span className="absolute right-0 inset-y-0 flex items-center pr-3 transition-transform duration-300 group-hover:translate-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
                {isLoading ? 'Création du compte...' : 'Créer un compte'}
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </>
  );
} 
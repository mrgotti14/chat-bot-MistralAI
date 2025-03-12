'use client';

import { useState } from 'react';
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

/**
 * Props for the AddPassword component
 * @interface AddPasswordProps
 * 
 * @property {() => void} [onSuccess] - Callback function called after successful password creation
 */
interface AddPasswordProps {
  onSuccess?: () => void;
}

/**
 * Form component for setting a new password
 * 
 * @component
 * @param {AddPasswordProps} props - Component props
 * @returns {JSX.Element} Password creation form
 * 
 * Features:
 * - Password matching validation
 * - Minimum length validation (6 characters)
 * - Error handling with visual feedback
 * - Loading state during submission
 * - Secure API call to save password
 * 
 * @example
 * ```tsx
 * <AddPassword onSuccess={() => console.log('Password successfully set')} />
 * ```
 */
export default function AddPassword({ onSuccess }: AddPasswordProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('The passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('The password must contain at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred');
      }

      if (data.success) {
        setPassword('');
        setConfirmPassword('');
        onSuccess?.();
      } else {
        throw new Error(data.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while adding the password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="bg-[#1C1D1F] p-8 rounded-xl relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#A435F0] rounded-full mix-blend-multiply filter blur-[64px] opacity-10"
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
      </div>

      <div className="relative z-10">
        <motion.h2 
          variants={itemVariants}
          className="text-2xl font-bold bg-gradient-to-r from-[#A435F0] to-[#8710E0] bg-clip-text text-transparent mb-4"
        >
          Définir un mot de passe
        </motion.h2>
        
        <motion.p 
          variants={itemVariants}
          className="text-gray-400 mb-8"
        >
          Pour plus de sécurité, veuillez définir un mot de passe pour votre compte.
          Vous pourrez ensuite vous connecter avec votre email et ce mot de passe.
        </motion.p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div 
              variants={itemVariants}
              className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <motion.div 
            variants={itemVariants}
            className="group relative"
          >
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer appearance-none relative block w-full px-4 py-3 border border-gray-700 placeholder-transparent text-white bg-[#2D2F31] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A435F0] focus:border-[#A435F0] transition-all duration-300 sm:text-sm"
              placeholder="Nouveau mot de passe"
              required
              minLength={6}
            />
            <label 
              htmlFor="password"
              className="absolute left-4 -top-6 text-sm text-gray-400 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-[#A435F0]"
            >
              Nouveau mot de passe
            </label>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="group relative"
          >
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="peer appearance-none relative block w-full px-4 py-3 border border-gray-700 placeholder-transparent text-white bg-[#2D2F31] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A435F0] focus:border-[#A435F0] transition-all duration-300 sm:text-sm"
              placeholder="Confirmer le mot de passe"
              required
              minLength={6}
            />
            <label 
              htmlFor="confirmPassword"
              className="absolute left-4 -top-6 text-sm text-gray-400 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-[#A435F0]"
            >
              Confirmer le mot de passe
            </label>
          </motion.div>

          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#A435F0] to-[#8710E0] text-white rounded-lg py-3 px-4 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#A435F0] focus:ring-offset-2 focus:ring-offset-[#1C1D1F] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <motion.div 
                  className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ) : (
              'Définir le mot de passe'
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
} 
import { useState, useEffect } from 'react';

interface UsageLimits {
  tier: string;
  usage: {
    dailyMessageCount: number;
    lastMessageDate: string;
    activeConversations: number;
  };
  limits: {
    dailyMessageLimit: number;
    maxActiveConversations: number;
    remaining: {
      dailyMessages: number;
      activeConversations: number;
    }
  }
}

export function useUsageLimits() {
  const [usageLimits, setUsageLimits] = useState<UsageLimits | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsageLimits = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/user/usage');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des limites d\'utilisation');
      }
      const data = await response.json();
      setUsageLimits(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors de la récupération des limites:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsageLimits();
  }, []);

  return {
    usageLimits,
    isLoading,
    error,
    refresh: fetchUsageLimits
  };
} 
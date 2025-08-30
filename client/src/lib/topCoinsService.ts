import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface CandleMetrics {
  avg_usd_per_min: number;
  last_close: number;
  ret_stdev: number;
  range_pct: number;
}

export interface ScoredCoin {
  product_id: string;
  score: number;
  metrics?: CandleMetrics;
  spread?: number;
}

export interface TopCoinsResponse {
  coins: ScoredCoin[];
  count: number;
  timestamp: string;
}

export interface TopCoinIdsResponse {
  coinIds: string[];
  count: number;
  timestamp: string;
}

// Hook to fetch top coins
export function useTopCoins(limit = 50) {
  return useQuery<TopCoinsResponse>({
    queryKey: ['/api/top-coins', limit],
    queryFn: async () => {
      const response = await fetch(`/api/top-coins?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch top coins');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });
}

// Hook to fetch just the coin IDs
export function useTopCoinIds(limit = 50) {
  return useQuery<TopCoinIdsResponse>({
    queryKey: ['/api/top-coins/ids', limit],
    queryFn: async () => {
      const response = await fetch(`/api/top-coins/ids?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch top coin IDs');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });
}

// Hook to refresh top coins with custom parameters
export function useRefreshTopCoins() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: {
      topN?: number;
      minUsdPerMin?: number;
      maxSpreadPct?: number;
    }) => {
      const response = await fetch('/api/top-coins/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        throw new Error('Failed to refresh top coins');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate all top coins queries
      queryClient.invalidateQueries({ queryKey: ['/api/top-coins'] });
    }
  });
}

// Utility functions matching the Python functionality
export const topCoinsApi = {
  async fetchTopCoins(limit = 50): Promise<TopCoinsResponse> {
    const response = await fetch(`/api/top-coins?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch top coins');
    }
    return response.json();
  },

  async fetchTopCoinIds(limit = 50): Promise<string[]> {
    const response = await fetch(`/api/top-coins/ids?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch top coin IDs');
    }
    const data: TopCoinIdsResponse = await response.json();
    return data.coinIds;
  },

  async refreshTopCoins(config: {
    topN?: number;
    minUsdPerMin?: number;
    maxSpreadPct?: number;
  }): Promise<TopCoinsResponse> {
    const response = await fetch('/api/top-coins/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config)
    });

    if (!response.ok) {
      throw new Error('Failed to refresh top coins');
    }

    return response.json();
  }
};

// Helper to get top performing coins for the scanner
export async function getTopPerformingCoinsForScanner(limit = 50): Promise<string[]> {
  try {
    const coinIds = await topCoinsApi.fetchTopCoinIds(limit);
    console.log(`🎯 Fetched ${coinIds.length} top performing coins for scanner`);
    return coinIds;
  } catch (error) {
    console.error('Error fetching top coins, falling back to default list:', error);
    // Return a subset of the default coin list as fallback
    const { CRYPTO_PAIRS } = await import('./coinList');
    return CRYPTO_PAIRS.slice(0, limit);
  }
}
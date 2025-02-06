"use client";

import { useState, useEffect } from "react";
import {
  getTransactionStats,
  getEnergyMetrics,
  checkDatabaseConnection,
  getWeeklyNetworkActivity,
  getTotalCarbonOffset,
} from "@/lib/db/actions";

// Define the metrics type
type Metrics = {
  contractCalls: {
    value: number;
    trend: number;
  };
  gasUsage: {
    value: number;
    trend: number;
  };
  carbonImpact: {
    value: number;
    trend: number;
  };
};

// Default metrics state
const defaultMetrics: Metrics = {
  contractCalls: {
    value: 0,
    trend: 0,
  },
  gasUsage: {
    value: 0,
    trend: 0,
  },
  carbonImpact: {
    value: 0,
    trend: 0,
  },
};

export function useMetrics() {
  const [metrics, setMetrics] = useState<Metrics>(defaultMetrics);
  const [networkActivity, setNetworkActivity] = useState<any[]>([]);
  const [totalOffset, setTotalOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setIsLoading(true);
        setError(null);

        const [stats, weeklyActivity, carbonOffset] = await Promise.all([
          getTransactionStats(),
          getWeeklyNetworkActivity(),
          getTotalCarbonOffset(),
        ]);

        if (stats) {
          setMetrics({
            contractCalls: {
              value: stats.totalTransactions,
              trend: 0,
            },
            gasUsage: {
              value: Math.round(stats.avgGasPrice * 100) / 100,
              trend: 0,
            },
            carbonImpact: {
              value: Number(stats.totalEnergyImpact) * 0.4 || 0,
              trend: 0,
            },
          });
          setNetworkActivity(weeklyActivity);
          setTotalOffset(carbonOffset);
        }
      } catch (error) {
        console.error("Error in useMetrics:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
        setMetrics(defaultMetrics);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  return { metrics, networkActivity, totalOffset, isLoading, error };
}

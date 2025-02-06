import { useState, useEffect, useRef, useCallback } from "react";
import { MonitoringService } from "@/lib/monitoring-service";

export type Transaction = {
  hash: string;
  from: string;
  to: string;
  gasUsed: bigint;
  gasPrice: bigint;
  blockNumber: number;
  timestamp: number;
  energyImpact: number;
  optimization?: {
    suggestion: string;
    potentialSavings: number;
  };
};

export function useTransactionMonitor() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const monitorRef = useRef<MonitoringService | null>(null);

  useEffect(() => {
    monitorRef.current = new MonitoringService();

    const handleNewTransaction = async (txData: Transaction) => {
      const optimization = await monitorRef.current!.getOptimizationSuggestion(
        txData.gasUsed
      );

      setTransactions((prev) => {
        const newTx = { ...txData, optimization };
        // Only keep transactions from the last 5 minutes
        const recentTxs = prev.filter(
          (tx) => Date.now() / 1000 - tx.timestamp < 300
        );
        const updated = [newTx, ...recentTxs].sort(
          (a, b) => b.timestamp - a.timestamp
        );
        return updated.slice(0, 20);
      });
    };

    if (!isMonitoring) {
      monitorRef.current.startMonitoring(handleNewTransaction);
      setIsMonitoring(true);
    }

    return () => {
      monitorRef.current?.stopMonitoring();
    };
  }, []);

  const refreshTransactions = useCallback(async () => {
    if (monitorRef.current) {
      await monitorRef.current.fetchRecentTransactions(
        (txData: Transaction) => {
          setTransactions((prev) => {
            const recentTxs = prev.filter(
              (tx) => Date.now() / 1000 - tx.timestamp < 300
            );
            const updated = [txData, ...recentTxs].sort(
              (a, b) => b.timestamp - a.timestamp
            );
            return updated.slice(0, 20);
          });
        }
      );
    }
  }, []);

  return {
    transactions,
    isMonitoring,
    refreshTransactions,
  };
}

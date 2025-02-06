"use client";

import { useState, useEffect } from "react";

interface Transaction {
  id: string;
  hash: string;
  type: "contract" | "transfer" | "mint" | "swap";
  gasUsed: number;
  timestamp: number;
  value: number;
  energyImpact: "high" | "medium" | "low";
  optimized: boolean;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const generateTransaction = (): Transaction => ({
      id: Math.random().toString(36).slice(2),
      hash: "0x" + Math.random().toString(36).slice(2),
      type: ["contract", "transfer", "mint", "swap"][
        Math.floor(Math.random() * 4)
      ] as Transaction["type"],
      gasUsed: Math.floor(Math.random() * 200000),
      timestamp: Date.now(),
      value: Math.random() * 10,
      energyImpact: ["high", "medium", "low"][
        Math.floor(Math.random() * 3)
      ] as Transaction["energyImpact"],
      optimized: Math.random() > 0.5,
    });

    const interval = setInterval(() => {
      setTransactions((prev) => [generateTransaction(), ...prev].slice(0, 10));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return { transactions };
}

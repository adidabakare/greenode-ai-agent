"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Simulated blockchain data types
type BlockchainMetrics = {
  gasUsed: number;
  transactionsPerMin: number;
  contractCalls: number;
  networkEfficiency: number;
  l2Status: boolean;
  greenEnergyPercent: number;
};

type Transaction = {
  hash: string;
  gasUsed: number;
  timestamp: number;
  isOptimized: boolean;
};

type BlockchainTransaction = {
  id: string;
  hash: string;
  type: "contract" | "transfer" | "mint" | "swap";
  gasUsed: number;
  timestamp: number;
  value: number;
  energyImpact: "high" | "medium" | "low";
  optimized: boolean;
};

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [metrics, setMetrics] = useState<BlockchainMetrics>({
    gasUsed: 65,
    transactionsPerMin: 32,
    contractCalls: 78,
    networkEfficiency: 83,
    l2Status: true,
    greenEnergyPercent: 47,
  });
  const [recentTransactions, setRecentTransactions] = useState<
    BlockchainTransaction[]
  >([]);

  // Simulate real-time updates
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics((prev) => ({
        ...prev,
        gasUsed: prev.gasUsed + (Math.random() * 2 - 1),
        transactionsPerMin: prev.transactionsPerMin + (Math.random() * 4 - 2),
        contractCalls: prev.contractCalls + (Math.random() * 3 - 1.5),
        networkEfficiency: Math.min(
          100,
          Math.max(0, prev.networkEfficiency + (Math.random() * 2 - 1))
        ),
        greenEnergyPercent: Math.min(
          100,
          Math.max(0, prev.greenEnergyPercent + (Math.random() * 4 - 2))
        ),
      }));
    };

    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Time update logic...
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Simulated recommendations based on current metrics
  const getRecommendations = () => {
    const recs = [];
    if (metrics.gasUsed > 60) {
      recs.push({
        type: "optimization",
        title: "High Gas Usage Detected",
        description: "Consider batching transactions to reduce gas costs",
      });
    }
    if (metrics.greenEnergyPercent < 50) {
      recs.push({
        type: "energy",
        title: "Green Energy Opportunity",
        description: "Schedule heavy computations during peak solar hours",
      });
    }
    return recs;
  };

  // Add this effect for simulating real-time transactions
  useEffect(() => {
    const generateTransaction = (): BlockchainTransaction => {
      const types: BlockchainTransaction["type"][] = [
        "contract",
        "transfer",
        "mint",
        "swap",
      ];
      const impacts: BlockchainTransaction["energyImpact"][] = [
        "high",
        "medium",
        "low",
      ];

      return {
        id: Math.random().toString(36).substring(7),
        hash: "0x" + Math.random().toString(36).substring(2, 15),
        type: types[Math.floor(Math.random() * types.length)],
        gasUsed: Math.floor(Math.random() * 200000),
        timestamp: Date.now(),
        value: Math.random() * 10,
        energyImpact: impacts[Math.floor(Math.random() * impacts.length)],
        optimized: Math.random() > 0.5,
      };
    };

    const addTransaction = () => {
      setRecentTransactions((prev) => {
        const newTx = generateTransaction();
        const updated = [newTx, ...prev].slice(0, 10); // Keep last 10 transactions
        return updated;
      });
    };

    // Generate a new transaction every 3-7 seconds
    const interval = setInterval(() => {
      addTransaction();
    }, Math.random() * 4000 + 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 space-y-6 bg-gradient-to-b from-background to-background/80">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            DeFAI Overview
          </h1>
          <p className="text-muted-foreground">
            AI-Powered Energy Optimization for Blockchain
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold tracking-tight">{currentTime}</div>
          <div className="text-sm text-muted-foreground">Network Time</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Energy Consumption Card */}
        <Card className="group relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <CardTitle className="text-xl font-semibold">
              Blockchain Energy Metrics
            </CardTitle>
            <Button variant="secondary" size="sm">
              Optimize
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <ConsumptionMetric
                title="Gas Usage"
                value={`${metrics.gasUsed.toFixed(1)}`}
                unit="gwei"
                trend={metrics.gasUsed > 63 ? "up" : "down"}
                color="green"
              />
              <ConsumptionMetric
                title="TX Rate"
                value={`${metrics.transactionsPerMin.toFixed(0)}`}
                unit="tx/min"
                trend={metrics.transactionsPerMin > 30 ? "up" : "down"}
                color="blue"
              />
              <ConsumptionMetric
                title="Contracts"
                value={`${metrics.contractCalls.toFixed(0)}`}
                unit="calls"
                trend={metrics.contractCalls > 75 ? "up" : "down"}
                color="purple"
              />
            </div>
          </CardContent>
        </Card>

        {/* Network Status Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold">
                L2 Network Status
              </CardTitle>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-muted-foreground">
                  Optimized Mode Active
                </span>
              </div>
            </div>
            <Switch checked={metrics.l2Status} />
          </CardHeader>
          <CardContent>
            <NetworkVisualization />
            <div className="flex justify-between items-center mt-6">
              <span className="text-sm text-muted-foreground">
                Network Efficiency
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">
                  {metrics.networkEfficiency.toFixed(1)}%
                </span>
                <span className="text-sm text-green-500">↑ 2.4%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <CardTitle className="text-xl font-semibold">AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getRecommendations().map((rec, i) => (
                <div key={i} className="bg-accent/50 rounded-xl p-4">
                  <div className="text-sm text-muted-foreground">
                    {rec.type}
                  </div>
                  <p className="font-medium mt-1">{rec.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {rec.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Row */}
        <Card className="col-span-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <CardTitle className="text-xl font-semibold">
              Live Transactions
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">Live</span>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="group relative overflow-hidden rounded-lg bg-accent/50 p-4 transition-all hover:bg-accent/70"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">
                            {tx.hash.substring(0, 10)}...
                          </span>
                          <Badge
                            variant={
                              tx.type === "contract"
                                ? "purple"
                                : tx.type === "transfer"
                                ? "blue"
                                : tx.type === "mint"
                                ? "pink"
                                : "orange"
                            }
                          >
                            {tx.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Gas: {tx.gasUsed.toLocaleString()} • Value:{" "}
                          {tx.value.toFixed(4)} ETH
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge
                          variant={
                            tx.energyImpact === "high"
                              ? "destructive"
                              : tx.energyImpact === "medium"
                              ? "yellow"
                              : "green"
                          }
                        >
                          {tx.energyImpact} impact
                        </Badge>
                        {tx.optimized && (
                          <Badge variant="green">AI optimized</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <CardTitle className="text-xl font-semibold">
              Gas Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Predicted base fee
            </div>
            <div className="text-4xl font-bold mt-4">5.7</div>
            <div className="text-sm text-muted-foreground mt-1">gwei</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <CardTitle className="text-xl font-semibold">
              Energy Report
            </CardTitle>
            <Select defaultValue="week">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <WeeklyEnergyReport />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <CardTitle className="text-xl font-semibold">
              Green Energy Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mt-4">
              {metrics.greenEnergyPercent.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Renewable Energy
            </div>
            <div className="mt-6">
              <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.greenEnergyPercent}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ConsumptionMetric({
  title,
  value,
  unit,
  trend,
  color,
}: {
  title: string;
  value: string;
  unit: string;
  trend: "up" | "down";
  color: "green" | "blue" | "purple";
}) {
  const colors = {
    green: "from-green-500/20 to-green-500/5",
    blue: "from-blue-500/20 to-blue-500/5",
    purple: "from-purple-500/20 to-purple-500/5",
  };

  return (
    <div className="relative overflow-hidden rounded-lg bg-card p-4 shadow-sm">
      <div
        className={`absolute inset-0 bg-gradient-to-b ${colors[color]} opacity-30`}
      />
      <div className="relative space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            {title}
          </span>
          <span
            className={`text-sm ${
              trend === "up" ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend === "up" ? "↑" : "↓"}
          </span>
        </div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="text-xs text-muted-foreground uppercase tracking-wide">
          {unit}
        </div>
      </div>
    </div>
  );
}

function NetworkVisualization() {
  return (
    <div className="relative w-full h-full rounded-lg bg-gradient-to-b from-green-500/5 to-transparent border border-green-500/20 overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/5" />
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-32 h-32 rounded-full border-2 border-green-500/30 flex items-center justify-center animate-pulse">
          <div className="w-24 h-24 rounded-full border-2 border-green-500/20 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <span className="text-xl font-bold text-green-500">L2</span>
            </div>
          </div>
        </div>
      </div>
      {/* Animated connection lines */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-green-500/0 via-green-500/30 to-green-500/0"
            style={{
              width: "100%",
              transform: `rotate(${i * 45}deg)`,
              animation: `pulse 2s ${i * 0.25}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function WeeklyEnergyReport() {
  const weeklyData = [
    { day: "Mon", value: 276, trend: "up", type: "High TX Volume" },
    { day: "Tue", value: 282, trend: "up", type: "Contract Deploy" },
    { day: "Wed", value: 297, trend: "up", type: "NFT Mint" },
    { day: "Thu", value: 269, trend: "down", type: "Normal" },
    { day: "Fri", value: 274, trend: "up", type: "DeFi Swaps" },
    { day: "Sat", value: 175, trend: "down", type: "Low Activity" },
    { day: "Sun", value: 138, trend: "down", type: "Optimized" },
  ];

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Transaction Energy Impact
      </div>
      <div className="grid grid-cols-7 gap-2">
        {weeklyData.map((day) => (
          <div key={day.day} className="text-center">
            <div className="text-sm mb-1">
              {day.day} {day.trend === "up" ? "↑" : "↓"}
            </div>
            <div className="text-sm font-medium">{day.value}</div>
            <div className="text-xs text-muted-foreground">{day.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EnhancedSwitch() {
  return (
    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500/90 shadow-inner transition-colors hover:bg-green-500">
      <div className="absolute right-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out" />
      <span className="absolute left-1 text-[10px] font-medium text-white">
        ON
      </span>
    </button>
  );
}

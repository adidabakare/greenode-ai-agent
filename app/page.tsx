"use client";

import {
  MoreVertical,
  ChevronUp,
  ChevronDown,
  Activity,
  Box,
  Network,
  Zap,
  Bot,
  Coins,
  Trophy,
  Sparkles,
  Hexagon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TransactionsTabBase } from "@/components/transactions-tab";
import { useEffect, useState } from "react";
import { formatEther } from "ethers";
import { MonitoringService } from "@/lib/monitoring-service";
import { useMetrics } from "@/hooks/use-metrics";
import { LoadingScreen } from "@/components/loading-screen";
import { LoadingDots } from "@/components/loading-dots";

// Add this type for better type safety
type MetricPanelProps = {
  title: string;
  value: string | number | React.ReactNode;
  unit: string;
  trend: {
    direction: "up" | "down";
    percentage: number;
  };
  data: number[];
};

// First, update the TokenRewardsPanel to be horizontal
function TokenRewardsPanel() {
  const [tokenInfo, setTokenInfo] = useState({
    totalSupply: "0",
    symbol: "GREEN",
  });

  useEffect(() => {
    async function fetchTokenInfo() {
      try {
        const monitorService = new MonitoringService();
        const info = await monitorService.getTokenInfo();
        setTokenInfo(info);
      } catch (error) {
        console.error("Error fetching token info:", error);
      }
    }

    fetchTokenInfo();
    const interval = setInterval(fetchTokenInfo, 30000);
    return () => clearInterval(interval);
  }, []);

  // Convert total supply to millions
  const totalSupplyInM =
    (Number(tokenInfo.totalSupply) / 1_000_000).toFixed(1) + "M";

  return (
    <div className="bg-gray-900/50 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Title Section */}
          <div className="flex items-center gap-4">
            <Coins className="w-8 h-8 text-green-400" />
            <div>
              <h2 className="text-xl font-light">Energy Rewards</h2>
              <p className="text-xs text-gray-400 mt-1">
                {tokenInfo.symbol} tokens earned for efficiency
              </p>
            </div>
          </div>

          {/* Total Supply */}
          <div className="flex items-center gap-6 border-l border-gray-800/50 pl-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-400/5 rounded-lg">
                <Sparkles className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-light">{totalSupplyInM}</div>
                <div className="text-xs text-gray-400">Total Supply</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reward Info */}
        <div className="flex items-center gap-2 bg-green-400/5 px-4 py-2 rounded-lg">
          <Zap className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-400">
            Earn 100 {tokenInfo.symbol} per efficient transaction
          </span>
        </div>
      </div>
    </div>
  );
}

export default function EnergyDashboard() {
  const { metrics, networkActivity, totalOffset, isLoading, error } =
    useMetrics();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Show loading screen for at least 2 seconds
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl text-red-400">Error Loading Data</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Enhanced Header with better spacing */}
      <nav className="border-b border-gray-800/50">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Hexagon className="w-8 h-8 text-green-400" />
                  <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-400 animate-ping" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-lg bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                    Base Greenode AI
                  </span>
                  <span className="text-xs text-gray-400">
                    Autonomous Blockchain Optimizer
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 px-3 py-1.5 bg-green-400/5 rounded-md border border-green-400/20">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm text-green-400">
                    AI Agent Active
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="font-mono bg-black/30 rounded-md"
                >
                  <Activity className="w-3.5 h-3.5 mr-2 text-green-400" />
                  {isLoading ? (
                    <LoadingDots />
                  ) : (
                    `${metrics.contractCalls.value.toLocaleString()} Contracts Calls`
                  )}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-8 py-10">
        {/* Enhanced Page Header */}
        <div className="flex justify-between items-start mb-12">
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-light tracking-wide">
                DeFAI Energy Optimization
              </h1>
              <p className="text-gray-400">
                AI-powered energy optimization and monitoring for blockchain
                transactions
              </p>
            </div>
            <div className="flex items-center gap-6"></div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-light tracking-tight">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="text-sm text-gray-400 mt-1">Local Time</div>
          </div>
        </div>

        {/* Add TokenRewardsPanel before the grid */}
        <TokenRewardsPanel />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Energy Impact Analysis */}
          <div className="col-span-1 md:col-span-2 bg-gray-900/50 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-light">Energy Impact</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Real-time optimization metrics
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 rounded-full"
              >
                Change metrics
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <MetricPanel
                title="Contract Calls"
                value={
                  isLoading ? (
                    <LoadingDots />
                  ) : (
                    metrics.contractCalls.value.toLocaleString()
                  )
                }
                unit="contracts/day"
                trend={{
                  direction: metrics.contractCalls.trend > 0 ? "up" : "down",
                  percentage: Math.abs(Math.round(metrics.contractCalls.trend)),
                }}
                data={[]}
              />
              <MetricPanel
                title="Gas Usage"
                value={
                  isLoading ? (
                    <LoadingDots />
                  ) : (
                    Math.round(metrics.gasUsage.value)
                  )
                }
                unit="Gwei average"
                trend={{
                  direction: metrics.gasUsage.trend > 0 ? "up" : "down",
                  percentage: Math.abs(Math.round(metrics.gasUsage.trend)),
                }}
                data={[]}
              />
              <MetricPanel
                title="Carbon Impact"
                value={
                  isLoading ? (
                    <LoadingDots />
                  ) : (
                    metrics.carbonImpact.value.toFixed(1)
                  )
                }
                unit="tonnes CO₂"
                trend={{
                  direction: metrics.carbonImpact.trend > 0 ? "up" : "down",
                  percentage: Math.abs(Math.round(metrics.carbonImpact.trend)),
                }}
                data={[]}
              />
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-gray-900/50 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-light">AI Insights</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Smart contract optimization
                </p>
              </div>
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-4">
              <RecommendationCard
                title="L2 Migration Opportunity"
                description="Reduce gas costs by 85%"
                priority="High priority"
              />
              <RecommendationCard
                title="Batch Processing"
                description="Optimize multiple transactions"
                priority="Analysis complete"
              />
            </div>
          </div>

          {/* Updated Carbon Credits */}
          <CarbonCreditsPanel
            carbonImpact={metrics.carbonImpact.value}
            totalOffset={totalOffset}
          />

          {/* Updated Network Activity */}
          <NetworkActivity
            metrics={metrics}
            networkActivity={networkActivity}
            isLoading={isLoading}
          />

          {/* Remove the old TokenRewardsPanel placement */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <TransactionsTab />
          </div>
        </div>
      </main>
    </div>
  );
}

function MetricPanel({ title, value, unit, trend, data }: MetricPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm">
          {title}{" "}
          {trend.direction === "up" ? (
            <ChevronUp className="inline w-4 h-4 text-green-400" />
          ) : (
            <ChevronDown className="inline w-4 h-4 text-red-400" />
          )}
          <span className="text-xs ml-2 text-gray-400">
            {trend.percentage}%
          </span>
        </span>
        <MoreVertical className="w-4 h-4 text-gray-400" />
      </div>
      <div>
        <div className="text-4xl font-light tracking-tight mb-1">{value}</div>
        <div className="text-xs text-gray-400">{unit}</div>
      </div>
      <div className="h-24 flex items-end space-x-1">
        {data.map((value, i) => (
          <div key={i} className="flex flex-col gap-px flex-1">
            <div
              className="w-full bg-white/10 rounded-sm"
              style={{ height: `${value}%` }}
            />
            <div
              className="w-full bg-white rounded-sm"
              style={{ height: `${value * 0.8}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function RecommendationCard({ title, description, priority }) {
  return (
    <div className="bg-[#e8efe8] rounded-lg p-4 text-black">
      <div className="font-medium mb-1">{title}</div>
      <div className="text-sm text-gray-600">{description}</div>
      <div className="text-xs text-gray-500 mt-2">{priority}</div>
    </div>
  );
}

// Add this component for the transactions tab
function TransactionsTab() {
  return <TransactionsTabBase />;
}

// First, let's create a helper function to calculate carbon credits prediction
function calculateCarbonPrediction(currentImpact: number): number {
  // Assuming we can offset about 40% more than current impact through optimizations
  return currentImpact * 1.4;
}

// Update the Carbon Credits component
function CarbonCreditsPanel({
  carbonImpact,
  totalOffset,
}: {
  carbonImpact: number;
  totalOffset: number;
}) {
  const prediction = calculateCarbonPrediction(totalOffset);

  return (
    <div className="bg-[#e8efe8] text-black rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl">Carbon Credits</h2>
          <p className="text-xs text-gray-600 mt-1">Via KlimaDAO</p>
        </div>
        <MoreVertical className="w-4 h-4" />
      </div>
      <div className="text-sm text-gray-600 mb-4">Total offset prediction</div>
      <div className="text-6xl font-light tracking-tight mb-2">
        {prediction.toFixed(1)}
      </div>
      <div className="text-sm text-gray-600">tonnes CO₂</div>
      <div className="mt-4 text-xs text-gray-500">
        Current total offset: {totalOffset.toFixed(1)} tonnes
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Daily impact: {carbonImpact.toFixed(1)} tonnes
      </div>
    </div>
  );
}

// Update the Network Activity component
function NetworkActivity({
  metrics,
  networkActivity,
  isLoading,
}: {
  metrics: any;
  networkActivity: any[];
  isLoading: boolean;
}) {
  return (
    <div className="col-span-1 md:col-span-2 bg-gray-900/50 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-light">Network Activity</h2>
          <p className="text-xs text-gray-400 mt-1">
            Transaction volume and gas prices
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-8 rounded-full"
        >
          Week
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-4">
        {networkActivity.map((day) => (
          <DayMetrics key={day.day} data={day} isLoading={isLoading} />
        ))}
      </div>
    </div>
  );
}

// Update DayMetrics component
function DayMetrics({
  data,
  isLoading,
}: {
  data: {
    day: string;
    value: number;
    gasPrice: number;
    energyImpact: string;
    isToday: boolean;
  };
  isLoading: boolean;
}) {
  return (
    <div className="text-center">
      <div className="text-xs text-gray-400 mb-2">{data.day}</div>
      <div
        className={cn(
          "h-32 bg-gray-800 rounded relative overflow-hidden",
          data.isToday && "ring-1 ring-green-400"
        )}
      >
        {!isLoading && (
          <div
            className="absolute bottom-0 left-0 right-0 bg-white transition-all duration-500"
            style={{ height: `${Number(data.energyImpact) * 10}%` }}
          />
        )}
      </div>
      <div className="mt-2 text-xs text-gray-400">
        {isLoading ? <LoadingDots /> : `${data.value} txns`}
      </div>
      <div className="text-[10px] text-gray-500">
        {isLoading ? <LoadingDots /> : `${data.energyImpact} kWh`}
      </div>
    </div>
  );
}

import { useTransactionMonitor } from "@/hooks/use-transaction-monitor";
import { formatDistanceToNow } from "date-fns";
import {
  Activity,
  RefreshCw,
  Zap,
  Cpu,
  ArrowRight,
  Boxes,
  Fuel,
  Leaf,
  Gift,
  Bell,
  BellOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { formatEther } from "ethers";
import { MonitoringService } from "@/lib/monitoring-service";
import { AIInsightCard } from "./ai-insight-card";

export function TransactionsTabBase() {
  const { transactions, isMonitoring, refreshTransactions } =
    useTransactionMonitor();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      refreshTransactions().finally(() => {
        setTimeout(() => setIsRefreshing(false), 1000);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [refreshTransactions]);

  const getExplorerUrl = (hash: string) =>
    `https://sepolia.basescan.org/tx/${hash}`;

  console.log(transactions);

  return (
    <div className="bg-gray-900/50 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-light">Live Transactions</h2>
          <p className="text-xs text-gray-400 mt-1">
            Real-time monitoring on Base Network
          </p>
        </div>
        <div className="flex items-center gap-4">
          <RefreshCw
            className={cn(
              "w-4 h-4 text-green-400 transition-transform duration-700",
              isRefreshing && "rotate-180"
            )}
          />
          <Badge
            className={cn(
              "bg-green-400/10 text-green-400",
              !isMonitoring && "bg-gray-400/10 text-gray-400"
            )}
          >
            <Activity className="w-3 h-3 mr-1 animate-pulse" />
            {isMonitoring ? "Live Feed" : "Connecting..."}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {transactions.map((tx) => (
          <div
            key={tx.hash}
            className="group bg-black/40 border border-gray-800/50 rounded-lg hover:bg-black/60 hover:border-green-500/20 transition-all duration-300"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-400/5 rounded-lg">
                    <Cpu className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <a
                        href={getExplorerUrl(tx.hash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm hover:text-green-400 transition-colors"
                      >
                        {tx.hash.slice(0, 12)}...
                      </a>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(tx.timestamp * 1000, {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <a
                      href={getExplorerUrl(tx.hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-green-400 hover:text-green-300 transition-colors flex items-center gap-1 mt-1"
                    >
                      <ArrowRight className="w-3 h-3" />
                      View on Base Explorer
                    </a>
                  </div>
                </div>
                {tx.optimization && (
                  <Badge className="bg-green-400/10 border-green-400/20 text-green-400">
                    <Leaf className="w-3 h-3 mr-1" />
                    {tx.optimization.potentialSavings}% potential savings
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 p-3 bg-black/20 rounded-lg">
                <MetricItem
                  icon={Boxes}
                  label="Gas Used"
                  value={tx.gasUsed.toLocaleString()}
                />
                <MetricItem
                  icon={Fuel}
                  label="Gas Price"
                  value={`${formatGwei(tx.gasPrice)} Gwei`}
                />
                <MetricItem
                  icon={Zap}
                  label="Energy Impact"
                  value={`${tx.energyImpact.toFixed(4)} kWh`}
                />
              </div>

              {tx.optimization && (
                <div className="mt-3 text-sm text-green-400 flex items-center gap-2 bg-green-400/5 px-3 py-2 rounded-md">
                  <Leaf className="w-4 h-4" />
                  {tx.optimization.suggestion}
                </div>
              )}

              {Number(tx.gasUsed) < 50000 && (
                <div className="mt-2 flex items-center gap-2 text-xs text-green-400">
                  <Gift className="w-4 h-4" />
                  <span>
                    Earned 100 GREEN tokens for efficient transaction!
                  </span>
                </div>
              )}
            </div>

            {tx.contractOwner && (
              <div className="px-4 py-2 border-t border-gray-800/50 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <span>Contract Owner:</span>
                  <span className="font-mono">
                    {tx.contractOwner.ens ||
                      tx.contractOwner.address.slice(0, 8)}
                    ...
                  </span>
                </div>
                <NotificationButton tx={tx} />
              </div>
            )}

            <AIInsightCard
              aiInsight={tx.aiInsight}
              optimization={tx.optimization}
              gasUsed={tx.gasUsed.toString()}
              energyImpact={tx.energyImpact}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <a
          href="https://sepolia.basescan.org"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2"
        >
          <Button variant="outline" size="sm" className="text-xs">
            View All Transactions on Base Explorer
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </a>
      </div>
    </div>
  );
}

function MetricItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-1.5 bg-gray-800/50 rounded-md">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <div>
        <div className="text-xs text-gray-400 mb-1">{label}</div>
        <div className="text-sm font-mono text-gray-200">{value}</div>
      </div>
    </div>
  );
}

function NotificationButton({ tx }) {
  if (tx.contractOwner.isRegistered) {
    return (
      <div className="flex items-center gap-1 text-green-400">
        <Bell className="w-3 h-3" />
        <span>Notifications enabled</span>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-xs"
      onClick={() => {
        const monitorService = new MonitoringService();
        monitorService.registerContractForNotifications(
          tx.to,
          "example@email.com"
        );
      }}
    >
      <Bell className="w-3 h-3 mr-1" />
      Enable notifications
    </Button>
  );
}

function formatGwei(wei: bigint): string {
  return (Number(wei) / 1e9).toFixed(2);
}

import { Badge } from "@/components/ui/badge";

const aiOptimizations = [
  {
    title: "Loop Optimization",
    contract: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    savings: "23.4%",
    status: "Ready to apply",
    priority: "High",
  },
  {
    title: "Storage Access Pattern",
    contract: "0x123f681646d4a755815f9cb19e1acc8565a0h3b2",
    savings: "18.2%",
    status: "Analysis complete",
    priority: "Medium",
  },
  {
    title: "Batch Processing",
    contract: "0x892d35Cc6634C0532925a3b844Bc454e4438f7a1",
    savings: "31.5%",
    status: "In progress",
    priority: "High",
  },
];

export function AIOptimizationsFeed() {
  return (
    <div className="bg-gray-900/50 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-light">AI Recommendations</h2>
          <p className="text-xs text-gray-400 mt-1">
            Smart contract optimizations
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {aiOptimizations.map((opt, i) => (
          <OptimizationCard key={i} optimization={opt} />
        ))}
      </div>
    </div>
  );
}

function OptimizationCard({ optimization }) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800/80 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="font-medium text-emerald-400">{optimization.title}</div>
        <Badge
          variant="outline"
          className="text-xs bg-emerald-400/10 text-emerald-400"
        >
          {optimization.savings}
        </Badge>
      </div>
      <div className="text-xs font-mono text-gray-400 mb-2">
        {optimization.contract}
      </div>
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-400">{optimization.status}</span>
        <span className="text-emerald-400">{optimization.priority}</span>
      </div>
    </div>
  );
}

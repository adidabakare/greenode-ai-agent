import { useState, useEffect } from "react";
import {
  Bot,
  ChevronDown,
  ChevronUp,
  Zap,
  Loader2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIInsightCardProps {
  aiInsight: string;
  optimization: {
    suggestion: string;
    potentialSavings: number;
  };
  gasUsed: string;
  energyImpact: number;
}

export function AIInsightCard({
  aiInsight,
  optimization,
  gasUsed,
  energyImpact,
}: AIInsightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const hasAIInsight = aiInsight && aiInsight !== "AI analysis unavailable.";

  // Simulate analysis completion after a delay
  useEffect(() => {
    if (!hasAIInsight) {
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasAIInsight]);

  return (
    <div className="bg-emerald-400/10 rounded-lg p-4 mt-2 relative overflow-hidden">
      {/* Animated background effect */}
      {isAnalyzing && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-emerald-400/0 animate-shimmer" />
      )}

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between relative z-10"
      >
        <div className="flex items-center gap-2">
          {isAnalyzing ? (
            <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
          ) : (
            <Sparkles className="w-4 h-4 text-emerald-400" />
          )}
          <span className="text-sm font-medium text-emerald-400 flex items-center gap-2">
            AI Agent Insights
            {isAnalyzing && (
              <span className="flex items-center gap-1 text-emerald-400/70">
                <Loader2 className="w-3 h-3 animate-spin" />
                Analyzing...
              </span>
            )}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-emerald-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-emerald-400" />
        )}
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-96 mt-4" : "max-h-0"
        )}
      >
        <div className="space-y-4 relative z-10">
          <div className="bg-black/20 p-3 rounded backdrop-blur-sm">
            <div className="text-sm text-emerald-400 mb-2 flex items-center gap-2">
              Optimization Suggestion
              {isAnalyzing && <Loader2 className="w-3 h-3 animate-spin" />}
            </div>
            <p className="text-sm">{optimization.suggestion}</p>
            <div className="mt-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400">
                {optimization.potentialSavings}% potential savings
              </span>
            </div>
          </div>

          <div className="bg-black/20 p-3 rounded backdrop-blur-sm">
            <div className="text-sm text-emerald-400 mb-2">AI Analysis</div>
            {isAnalyzing ? (
              <div className="space-y-2">
                <div className="h-4 bg-emerald-400/10 rounded animate-pulse" />
                <div className="h-4 bg-emerald-400/10 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-emerald-400/10 rounded animate-pulse w-1/2" />
              </div>
            ) : !hasAIInsight ? (
              <div className="text-sm text-gray-400">
                Analysis not available for this transaction.
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap">{aiInsight}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-black/20 p-3 rounded backdrop-blur-sm">
              <div className="text-emerald-400 mb-1">Gas Used</div>
              <div>{Number(gasUsed).toLocaleString()} units</div>
            </div>
            <div className="bg-black/20 p-3 rounded backdrop-blur-sm">
              <div className="text-emerald-400 mb-1">Energy Impact</div>
              <div>{energyImpact.toFixed(4)} kWh</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

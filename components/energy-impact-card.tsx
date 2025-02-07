import { Leaf, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EnergyImpactCard() {
  return (
    <div className="col-span-1 md:col-span-2 bg-gray-900/50 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-light">Energy Impact Analysis</h2>
          <p className="text-xs text-gray-400 mt-1">
            Real-time blockchain energy optimization
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Zap className="w-4 h-4 mr-2" />
            Optimize Now
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <MetricCard
          icon={Leaf}
          title="Energy Efficiency"
          value="94.2%"
          change="+2.3% from last week"
          color="emerald"
        />
        <MetricCard
          icon={Zap}
          title="Gas Optimization"
          value="-18.5%"
          change="Gas savings this month"
          color="purple"
        />
        <MetricCard
          icon={Leaf}
          title="Carbon Offset"
          value="42.8t"
          change="CO₂ offset via KlimaDAO"
          color="blue"
        />
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, title, value, change, color }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm flex items-center gap-2">
          <Icon className={`w-4 h-4 text-${color}-400`} />
          {title}
        </span>
      </div>
      <div className="text-3xl font-light">{value}</div>
      <div className="h-32 flex items-end space-x-1">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`w-full bg-${color}-400/20 rounded-t`}
            style={{ height: `${Math.random() * 100}%` }}
          />
        ))}
      </div>
      <div className="text-xs text-gray-400">{change}</div>
    </div>
  );
}

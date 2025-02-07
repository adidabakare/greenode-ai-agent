import { Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PageHeader() {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-light mb-2">AI Energy Optimization</h1>
        <div className="flex items-center gap-4">
          <Badge className="bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20">
            <Cpu className="w-3 h-3 mr-1" />
            AI Active
          </Badge>
          <span className="text-xs text-gray-400">
            Last optimization: 2 minutes ago
          </span>
        </div>
      </div>
    </div>
  );
}

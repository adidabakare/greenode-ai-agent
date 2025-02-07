import { Activity, Bot, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function NavigationHeader() {
  return (
    <nav className="border-b border-gray-800 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-emerald-400" />
            <span className="font-medium text-lg">DeFAI Optimizer</span>
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-white font-medium">
              Dashboard
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Smart Contracts
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Optimizations
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Carbon Credits
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="font-mono">
            <Activity className="w-3 h-3 mr-2" />
            Block #14,325,691
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Auto-Optimize
          </Button>
        </div>
      </div>
    </nav>
  );
}

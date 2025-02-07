import { Bot } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex  items-center justify-center z-50">
      <div className="relative">
        {/* Glowing background effect */}
        {/* <div className="absolute inset-0 bg-emerald-500/20 blur-2xl  opacity-15 rounded-full scale-150" /> */}

        {/* Content container */}
        <div className="relative bg-black/50 backdrop-blur-md rounded-2xl p-8 border border-emerald-500/20">
          {/* Logo with pulse effect */}
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
            <Bot className="w-16 h-16 text-emerald-400 relative z-10" />
          </div>

          {/* Loading text */}
          <div className="text-center">
            <h2 className="text-lg font-light text-white mb-2">
              Optimizing Network
            </h2>

            {/* Animated dots */}
            <div className="flex items-center justify-center gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400/80"
                  style={{
                    animation: "bounce 1s infinite",
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

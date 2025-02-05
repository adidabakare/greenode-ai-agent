import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-8 max-w-[1400px] mx-auto px-6 h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-xl" />
            <span className="font-semibold text-lg">DeFAI Energy</span>
          </div>
          <div className="flex gap-8 ml-8">
            <a
              href="#"
              className="text-primary font-medium hover:text-primary/80 transition-colors"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              My apartments
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Reporting
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Settings
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto p-6">
        <div className="flex justify-between items-center mb-10 mt-4">
          <div>
            <h1 className="text-3xl font-semibold mb-1">Overview</h1>
            <p className="text-muted-foreground">
              Monitor and optimize your energy consumption
            </p>
          </div>
          <div className="text-right bg-card px-6 py-3 rounded-2xl border border-border/50">
            <div className="text-3xl font-bold tracking-tight">11:37 AM</div>
            <div className="text-sm text-muted-foreground">Local time</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Energy Consumption Card */}
          <div className="dashboard-card col-span-full lg:col-span-2 bg-gradient-to-br from-background to-accent/20">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-semibold mb-1">
                  Total energy consumption
                </h2>
                <p className="text-sm text-muted-foreground">
                  Real-time monitoring of major systems
                </p>
              </div>
              <button className="px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors text-sm font-medium">
                Change module
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="p-4 rounded-xl bg-card border border-border/50">
                <div className="flex items-center gap-2 text-green-500 mb-1">
                  <span className="text-sm font-medium">Lighting</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                </div>
                <div className="text-4xl font-bold tracking-tight mb-1">
                  52-71
                </div>
                <div className="text-sm text-muted-foreground">
                  kWh per month
                </div>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border/50">
                <div className="flex items-center gap-2 text-red-500 mb-1">
                  <span className="text-sm font-medium">Refrigerator</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
                <div className="text-4xl font-bold tracking-tight mb-1">
                  29-37
                </div>
                <div className="text-sm text-muted-foreground">
                  kWh per month
                </div>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border/50">
                <div className="flex items-center gap-2 text-red-500 mb-1">
                  <span className="text-sm font-medium">Air Conditioner</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
                <div className="text-4xl font-bold tracking-tight mb-1">
                  49-85
                </div>
                <div className="text-sm text-muted-foreground">
                  kWh per month
                </div>
              </div>
            </div>
          </div>

          {/* Green Connections Card */}
          <div className="dashboard-card bg-gradient-to-br from-green-500/10 to-green-500/5">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">
                  Green connections
                </h2>
                <p className="text-sm text-muted-foreground">Network status</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Office</span>
                <div className="w-10 h-6 bg-success-green rounded-full relative">
                  <div className="absolute inset-1 bg-white rounded-full left-1"></div>
                </div>
              </div>
            </div>
            <div className="aspect-square bg-card rounded-xl border border-border/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent"></div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm font-medium">Available energy</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-success-green/20 rounded-full">
                  <div className="w-[83%] h-full bg-success-green rounded-full"></div>
                </div>
                <span className="text-xl font-bold">83%</span>
              </div>
            </div>
          </div>

          {/* Bottom Row Cards */}
          <div className="dashboard-card bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
            <h3 className="text-lg font-semibold mb-1">Tracking</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Solar energy tomorrow
            </p>
            <div className="text-5xl font-bold tracking-tight mb-2">5.7</div>
            <div className="text-sm text-muted-foreground">Predicted kWh</div>
          </div>

          <div className="dashboard-card bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-1">Detailed report</h3>
                <p className="text-sm text-muted-foreground">
                  Energy analytics
                </p>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-sm font-medium">
                Week ↓
              </button>
            </div>
            <div className="h-32 flex items-end gap-2">
              {[65, 70, 85, 75, 90, 50, 40].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-blue-500/20 rounded-t-lg"
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
          </div>

          <div className="dashboard-card bg-gradient-to-br from-purple-500/10 to-purple-500/5">
            <h3 className="text-lg font-semibold mb-1">Green energy usage</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Current efficiency
            </p>
            <div className="text-5xl font-bold tracking-tight mb-2">47%</div>
            <div className="text-sm text-muted-foreground">11AM — 3PM</div>
          </div>
        </div>
      </main>
    </div>
  );
}

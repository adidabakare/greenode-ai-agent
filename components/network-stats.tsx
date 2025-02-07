export function NetworkStats() {
  return (
    <div className="bg-gray-900/50 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-light">Network Stats</h2>
          <p className="text-xs text-gray-400 mt-1">
            Current blockchain status
          </p>
        </div>
      </div>
      <div className="space-y-6">
        <StatMetric
          label="Smart Contract Efficiency"
          value="92.4%"
          color="emerald"
        />
        <StatMetric label="L2 Adoption Rate" value="47%" color="purple" />
      </div>
    </div>
  );
}

function StatMetric({ label, value, color }) {
  return (
    <div>
      <div className="text-sm text-gray-400 mb-2">{label}</div>
      <div className="text-3xl font-light mb-2">{value}</div>
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div
          className={`bg-${color}-400 h-2 rounded-full`}
          style={{ width: value }}
        />
      </div>
    </div>
  );
}

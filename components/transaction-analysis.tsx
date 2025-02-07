const transactionData = [
  { day: "Mon", value: 276, efficiency: 92, gasPrice: 45 },
  { day: "Tue", value: 282, efficiency: 94, gasPrice: 42 },
  { day: "Wed", value: 297, efficiency: 89, gasPrice: 48 },
  { day: "Thu", value: 269, efficiency: 95, gasPrice: 39 },
  { day: "Fri", value: 274, efficiency: 91, gasPrice: 41 },
  { day: "Sat", value: 175, efficiency: 96, gasPrice: 35 },
  { day: "Sun", value: 138, efficiency: 97, gasPrice: 32 },
];

export function TransactionAnalysis() {
  return (
    <div className="col-span-1 md:col-span-2 bg-gray-900/50 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-light">Transaction Efficiency</h2>
          <p className="text-xs text-gray-400 mt-1">
            Weekly optimization metrics
          </p>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-4">
        {transactionData.map((day, i) => (
          <DayMetrics key={day.day} data={day} />
        ))}
      </div>
    </div>
  );
}

function DayMetrics({ data }) {
  return (
    <div className="text-center">
      <div className="text-xs text-gray-400 mb-2">{data.day}</div>
      <div className="h-32 bg-gray-800 rounded relative overflow-hidden">
        <div
          className="absolute bottom-0 left-0 right-0 bg-emerald-400/20"
          style={{ height: `${data.efficiency}%` }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 bg-emerald-400"
          style={{ height: `${(data.value / 300) * 100}%` }}
        />
      </div>
      <div className="mt-2 text-xs text-emerald-400">{data.efficiency}%</div>
      <div className="text-[10px] text-gray-400">{data.gasPrice} Gwei</div>
    </div>
  );
}

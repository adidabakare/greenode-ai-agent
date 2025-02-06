import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  integer,
} from "drizzle-orm/pg-core";

// Transactions
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  hash: text("hash").notNull().unique(),
  from: text("from_address").notNull(),
  to: text("to_address").notNull(),
  gasUsed: text("gas_used").notNull(), // Store as string due to BigInt
  gasPrice: text("gas_price").notNull(),
  blockNumber: integer("block_number").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  energyImpact: text("energy_impact").notNull(),
  input: text("input_data"), // Contract interaction data
  isOptimized: boolean("is_optimized").default(false),
  optimizationSuggestion: text("optimization_suggestion"),
  potentialSavings: integer("potential_savings"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Energy Metrics
export const energyMetrics = pgTable("energy_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: timestamp("date").notNull(),
  totalGasUsed: text("total_gas_used").notNull(),
  averageGasPrice: integer("average_gas_price").notNull(),
  totalTransactions: integer("total_transactions").notNull(),
  energyImpact: text("energy_impact").notNull(),
  carbonOffset: text("carbon_offset").notNull(),
  l2Adoption: integer("l2_adoption").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Optimization Recommendations
export const optimizationRecommendations = pgTable(
  "optimization_recommendations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contractAddress: text("contract_address").notNull(),
    recommendation: text("recommendation").notNull(),
    type: text("type").notNull(), // 'L2_MIGRATION', 'BATCH_PROCESSING', etc.
    priority: text("priority").notNull(),
    potentialSavings: integer("potential_savings").notNull(),
    status: text("status").notNull(), // 'PENDING', 'APPLIED', 'REJECTED'
    createdAt: timestamp("created_at").defaultNow(),
    appliedAt: timestamp("applied_at"),
  }
);

// Carbon Credits
export const carbonCredits = pgTable("carbon_credits", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: timestamp("date").notNull(),
  amount: text("amount").notNull(),
  source: text("source").notNull(), // e.g., 'KlimaDAO'
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

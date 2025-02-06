import { db } from "./dbConfig";
import {
  transactions,
  energyMetrics,
  optimizationRecommendations,
  carbonCredits,
} from "./schema";
import { eq, and, gte, desc, sql } from "drizzle-orm";

export async function saveTransaction(txData: {
  hash: string;
  from: string;
  to: string;
  gasUsed: string;
  gasPrice: string;
  blockNumber: number;
  timestamp: Date;
  energyImpact: string;
  input?: string;
}) {
  try {
    console.log("Saving transaction:", txData);
    const result = await db.insert(transactions).values(txData).returning();
    console.log("Transaction saved:", result);
    return result;
  } catch (error) {
    console.error("Error saving transaction:", error);
    throw error;
  }
}

export async function getEnergyMetrics(days: number = 7) {
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);

  return await db
    .select()
    .from(energyMetrics)
    .where(gte(energyMetrics.date, daysAgo))
    .orderBy(desc(energyMetrics.date));
}

export async function updateDailyMetrics(metrics: {
  date: Date;
  totalGasUsed: string;
  averageGasPrice: number;
  totalTransactions: number;
  energyImpact: string;
  carbonOffset: string;
  l2Adoption: number;
}) {
  return await db.insert(energyMetrics).values(metrics).returning();
}

export async function saveOptimizationRecommendation(recommendation: {
  contractAddress: string;
  recommendation: string;
  type: string;
  priority: string;
  potentialSavings: number;
  status: string;
}) {
  return await db
    .insert(optimizationRecommendations)
    .values(recommendation)
    .returning();
}

export async function getOptimizationRecommendations(limit: number = 10) {
  return await db
    .select()
    .from(optimizationRecommendations)
    .orderBy(desc(optimizationRecommendations.createdAt))
    .limit(limit);
}

export async function updateCarbonCredits(credits: {
  date: Date;
  amount: string;
  source: string;
  status: string;
}) {
  return await db.insert(carbonCredits).values(credits).returning();
}

export async function getTransactionStats(days: number = 7) {
  try {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);

    // Get total transactions count with logging
    const totalCount = await db
      .select({
        count: sql`count(*)::integer`,
      })
      .from(transactions);

    console.log("Total transactions count:", totalCount);

    // Get all transactions for debugging
    const allTxs = await db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.timestamp));

    console.log("All transactions:", allTxs);

    // Get stats for the period with logging
    const periodStats = await db
      .select({
        avgGasPrice: sql`avg(cast(gas_price as decimal))::integer`,
        totalGasUsed: sql`sum(cast(gas_used as decimal))::text`,
        totalEnergyImpact: sql`sum(cast(energy_impact as decimal))::text`,
      })
      .from(transactions)
      .where(gte(transactions.timestamp, daysAgo));

    console.log("Period stats:", periodStats);

    // Add more detailed logging
    const result = {
      totalTransactions: totalCount[0]?.count || 0,
      avgGasPrice: periodStats[0]?.avgGasPrice || 0,
      totalGasUsed: periodStats[0]?.totalGasUsed || "0",
      totalEnergyImpact: periodStats[0]?.totalEnergyImpact || "0",
    };

    console.log("Final stats result:", result);

    return result;
  } catch (error) {
    console.error("Detailed error in getTransactionStats:", error);
    throw error; // Let's throw the error to see it in the frontend
  }
}

// Add function to get recent transactions
export async function getRecentTransactions(limit: number = 10) {
  return await db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.timestamp))
    .limit(limit);
}

// Add function to get daily energy impact
export async function getDailyEnergyImpact() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await db
    .select({
      totalEnergy: sql`sum(cast(energy_impact as decimal))::text`,
      transactionCount: sql`count(*)::integer`,
    })
    .from(transactions)
    .where(gte(transactions.timestamp, today));
}

// Add a function to check if we can connect to the database
export async function checkDatabaseConnection() {
  try {
    const result = await db.select().from(transactions).limit(1);
    console.log("Database connection test:", result);
    return true;
  } catch (error) {
    console.error("Database connection error:", error);
    return false;
  }
}

// Add function to get total carbon offset
export async function getTotalCarbonOffset() {
  try {
    const result = await db
      .select({
        totalOffset: sql`sum(cast(carbon_offset as decimal))::text`,
      })
      .from(energyMetrics);

    return Number(result[0]?.totalOffset || 0);
  } catch (error) {
    console.error("Error getting total carbon offset:", error);
    return 0;
  }
}

// Update function to get weekly network activity with energy impact
export async function getWeeklyNetworkActivity() {
  try {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const dailyStats = await db
      .select({
        day: sql`to_char(timestamp, 'Dy')`,
        transactionCount: sql`count(*)::integer`,
        energyImpact: sql`sum(cast(energy_impact as decimal))::float`,
        avgGasPrice: sql`round(avg(cast(gas_used as decimal)) / 1e9, 2)::float`, // Convert to Gwei
      })
      .from(transactions)
      .where(gte(transactions.timestamp, weekAgo))
      .groupBy(sql`to_char(timestamp, 'Dy')`)
      .orderBy(sql`to_char(timestamp, 'Dy')`);

    console.log("Daily transaction stats:", dailyStats);

    // Fill in any missing days with zeros
    const filledStats = days.map((day) => {
      const stat = dailyStats.find((s) => s.day === day);
      return {
        day,
        value: stat?.transactionCount || 0,
        gasPrice: stat?.avgGasPrice || 0,
        energyImpact: Number(stat?.energyImpact || 0).toFixed(2),
        isToday: day === days[today.getDay()],
      };
    });

    console.log("Filled weekly stats:", filledStats);
    return filledStats;
  } catch (error) {
    console.error("Error getting weekly network activity:", error);
    return [];
  }
}

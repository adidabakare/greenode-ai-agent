import { AgentKit, CdpWalletProvider } from "@coinbase/agentkit";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";

export class AgentService {
  private static instance: AgentService;

  private constructor() {}

  static getInstance(): AgentService {
    if (!AgentService.instance) {
      AgentService.instance = new AgentService();
    }
    return AgentService.instance;
  }

  async getOptimizationInsights(transaction: any) {
    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "transaction",
          data: transaction,
        }),
      });

      const data = await response.json();
      return data.analysis || "Unable to analyze transaction at this time.";
    } catch (error) {
      console.error("Error getting optimization insights:", error);
      return "Unable to analyze transaction at this time.";
    }
  }

  async getNetworkAnalysis(metrics: any) {
    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "network",
          data: metrics,
        }),
      });

      const data = await response.json();
      return data.analysis || "Unable to analyze network metrics at this time.";
    } catch (error) {
      console.error("Error getting network analysis:", error);
      return "Unable to analyze network metrics at this time.";
    }
  }
}

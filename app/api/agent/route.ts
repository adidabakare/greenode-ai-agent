import { AgentKit, CdpWalletProvider } from "@coinbase/agentkit";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";
import { NextResponse } from "next/server";

let agent: any = null;
let config: any = null;

async function initializeAgent() {
  if (agent) return { agent, config };

  const llm = new ChatOpenAI({
    model: "gpt-4-turbo-preview",
  });

  const walletProvider = await CdpWalletProvider.configureWithWallet({
    apiKeyName: process.env.CDP_API_KEY_NAME,
    apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY,
    networkId: "base-sepolia",
  });

  const agentkit = await AgentKit.from({
    walletProvider,
    actionProviders: [],
  });

  const tools = await getLangChainTools(agentkit);
  const memory = new MemorySaver();

  config = {
    configurable: {
      thread_id: "Greenode Energy Optimization Agent",
    },
  };

  agent = createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
    messageModifier: `
      You are an advanced AI energy optimization agent for blockchain transactions.
      Your primary goal is to analyze and optimize energy consumption in smart contracts
      and blockchain transactions.
    `,
  });

  return { agent, config };
}

export async function POST(req: Request) {
  try {
    const { type, data } = await req.json();
    const { agent, config } = await initializeAgent();

    let prompt = "";
    if (type === "transaction") {
      prompt = `
        Analyze this blockchain transaction for energy optimization:
        Gas Used: ${data.gasUsed}
        Energy Impact: ${data.energyImpact} kWh
        Contract: ${data.to}
        
        Provide:
        1. Specific optimization recommendations
        2. Energy efficiency analysis
        3. Potential impact on network sustainability
        4. Best practices for similar transactions
      `;
    } else if (type === "network") {
      prompt = `
        Analyze these network metrics for sustainability:
        Total Gas Used: ${data.totalGasUsed}
        Average Gas Price: ${data.averageGasPrice} Gwei
        Total Transactions: ${data.totalTransactions}
        Energy Impact: ${data.energyImpact} kWh
        
        Provide network-level optimization recommendations and sustainability insights.
      `;
    }

    const stream = await agent.stream(
      { messages: [new HumanMessage(prompt)] },
      config
    );

    let analysis = "";
    for await (const chunk of stream) {
      if ("agent" in chunk) {
        analysis += chunk.agent.messages[0].content;
      }
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Agent API Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

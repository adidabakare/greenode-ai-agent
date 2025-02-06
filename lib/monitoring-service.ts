import { ethers, formatEther } from "ethers";
import { GREENODE_MONITOR_ABI } from "./contract-abis";
import {
  saveTransaction,
  saveOptimizationRecommendation,
  updateDailyMetrics,
} from "./db/actions";
import { AgentService } from "./agent-service";

export class MonitoringService {
  private provider: ethers.JsonRpcProvider;
  private wsProvider: ethers.WebSocketProvider;
  private basescanApiKey: string;
  private basescanApi: string;
  public monitorContract: ethers.Contract;
  private processedTxHashes = new Set<string>();
  private aiEndpoint = "https://autonome.alt.technology/greenode-hrjiay/chat";
  private aiCredentials = btoa("greenode:dcMWueeaVK"); // Base64 encode credentials
  private agentService: AgentService;

  constructor() {
    this.provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
    // Use Base's public WebSocket endpoint
    this.wsProvider = new ethers.WebSocketProvider(
      "wss://base-sepolia.g.alchemy.com/v2/demo"
    );
    this.basescanApiKey = process.env.NEXT_PUBLIC_BASESCAN_API_KEY || "";
    this.basescanApi = "https://api-sepolia.basescan.org/api";

    // Initialize contract
    this.monitorContract = new ethers.Contract(
      "0x92EECac0a67372fB4420FB61aAd28b77B335A790",
      GREENODE_MONITOR_ABI,
      this.provider
    );

    this.agentService = AgentService.getInstance();
  }

  async startMonitoring(onNewTransaction: (data: any) => void) {
    try {
      // Clear processed transactions every hour to prevent memory leaks
      setInterval(() => {
        this.processedTxHashes.clear();
      }, 3600000);

      // Get initial transactions
      await this.fetchRecentTransactions(onNewTransaction);

      // Set up WebSocket listener with debounce
      let processingTx = false;
      this.wsProvider.on("pending", async (txHash) => {
        if (processingTx || this.processedTxHashes.has(txHash)) return;

        try {
          processingTx = true;
          const tx = await this.provider.getTransaction(txHash);
          if (tx && tx.to) {
            const receipt = await tx.wait();
            if (receipt) {
              const block = await this.provider.getBlock(receipt.blockNumber);
              if (block) {
                this.processedTxHashes.add(txHash);
                const txData = await this.processTransaction({
                  hash: tx.hash,
                  from: tx.from,
                  to: tx.to,
                  gasUsed: receipt.gasUsed,
                  gasPrice: tx.gasPrice,
                  blockNumber: receipt.blockNumber,
                  timestamp: block.timestamp,
                  input: tx.data,
                });
                onNewTransaction(txData);
              }
            }
          }
        } catch (error) {
          // Ignore errors for pending transactions
          console.log("Skipping pending transaction:", error.message);
        } finally {
          processingTx = false;
        }
      });

      return true;
    } catch (error) {
      console.error("Error starting monitoring:", error);
      return false;
    }
  }

  public async fetchRecentTransactions(onNewTransaction: (data: any) => void) {
    try {
      const response = await fetch(
        `${this.basescanApi}?module=proxy&action=eth_getBlockByNumber&tag=latest&boolean=true&apikey=${this.basescanApiKey}`
      );

      const data = await response.json();
      if (data.result && data.result.transactions) {
        const processedTxs = new Set(); // Track transactions within this fetch

        for (const tx of data.result.transactions) {
          if (
            tx.to &&
            !this.processedTxHashes.has(tx.hash) &&
            !processedTxs.has(tx.hash)
          ) {
            try {
              processedTxs.add(tx.hash);
              this.processedTxHashes.add(tx.hash);

              const gasUsed = BigInt(tx.gas);
              const energyImpact = this.calculateEnergyImpact(gasUsed);
              const suggestion = await this.getOptimizationSuggestion(gasUsed);

              try {
                const savedTx = await saveTransaction({
                  hash: tx.hash,
                  from: tx.from,
                  to: tx.to,
                  gasUsed: gasUsed.toString(),
                  gasPrice: tx.gasPrice,
                  blockNumber: parseInt(tx.blockNumber),
                  timestamp: new Date(),
                  energyImpact: energyImpact.toString(),
                  input: tx.input,
                });

                // Only proceed if transaction was saved successfully
                if (savedTx) {
                  if (suggestion.potentialSavings > 10) {
                    await saveOptimizationRecommendation({
                      contractAddress: tx.to,
                      recommendation: suggestion.suggestion,
                      type: "GAS_OPTIMIZATION",
                      priority:
                        suggestion.potentialSavings > 50 ? "HIGH" : "MEDIUM",
                      potentialSavings: suggestion.potentialSavings,
                      status: "PENDING",
                    });
                  }

                  const txData = {
                    hash: tx.hash,
                    from: tx.from,
                    to: tx.to,
                    gasUsed,
                    gasPrice: BigInt(tx.gasPrice),
                    blockNumber: parseInt(tx.blockNumber),
                    timestamp: Math.floor(Date.now() / 1000),
                    energyImpact,
                    input: tx.input,
                    optimization: suggestion,
                  };

                  onNewTransaction(txData);
                }
              } catch (error) {
                if (!error.message?.includes("duplicate key")) {
                  console.error("Database error:", error);
                }
              }
            } catch (error) {
              console.error("Error processing transaction:", error);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
    }
  }

  stopMonitoring() {
    this.wsProvider.removeAllListeners();
  }

  private calculateEnergyImpact(gasUsed: bigint): number {
    // Constants based on research and Base network specifics
    const ENERGY_PER_GAS = 0.000002; // kWh per gas unit (adjusted for visibility)
    const L2_EFFICIENCY_FACTOR = 0.15; // Base is 85% more efficient than L1
    const NETWORK_LOAD_FACTOR = 0.9; // Network efficiency

    // Calculate base energy consumption
    const baseEnergy = Number(gasUsed) * ENERGY_PER_GAS;

    // Apply L2 efficiency (Base is an L2)
    const l2Energy = baseEnergy * L2_EFFICIENCY_FACTOR;

    // Apply network conditions
    const finalEnergy = l2Energy * NETWORK_LOAD_FACTOR;

    // Return kWh with 4 decimal precision
    return Number(finalEnergy.toFixed(4));
  }

  async getOptimizationSuggestion(gasUsed: bigint): Promise<{
    suggestion: string;
    potentialSavings: number;
  }> {
    try {
      // Base transaction gas cost on Base L2
      const baseGas = 21000n;

      // Calculate overhead percentage
      const gasOverhead =
        gasUsed > baseGas ? Number(((gasUsed - baseGas) * 100n) / gasUsed) : 0;

      // Calculate savings based on transaction complexity
      if (gasUsed > 2000000n) {
        // Complex transactions - batch processing potential
        const batchSavings = Math.min(Math.round(gasOverhead * 0.4), 65);
        return {
          suggestion:
            "High gas usage detected. Consider implementing batch processing and optimizing loop operations.",
          potentialSavings: batchSavings,
        };
      } else if (gasUsed > 1000000n) {
        // Medium complexity - storage optimization potential
        const storageSavings = Math.min(Math.round(gasOverhead * 0.3), 45);
        return {
          suggestion:
            "Medium gas usage. Optimize storage patterns and reduce state variable updates.",
          potentialSavings: storageSavings,
        };
      } else if (gasUsed > 500000n) {
        // Lower complexity - basic optimizations
        const basicSavings = Math.min(Math.round(gasOverhead * 0.2), 30);
        return {
          suggestion:
            "Consider using calldata instead of memory for read-only arguments and optimize function modifiers.",
          potentialSavings: basicSavings,
        };
      } else {
        // Simple transactions
        const simpleSavings = Math.min(Math.round(gasOverhead * 0.1), 15);
        return {
          suggestion:
            "Transaction is relatively efficient. Consider bundling multiple operations if this is called frequently.",
          potentialSavings: simpleSavings,
        };
      }
    } catch (error) {
      console.error("Error calculating optimization suggestion:", error);
      return {
        suggestion: "Unable to analyze transaction",
        potentialSavings: 0,
      };
    }
  }

  public async fetchContractOwnerInfo(address: string) {
    try {
      // Get contract creator
      const response = await fetch(
        `${this.basescanApi}?module=contract&action=getcontractcreation` +
          `&contractaddresses=${address}&apikey=${this.basescanApiKey}`
      );

      const data = await response.json();
      if (data.status === "1" && data.result) {
        const creator = data.result[0].contractCreator;

        // Try to get ENS name
        const ensName = await this.provider.lookupAddress(creator);

        return {
          address: creator,
          ens: ensName,
          isRegistered:
            (await this.monitorContract.contractRegistry(address).owner) !==
            "0x0000000000000000000000000000000000000000",
        };
      }
    } catch (error) {
      console.error("Error fetching owner info:", error);
    }
    return null;
  }

  private async getAIInsight(context: {
    gasUsed: string;
    energyImpact: string;
    transactionType?: string;
    contractAddress: string;
  }) {
    try {
      // Simpler, more direct prompt
      const prompt = `Analyze this transaction for energy optimization:
        Gas: ${context.gasUsed} units
        Energy: ${context.energyImpact} kWh
        Contract: ${context.contractAddress}

        Provide a brief analysis of energy efficiency and optimization suggestions.`;

      console.log("Sending AI request with prompt:", prompt); // Debug log

      const response = await fetch(this.aiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${this.aiCredentials}`,
        },
        body: JSON.stringify({
          message: prompt,
        }),
      });

      if (!response.ok) {
        console.error("AI API Error:", response.status, await response.text());
        return "Error getting AI analysis.";
      }

      const data = await response.json();
      console.log("Raw AI Response:", data); // Debug log

      if (!data.response || !data.response[0]) {
        return "No AI analysis available.";
      }

      return data.response[0];
    } catch (error) {
      console.error("Detailed AI Error:", error);
      return "AI analysis unavailable.";
    }
  }

  private async processTransaction(tx: any) {
    try {
      const gasUsed = tx.gasUsed;
      const energyImpact = this.calculateEnergyImpact(gasUsed);

      console.log("Processing transaction:", tx.hash);
      console.log("Gas Used:", gasUsed.toString());
      console.log("Energy Impact:", energyImpact);

      // Get insights from both agents
      const [aiInsight, cdpInsight] = await Promise.all([
        this.getAIInsight({
          gasUsed: gasUsed.toString(),
          energyImpact: energyImpact.toString(),
          contractAddress: tx.to,
        }),
        this.agentService.getOptimizationInsights(tx),
      ]);

      // Combine insights
      const combinedInsight = `
Energy AI: ${aiInsight}

CDP Analysis: ${cdpInsight}
      `.trim();

      // Get optimization suggestion
      const suggestion = await this.getOptimizationSuggestion(gasUsed);

      // Store transaction with AI insights
      const savedTx = await saveTransaction({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        gasUsed: gasUsed.toString(),
        gasPrice: tx.gasPrice.toString(),
        blockNumber: tx.blockNumber,
        timestamp: new Date(tx.timestamp * 1000),
        energyImpact: energyImpact.toString(),
        input: tx.input,
      });

      // Store AI-enhanced recommendation
      if (suggestion.potentialSavings > 10) {
        await saveOptimizationRecommendation({
          contractAddress: tx.to,
          recommendation: `${suggestion.suggestion}\n\nAI Insight: ${combinedInsight}`,
          type: "AI_OPTIMIZATION",
          priority: suggestion.potentialSavings > 50 ? "HIGH" : "MEDIUM",
          potentialSavings: suggestion.potentialSavings,
          status: "PENDING",
        });
      }

      // Get contract owner info
      const ownerInfo = await this.fetchContractOwnerInfo(tx.to);

      if (ownerInfo && ownerInfo.isRegistered) {
        // Notify contract owner about optimization
        const signer = await this.provider.getSigner();
        const connectedContract = this.monitorContract.connect(signer);

        await connectedContract.notifyOptimization(
          tx.to,
          gasUsed,
          suggestion.suggestion
        );

        console.log("Notified contract owner:", {
          contract: tx.to,
          owner: ownerInfo.address,
          ens: ownerInfo.ens,
          suggestion: suggestion.suggestion,
        });
      }

      // Check if transaction is efficient for rewards
      if (
        Number(gasUsed) < Number(await this.monitorContract.REWARD_THRESHOLD())
      ) {
        const signer = await this.provider.getSigner();
        const connectedContract = this.monitorContract.connect(signer);
        await connectedContract.rewardEfficientTransaction(tx.from, gasUsed);
      }

      // Update daily metrics
      await updateDailyMetrics({
        date: new Date(),
        totalGasUsed: gasUsed.toString(),
        averageGasPrice: Number(tx.gasPrice),
        totalTransactions: 1,
        energyImpact: energyImpact.toString(),
        carbonOffset: (energyImpact * 0.4).toString(), // Rough estimate of carbon offset
        l2Adoption: 100, // Since we're on Base L2
      });

      return {
        ...tx,
        energyImpact,
        optimization: suggestion,
        aiInsight: combinedInsight,
        contractOwner: ownerInfo,
      };
    } catch (error) {
      console.error("Error processing transaction:", error);
      throw error;
    }
  }

  // Add a method to register contract for notifications
  public async registerContractForNotifications(
    contractAddress: string,
    contactInfo: string
  ) {
    try {
      const signer = await this.provider.getSigner();
      const connectedContract = this.monitorContract.connect(signer);
      await connectedContract.registerContract(contractAddress, contactInfo);
      console.log("Contract registered for notifications:", contractAddress);
    } catch (error) {
      console.error("Error registering contract:", error);
    }
  }

  // Add a method to toggle notifications
  public async toggleContractNotifications(contractAddress: string) {
    try {
      const signer = await this.provider.getSigner();
      const connectedContract = this.monitorContract.connect(signer);
      await connectedContract.toggleNotifications(contractAddress);
      console.log("Toggled notifications for contract:", contractAddress);
    } catch (error) {
      console.error("Error toggling notifications:", error);
    }
  }

  public async getTokenInfo() {
    try {
      const totalSupply = await this.monitorContract.totalSupply();

      return {
        totalSupply: formatEther(totalSupply),
        symbol: await this.monitorContract.symbol(),
      };
    } catch (error) {
      console.error("Error fetching token info:", error);
      return {
        totalSupply: "0",
        symbol: "GREEN",
      };
    }
  }

  // Add method to get AI analysis for specific metrics
  public async getAIAnalysis(metrics: {
    totalGasUsed: string;
    averageGasPrice: number;
    totalTransactions: number;
    energyImpact: string;
  }) {
    try {
      const response = await fetch(this.aiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${this.aiCredentials}`,
        },
        body: JSON.stringify({
          message: `Analyze these network metrics:
            - Total Gas Used: ${metrics.totalGasUsed}
            - Average Gas Price: ${metrics.averageGasPrice} Gwei
            - Total Transactions: ${metrics.totalTransactions}
            - Energy Impact: ${metrics.energyImpact} kWh
            
            Provide network efficiency insights and sustainability recommendations.`,
        }),
      });

      const data = await response.json();
      return data.response[0];
    } catch (error) {
      console.error("Error getting AI analysis:", error);
      return "Unable to get AI analysis at this time.";
    }
  }
}

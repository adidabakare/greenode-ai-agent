import { ethers } from "ethers";
import { GREENODE_MONITOR_ABI } from "./contract-abis";

export class MonitoringService {
  private provider: ethers.JsonRpcProvider;
  private wsProvider: ethers.WebSocketProvider;
  private basescanApiKey: string;
  private basescanApi: string;

  constructor() {
    this.provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
    // Use Base's public WebSocket endpoint
    this.wsProvider = new ethers.WebSocketProvider(
      "wss://base-sepolia.g.alchemy.com/v2/demo"
    );
    this.basescanApiKey = process.env.NEXT_PUBLIC_BASESCAN_API_KEY || "";
    this.basescanApi = "https://api-sepolia.basescan.org/api";
  }

  async startMonitoring(onNewTransaction: (data: any) => void) {
    // Get initial recent transactions
    await this.fetchRecentTransactions(onNewTransaction);

    // Listen to new pending transactions
    this.wsProvider.on("pending", async (txHash) => {
      try {
        const tx = await this.provider.getTransaction(txHash);
        if (tx && tx.to) {
          const receipt = await tx.wait();
          if (receipt) {
            const block = await this.provider.getBlock(receipt.blockNumber);
            if (block) {
              const txData = {
                hash: tx.hash,
                from: tx.from,
                to: tx.to,
                gasUsed: receipt.gasUsed,
                gasPrice: tx.gasPrice,
                blockNumber: receipt.blockNumber,
                timestamp: block.timestamp,
                energyImpact: this.calculateEnergyImpact(receipt.gasUsed),
                input: tx.data,
              };
              onNewTransaction(txData);
            }
          }
        }
      } catch (error) {
        // Ignore errors for pending transactions
      }
    });
  }

  public async fetchRecentTransactions(onNewTransaction: (data: any) => void) {
    try {
      // Use getrecenttxs API endpoint instead of txlist
      const response = await fetch(
        `${this.basescanApi}?module=proxy&action=eth_getBlockByNumber&tag=latest&boolean=true&apikey=${this.basescanApiKey}`
      );

      const data = await response.json();
      if (data.result && data.result.transactions) {
        for (const tx of data.result.transactions) {
          if (tx.to) {
            const txData = {
              hash: tx.hash,
              from: tx.from,
              to: tx.to,
              gasUsed: BigInt(tx.gas),
              gasPrice: BigInt(tx.gasPrice),
              blockNumber: parseInt(tx.blockNumber),
              timestamp: Math.floor(Date.now() / 1000), // Current timestamp
              energyImpact: this.calculateEnergyImpact(BigInt(tx.gas)),
              input: tx.input,
            };
            onNewTransaction(txData);
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
    if (gasUsed > 2000000n) {
      return {
        suggestion: "Consider implementing batch processing",
        potentialSavings: 30,
      };
    } else if (gasUsed > 1500000n) {
      return {
        suggestion: "Optimize storage access patterns",
        potentialSavings: 20,
      };
    } else {
      return {
        suggestion: "Evaluate L2 migration opportunity",
        potentialSavings: 85,
      };
    }
  }

  private async checkAndNotifyOwner(tx: any) {
    try {
      // Get contract metadata
      const metadata = await this.monitorContract.contractRegistry(tx.to);

      if (metadata.notificationsEnabled) {
        const gasUsed = tx.gasUsed;
        const suggestion = await this.getOptimizationSuggestion(gasUsed);

        // Notify on-chain
        await this.monitorContract.notifyOptimization(
          tx.to,
          gasUsed,
          suggestion.suggestion
        );

        // Check for rewards
        if (
          Number(gasUsed) <
          Number(await this.monitorContract.REWARD_THRESHOLD())
        ) {
          await this.monitorContract.rewardEfficientTransaction(
            tx.from,
            gasUsed
          );
        }
      }
    } catch (error) {
      console.error("Error notifying owner:", error);
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

  // Update the transaction processing to include notifications
  private async processTransaction(tx: any) {
    const txData = {
      // ... existing txData ...
    };

    // Check for notifications and rewards
    await this.checkAndNotifyOwner(tx);

    return txData;
  }
}

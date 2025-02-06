import GreenodeMonitor from "../artifacts/contracts/GreenodeMonitor.sol/GreenodeMonitor.json";

export const GREENODE_MONITOR_ABI = GreenodeMonitor.abi;

export interface ContractMetadata {
  owner: string;
  contactInfo: string;
  notificationsEnabled: boolean;
}

export interface OptimizationAlert {
  contractAddress: string;
  owner: string;
  gasUsed: bigint;
  suggestion: string;
}

export interface EfficiencyReward {
  user: string;
  amount: bigint;
  gasUsed: bigint;
}

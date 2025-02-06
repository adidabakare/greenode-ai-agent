// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract GreenodeMonitor is ERC20, Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

    struct ContractMetrics {
        uint256 totalGasUsed;
        uint256 totalCalls;
        uint256 lastOptimization;
        bool isOptimized;
        string optimizationSuggestion;
    }

    // Tracked contracts
    EnumerableSet.AddressSet private monitoredContracts;
    mapping(address => ContractMetrics) public contractMetrics;

    // Events
    event ContractAdded(address indexed contractAddress);
    event ContractOptimized(
        address indexed contractAddress,
        uint256 gasUsed,
        uint256 timestamp
    );
    event OptimizationSuggested(
        address indexed contractAddress,
        string suggestion,
        uint256 potentialSavings
    );

    event ContractOptimizationAlert(
        address indexed contractAddress,
        address indexed owner,
        uint256 gasUsed,
        string suggestion
    );

    event EnergyEfficiencyReward(
        address indexed user,
        uint256 amount,
        uint256 gasUsed
    );

    // Struct to store contract metadata
    struct ContractMetadata {
        address owner;
        string contactInfo; // ENS or other contact info
        bool notificationsEnabled;
    }

    // Mapping to store contract metadata
    mapping(address => ContractMetadata) public contractRegistry;
    
    // Thresholds
    uint256 public constant REWARD_THRESHOLD = 50000; // Gas threshold for rewards
    uint256 public constant REWARD_AMOUNT = 100 * 10**18; // 100 tokens

    constructor(
        address initialOwner
    ) ERC20("GreenNode", "GREEN") Ownable(initialOwner) {
        _mint(initialOwner, 1000000 * 10**18); // Initial supply to owner
    }

    function addContractToMonitor(address _contract) external onlyOwner {
        require(_contract != address(0), "Invalid contract address");
        monitoredContracts.add(_contract);
        emit ContractAdded(_contract);
    }

    function updateMetrics(
        address _contract,
        uint256 _gasUsed
    ) external onlyOwner {
        require(monitoredContracts.contains(_contract), "Contract not monitored");
        
        ContractMetrics storage metrics = contractMetrics[_contract];
        metrics.totalGasUsed += _gasUsed;
        metrics.totalCalls += 1;
    }

    function suggestOptimization(
        address _contract,
        string calldata _suggestion,
        uint256 _potentialSavings
    ) external onlyOwner {
        require(monitoredContracts.contains(_contract), "Contract not monitored");
        
        ContractMetrics storage metrics = contractMetrics[_contract];
        metrics.optimizationSuggestion = _suggestion;
        
        emit OptimizationSuggested(_contract, _suggestion, _potentialSavings);
    }

    function getContractMetrics(
        address _contract
    ) external view returns (ContractMetrics memory) {
        require(monitoredContracts.contains(_contract), "Contract not monitored");
        return contractMetrics[_contract];
    }

    function getAllMonitoredContracts() external view returns (address[] memory) {
        uint256 length = monitoredContracts.length();
        address[] memory contracts = new address[](length);
        
        for (uint256 i = 0; i < length; i++) {
            contracts[i] = monitoredContracts.at(i);
        }
        
        return contracts;
    }

    function registerContract(address contractAddress, string memory contactInfo) external {
        contractRegistry[contractAddress] = ContractMetadata({
            owner: msg.sender,
            contactInfo: contactInfo,
            notificationsEnabled: true
        });
    }

    function toggleNotifications(address contractAddress) external {
        require(msg.sender == contractRegistry[contractAddress].owner, "Not owner");
        contractRegistry[contractAddress].notificationsEnabled = 
            !contractRegistry[contractAddress].notificationsEnabled;
    }

    function notifyOptimization(
        address contractAddress,
        uint256 gasUsed,
        string memory suggestion
    ) external onlyOwner {
        ContractMetadata memory metadata = contractRegistry[contractAddress];
        if (metadata.notificationsEnabled) {
            emit ContractOptimizationAlert(
                contractAddress,
                metadata.owner,
                gasUsed,
                suggestion
            );
        }
    }

    function rewardEfficientTransaction(address user, uint256 gasUsed) external onlyOwner {
        if (gasUsed < REWARD_THRESHOLD) {
            _mint(user, REWARD_AMOUNT);
            emit EnergyEfficiencyReward(user, REWARD_AMOUNT, gasUsed);
        }
    }
}

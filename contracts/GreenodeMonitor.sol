// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@eigenlayer/contracts/interfaces/IServiceManager.sol";
import "@eigenlayer/contracts/permissions/ECDSAServiceManagerBase.sol";

contract GreenodeMonitor is ERC20, ECDSAServiceManagerBase {
    using EnumerableSet for EnumerableSet.AddressSet;
    using ECDSAUpgradeable for bytes32;

    struct ContractMetrics {
        uint256 totalGasUsed;
        uint256 totalCalls;
        uint256 lastOptimization;
        bool isOptimized;
        string optimizationSuggestion;
        bytes32 operatorSignature;
    }

    // Tracked contracts
    EnumerableSet.AddressSet private monitoredContracts;
    mapping(address => ContractMetrics) public contractMetrics;

    // Events
    event ContractAdded(address indexed contractAddress);
    event ContractOptimized(
        address indexed contractAddress,
        uint256 gasUsed,
        uint256 timestamp,
        bytes32 operatorSignature
    );
    event OptimizationSuggested(
        address indexed contractAddress,
        string suggestion,
        uint256 potentialSavings,
        bytes32 operatorSignature
    );

    event ContractOptimizationAlert(
        address indexed contractAddress,
        address indexed owner,
        uint256 gasUsed,
        string suggestion,
        bytes32 operatorSignature
    );

    event EnergyEfficiencyReward(
        address indexed user,
        uint256 amount,
        uint256 gasUsed,
        bytes32 operatorSignature
    );

    // Struct to store contract metadata
    struct ContractMetadata {
        address owner;
        string contactInfo; // ENS or other contact info
        bool notificationsEnabled;
        bytes32 lastOperatorSignature;
    }

    // Mapping to store contract metadata
    mapping(address => ContractMetadata) public contractRegistry;
    
    // Thresholds
    uint256 public constant REWARD_THRESHOLD = 50000; // Gas threshold for rewards
    uint256 public constant REWARD_AMOUNT = 100 * 10**18; // 100 tokens

    constructor(
        address initialOwner,
        address _stakeRegistry
    ) ERC20("GreenNode", "GREEN") ECDSAServiceManagerBase(_stakeRegistry) {
        _mint(initialOwner, 1000000 * 10**18); // Initial supply to owner
    }

    function addContractToMonitor(
        address _contract,
        bytes memory operatorSignature
    ) external {
        require(_contract != address(0), "Invalid contract address");
        
        // Verify operator signature
        bytes32 messageHash = keccak256(abi.encodePacked(_contract, "add"));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        
        bytes4 magicValue = IERC1271Upgradeable.isValidSignature.selector;
        require(
            magicValue == ECDSAStakeRegistry(stakeRegistry).isValidSignature(ethSignedMessageHash, operatorSignature),
            "Invalid operator signature"
        );

        monitoredContracts.add(_contract);
        emit ContractAdded(_contract);
    }

    function updateMetrics(
        address _contract,
        uint256 _gasUsed,
        bytes memory operatorSignature
    ) external {
        require(monitoredContracts.contains(_contract), "Contract not monitored");
        
        // Verify operator signature
        bytes32 messageHash = keccak256(abi.encodePacked(_contract, _gasUsed));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        
        bytes4 magicValue = IERC1271Upgradeable.isValidSignature.selector;
        require(
            magicValue == ECDSAStakeRegistry(stakeRegistry).isValidSignature(ethSignedMessageHash, operatorSignature),
            "Invalid operator signature"
        );
        
        ContractMetrics storage metrics = contractMetrics[_contract];
        metrics.totalGasUsed += _gasUsed;
        metrics.totalCalls += 1;
        metrics.operatorSignature = ethSignedMessageHash;
    }

    function suggestOptimization(
        address _contract,
        string calldata _suggestion,
        uint256 _potentialSavings,
        bytes memory operatorSignature
    ) external {
        require(monitoredContracts.contains(_contract), "Contract not monitored");
        
        // Verify operator signature
        bytes32 messageHash = keccak256(abi.encodePacked(_contract, _suggestion, _potentialSavings));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        
        bytes4 magicValue = IERC1271Upgradeable.isValidSignature.selector;
        require(
            magicValue == ECDSAStakeRegistry(stakeRegistry).isValidSignature(ethSignedMessageHash, operatorSignature),
            "Invalid operator signature"
        );
        
        ContractMetrics storage metrics = contractMetrics[_contract];
        metrics.optimizationSuggestion = _suggestion;
        metrics.operatorSignature = ethSignedMessageHash;
        
        emit OptimizationSuggested(_contract, _suggestion, _potentialSavings, ethSignedMessageHash);
    }

    function registerContract(
        address contractAddress,
        string memory contactInfo,
        bytes memory operatorSignature
    ) external {
        // Verify operator signature
        bytes32 messageHash = keccak256(abi.encodePacked(contractAddress, contactInfo));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        
        bytes4 magicValue = IERC1271Upgradeable.isValidSignature.selector;
        require(
            magicValue == ECDSAStakeRegistry(stakeRegistry).isValidSignature(ethSignedMessageHash, operatorSignature),
            "Invalid operator signature"
        );

        contractRegistry[contractAddress] = ContractMetadata({
            owner: msg.sender,
            contactInfo: contactInfo,
            notificationsEnabled: true,
            lastOperatorSignature: ethSignedMessageHash
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
        string memory suggestion,
        bytes memory operatorSignature
    ) external {
        // Verify operator signature
        bytes32 messageHash = keccak256(abi.encodePacked(contractAddress, gasUsed, suggestion));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        
        bytes4 magicValue = IERC1271Upgradeable.isValidSignature.selector;
        require(
            magicValue == ECDSAStakeRegistry(stakeRegistry).isValidSignature(ethSignedMessageHash, operatorSignature),
            "Invalid operator signature"
        );

        ContractMetadata storage metadata = contractRegistry[contractAddress];
        if (metadata.notificationsEnabled) {
            metadata.lastOperatorSignature = ethSignedMessageHash;
            emit ContractOptimizationAlert(
                contractAddress,
                metadata.owner,
                gasUsed,
                suggestion,
                ethSignedMessageHash
            );
        }
    }

    function rewardEfficientTransaction(
        address user,
        uint256 gasUsed,
        bytes memory operatorSignature
    ) external {
        // Verify operator signature
        bytes32 messageHash = keccak256(abi.encodePacked(user, gasUsed));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        
        bytes4 magicValue = IERC1271Upgradeable.isValidSignature.selector;
        require(
            magicValue == ECDSAStakeRegistry(stakeRegistry).isValidSignature(ethSignedMessageHash, operatorSignature),
            "Invalid operator signature"
        );

        if (gasUsed < REWARD_THRESHOLD) {
            _mint(user, REWARD_AMOUNT);
            emit EnergyEfficiencyReward(user, REWARD_AMOUNT, gasUsed, ethSignedMessageHash);
        }
    }

    // View functions remain unchanged
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
}


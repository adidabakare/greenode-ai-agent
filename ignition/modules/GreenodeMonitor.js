const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("GreenodeMonitor", (m) => {
  const greenodeMonitor = m.contract("GreenodeMonitor", [
    "0x99e97E2b211aF498f2FBB417cd2aCEf3dB24F53F", // Initial owner address
  ]);

  return { greenodeMonitor };
});

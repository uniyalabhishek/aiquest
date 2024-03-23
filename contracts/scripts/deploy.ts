import hre from "hardhat";

async function main() {
  const aIQuestNFT = await hre.viem.deployContract("AIQuestNFT" as string, []);
  console.log(`AIQuestNFT deployed to ${aIQuestNFT.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

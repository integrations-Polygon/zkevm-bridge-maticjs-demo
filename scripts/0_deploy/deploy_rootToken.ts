import { ethers, run } from "hardhat";
import { sleep } from "../utils/utilityFunctions";
import { ERC20TestToken__factory } from "../../src/types";

async function deployRootToken() {
  // get the contract to deploy
  const RootToken = (await ethers.getContractFactory("ERC20TestToken")) as ERC20TestToken__factory;
  const rootToken = await RootToken.deploy();
  console.clear();
  console.log("\nDeploying Root Token on Goerli chain....");

  await sleep(60000); // wait at least 60sec for state change
  console.log(`Root Token contract deployed at: ${rootToken.address}\n\n`);

  /**
   * Programmatic verification
   */
  try {
    await run("verify:verify", {
      address: rootToken.address,
      contract: "src/ERC20TestToken.sol:ERC20TestToken",
      constructorArguments: [],
    });
  } catch (error: any) {
    throw new Error(`error in verifying: ${error.message}`);
  }
}

deployRootToken();

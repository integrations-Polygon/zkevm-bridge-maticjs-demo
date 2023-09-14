import { ethers } from "hardhat";
import { sleep } from "../utils/sleep";
import { RootToken__factory } from "../../src/types";

async function deploy() {
  // get the contract to deploy
  const RootToken = (await ethers.getContractFactory("RootToken")) as RootToken__factory;
  const rootToken = await RootToken.deploy();
  console.log("\nDeploying Root Token on Goerli chain....");

  await sleep(20000);
  console.log("\nRoot Token contract deployed at: ", rootToken.address);
  console.log(`Contract Details: https://goerli.etherscan.io/address/${rootToken.address}`);
}

deploy();

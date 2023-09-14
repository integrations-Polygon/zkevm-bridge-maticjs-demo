import { ethers } from "hardhat";
import { sleep } from "../utils/sleep";
import { ChildToken__factory } from "../../src/types";

async function deploy() {
  // get the contract to deploy
  const ChildToken = (await ethers.getContractFactory("ChildToken")) as ChildToken__factory;
  const childToken = await ChildToken.deploy();
  console.log("\nDeploying Child Token on zkEVM chain....");

  await sleep(20000);

  console.log("\nChild Token contract deployed at: ", childToken.address);
  console.log(`Contract Details: https://zkevm.polygonscan.com/address/${childToken.address}`);
}

deploy();

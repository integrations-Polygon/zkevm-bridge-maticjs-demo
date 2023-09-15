import { depositRootToken } from "./1_deposit/depositRootToken";
import { claimChildToken } from "./2_claim/claimChildToken";
import { withdrawChildToken } from "./3_withdraw/withdrawChildToken";
import { withdrawExitRootToken } from "./3_withdraw/withdrawExitRootToken";
import { getZkEvmClient } from "./utils/zkEvmClient";
import { ZkEvmClient } from "@maticnetwork/maticjs";
import { hasDeposited, isClaimable, hasExited, MappedTokenInfo } from "./utils/utilityFunctions";
import ps from "prompt-sync";
const prompt = ps();

async function startScript() {
  let exit = false;

  console.clear();
  console.log("\n-----------------------------------------");
  console.log("ZKEVM BRIDGE - ERC20 TOKEN");
  console.log("-----------------------------------------");

  while (!exit) {
    console.log("\nSelect the type of operation to proceed:-");
    console.log("1. Deposit Root Token on L1 zkEVM bridge.");
    console.log("2. Claim deposited Root Token on L2 zkEVM bridge.");
    console.log("3. Withdraw Child Token on L2 zkEVM bridge.");
    console.log("4. WithdrawExit Root Token on L1 zkEVM bridge.");
    console.log("\nUtility functions:-");
    console.log("5. View zkEVM bridge configuration.");
    console.log("6. Check if Root Token has deposited on L1 zkEVM bridge contract.");
    console.log("7. Check if Root Token is Claimable on L2.");
    console.log("8. Check Root Token to Child Token Mapping.");
    console.log("9. Check if withdrawn Child Token can exit on L1 zkEVM bridge contract.");
    console.log("10. Exit Script.\n");

    const choice = prompt("Enter your choice: ");

    if (!choice) return console.log("\nChoice no. cannot be null");
    if (
      choice !== "1" &&
      choice !== "2" &&
      choice !== "3" &&
      choice !== "4" &&
      choice !== "5" &&
      choice !== "6" &&
      choice !== "7" &&
      choice !== "8" &&
      choice !== "9"
    )
      console.log(`\nChoice no. ${choice} is unsupported`);

    try {
      if (choice === "1") await depositRootToken();
      if (choice === "2") await claimChildToken();
      if (choice === "3") await withdrawChildToken();
      if (choice === "4") await withdrawExitRootToken();
      if (choice === "5") {
        const zkEvmClientObj: ZkEvmClient | undefined = await getZkEvmClient();
        if (zkEvmClientObj) {
          console.log(`\nL1 chain Id: ${await zkEvmClientObj.rootChainBridge.getChainId()}`);
          console.log(`L1 Bridge address: ${zkEvmClientObj.rootChainBridge.contractAddress}`);

          console.log(`L2 chain Id: ${await zkEvmClientObj.childChainBridge.getChainId()}`);
          console.log(`L2 Bridge address: ${zkEvmClientObj.childChainBridge.contractAddress}`);
        } else {
          console.log("zkEvmClient is undefined");
        }
      }
      if (choice === "6") await hasDeposited();
      if (choice === "7") await isClaimable();
      if (choice === "8") await MappedTokenInfo();
      if (choice === "9") await hasExited();
      if (choice === "10") exit = true;
    } catch (error) {
      console.log(`Error at startScript: ${error}`);
    }
  }
}

startScript()
  .then(() => {
    console.log("\n\n---------- ENDING ALL PROCESS ----------\n\n");
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
  });

import { ERC20 } from "@maticnetwork/maticjs/dist/ts/zkevm/erc20";
import { sleep } from "../utils/utilityFunctions";
import { getZkEvmClient } from "../utils/zkEvmClient";
import { ZkEvmClient, ITransactionWriteResult } from "@maticnetwork/maticjs";

import ps from "prompt-sync";
const prompt = ps();

export async function withdrawExitRootToken() {
  try {
    console.log("\n-----------------------------------------");
    console.log("WITHDRAW ROOT TOKEN");
    console.log("-----------------------------------------\n");

    /* ---------------------------- INPUT ------------------------------ */

    const rootTokenAddress = prompt("Enter the address of Root Token to withdraw: ");
    if (!rootTokenAddress) return console.log("The address of Root Token to withdrawl cannot be null");
    if (rootTokenAddress.length !== 42) return console.log(`${rootTokenAddress} is not a valid address`);

    const transactionHash = prompt(
      "Enter the transaction hash of the deposited Root Token on bridge contract: "
    );
    if (!transactionHash) return console.log("The address of Root Token to bridge cannot be null");
    if (transactionHash.length !== 66)
      return console.log(`${transactionHash} is not a valid transaction hash`);

    /* ---------------------------- SETUP ------------------------------ */

    /* 
      SETUP ZKEVM CLIENT
    */
    const zkEvmClient: ZkEvmClient | undefined = await getZkEvmClient();
    if (zkEvmClient) {
      let rootToken: ERC20 = zkEvmClient.erc20(rootTokenAddress);

      /* ---------------------------- WITHDRAW EXIT ---------------------------- */

      /* 
        WITHDRAW EXIT ROOT TOKEN 
      */
      console.log("\n-----------------------------------------");
      console.log("WITHDRAWEXIT - ROOT TOKEN");
      console.log("-----------------------------------------\n");
      let withdrawExitResponse: ITransactionWriteResult = await rootToken.withdrawExit(transactionHash);
      await sleep(60000); // wait at least 60sec for state change
      console.log(`WithdrawExit transaction hash: `, await withdrawExitResponse.getTransactionHash());
      console.log(
        `Transaction details: https://goerli.etherscan.io/tx/${await withdrawExitResponse.getTransactionHash()}`
      );

      console.log("\nTokens Withdrawal Exit successfully");
    } else {
      console.log("zkEvmClient is undefined");
    }
  } catch (error) {
    console.log("Error in withdrawExitRootToken: ", error);
  }
}

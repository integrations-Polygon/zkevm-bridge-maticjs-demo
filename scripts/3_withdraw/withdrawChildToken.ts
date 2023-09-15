import { getZkEvmClient } from "../utils/zkEvmClient";
import { getChildUser } from "../../config";
import { sleep } from "../utils/utilityFunctions";
import ps from "prompt-sync";
import { ZkEvmClient, ITransactionWriteResult } from "@maticnetwork/maticjs";
import { ERC20 } from "@maticnetwork/maticjs/dist/ts/zkevm/erc20";

const prompt = ps();

export async function withdrawChildToken() {
  try {
    console.log("\n-----------------------------------------");
    console.log("WITHDRAW CHILD TOKEN");
    console.log("-----------------------------------------\n");

    /* ---------------------------- INPUT ------------------------------ */

    const childTokenAddress: string | null = prompt("Enter the address of Child Token to withdraw: ");
    if (!childTokenAddress) return console.log("The address of Child Token to withdrawl cannot be null");
    if (childTokenAddress.length !== 42) return console.log(`${childTokenAddress} is not a valid address`);

    const amount: string | null = prompt("Enter the total amount of Child Token to withdraw: ");
    if (!amount) return console.log("Total amount of Child Token to withdraw cannot be null");
    if (Number(amount) <= 0)
      return console.log("Total amount of Child Token to withdraw cannot be less than or equal to zero");

    /* ---------------------------- SETUP ------------------------------ */

    /* 
      SETUP ZKEVM CLIENT
    */
    const zkEvmClient: ZkEvmClient | undefined = await getZkEvmClient();
    if (zkEvmClient) {
      let childToken: ERC20 = zkEvmClient.erc20(childTokenAddress);

      /* ---------------------------- WITHDRAWAL ---------------------------- */

      /* 
        WITHDRAW CHILD TOKEN 
      */
      console.log("\n-----------------------------------------");
      console.log("WITHDRAW - CHILD TOKEN");
      console.log("-----------------------------------------\n");
      let withdrawResponse: ITransactionWriteResult = await childToken.withdraw(amount, getChildUser());
      await sleep(60000); // wait at least 60sec for state change

      console.log(`Withdraw transaction hash: `, await withdrawResponse.getTransactionHash());
      console.log(
        `Transaction details: https://zkevm.polygonscan.com/tx/${await withdrawResponse.getTransactionHash()}`
      );

      console.log("\nTokens Withdrawal successfully");
      console.log(
        `\nNext step is to Withdraw Exit, kindly store the Transaction Hash: ${await withdrawResponse.getTransactionHash()}`
      );
    } else {
      console.log("zkEvmClient is undefined");
    }
  } catch (error) {
    console.log("Error in withdrawChildToken: ", error);
  }
}

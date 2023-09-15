import { sleep } from "../utils/utilityFunctions";
import { getZkEvmClient } from "../utils/zkEvmClient";
import { getChildUser } from "../../config";
import ps from "prompt-sync";
import { ZkEvmClient, ITransactionWriteResult } from "@maticnetwork/maticjs";
import { ERC20 } from "@maticnetwork/maticjs/dist/ts/zkevm/erc20";
const prompt = ps();

export async function depositRootToken() {
  try {
    console.log("\n-----------------------------------------");
    console.log("BRIDGE ROOT TOKEN");
    console.log("-----------------------------------------\n");

    /* ---------------------------- INPUT ------------------------------ */

    const rootTokenAddress: string | null = prompt("Enter the address of Root Token to bridge: ");
    if (!rootTokenAddress) return console.log("The address of Root Token to bridge cannot be null");
    if (rootTokenAddress.length !== 42) return console.log(`${rootTokenAddress} is not a valid address`);

    const amount: string | null = prompt("Enter the total amount of Root Token to bridge: ");
    if (!amount) return console.log("Total amount of Root Token to bridge cannot be null");
    if (Number(amount) <= 0)
      return console.log("Total amount of Root Token to bridge cannot be less than or equal to zero");

    /* ---------------------------- SETUP ------------------------------ */

    /* 
      SETUP ZKEVM CLIENT
    */
    const zkEvmClient: ZkEvmClient | undefined = await getZkEvmClient();
    if (zkEvmClient) {
      let rootToken: ERC20 = zkEvmClient.erc20(rootTokenAddress, true);

      /* ---------------------------- APPROVE ---------------------------- */

      /* 
        APPROVE ROOT TOKEN 
      */
      console.log("\n-----------------------------------------");
      console.log("APPROVE - ROOT TOKEN TO BRIDGE");
      console.log("-----------------------------------------\n");
      let approveResponse: ITransactionWriteResult = await rootToken.approve(amount);
      await sleep(60000); // wait at least 60sec for state change

      console.log(`Approve transaction hash: `, await approveResponse.getTransactionHash());
      console.log(
        `Transaction details: https://goerli.etherscan.io/tx/${await approveResponse.getTransactionHash()}`
      );

      console.log("\nTokens Approved successfully");

      /* ---------------------------- DEPOSIT ---------------------------- */

      /* 
        DEPOSIT ROOT TOKEN
      */
      console.log("\n-----------------------------------------");
      console.log("DEPOSIT - ROOT TOKEN TO ZKEVM BRIDGE CONTRACT");
      console.log("-----------------------------------------\n");
      let depositResponse: ITransactionWriteResult = await rootToken.deposit(amount, getChildUser());
      console.log("Deposit transaction hash: ", await depositResponse.getTransactionHash());
      console.log(
        `Transaction details: https://goerli.etherscan.io/tx/${await depositResponse.getTransactionHash()}`
      );
      console.log(`\nTokens Deposited successfully to zkEVM Bridge Contract`);
    } else {
      console.log("zkEvmClient is undefined");
    }
  } catch (error) {
    console.log("Error in depositRootToken: ", error);
  }
}

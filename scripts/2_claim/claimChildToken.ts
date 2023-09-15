import { sleep } from "../utils/utilityFunctions";
import { getZkEvmClient } from "../utils/zkEvmClient";
import ps from "prompt-sync";
import { ERC20 } from "@maticnetwork/maticjs/dist/ts/zkevm/erc20";
import { ZkEvmClient, ITransactionWriteResult } from "@maticnetwork/maticjs";

const prompt = ps();

export async function claimChildToken() {
  try {
    console.log("\n-----------------------------------------");
    console.log("CLAIM CHILD TOKEN");
    console.log("-----------------------------------------\n");

    /* ---------------------------- INPUT ------------------------------ */

    // const rootTokenAddress = prompt("Enter the address of Root Token: ");
    // if (!rootTokenAddress) return console.log("The address of Root Token cannot be null");
    // if (rootTokenAddress.length !== 42) return console.log(`${rootTokenAddress} is not a valid address`);

    const childTokenAddress = prompt("Enter the address of Child Token: ");
    if (!childTokenAddress) return console.log("The address of Child Token cannot be null");
    if (childTokenAddress.length !== 42) return console.log(`${childTokenAddress} is not a valid address`);

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
    // const goerli = 0;
    // const orignNetwork = goerli;
    const zkEvmClient: ZkEvmClient | undefined = await getZkEvmClient();
    // const childTokenAddress = await zkEvmClient?.rootChainBridge.getMappedTokenInfo(
    //   orignNetwork,
    //   rootTokenAddress
    // );
    if (zkEvmClient) {
      let childToken: ERC20 = zkEvmClient.erc20(childTokenAddress);

      /* ---------------------------- CLAIM ---------------------------- */

      //console.log(`Mapped Child Token address: ${childTokenAddress}`);

      /* 
        CLAIM DESPOSITED ROOT TOKEN 
      */

      console.log("\n-----------------------------------------");
      console.log("CLAIM - CLAIM DESPOSITED ROOT TOKEN");
      console.log("-----------------------------------------\n");
      let claimResponse: ITransactionWriteResult = await childToken.depositClaim(transactionHash);
      await sleep(60000); // wait at least 60sec for state change
      console.log(`Claim transaction hash: `, await claimResponse.getTransactionHash());
      console.log(
        `Transaction details: https://zkevm.polygonscan.com/tx/${await claimResponse.getTransactionHash()}`
      );

      console.log("\nTokens Claimed successfully");
    } else {
      console.log("zkEvmClient is undefined");
    }
  } catch (error) {
    console.log("Error in claimChildToken: ", error);
  }
}

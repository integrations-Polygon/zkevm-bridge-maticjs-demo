import { sleep } from "../utils/sleep";
import { getZkEvmClient } from "../utils/zkEvmClient";
import ps from "prompt-sync";
const prompt = ps();

const claimChildToken = async () => {
  try {
    console.log("\n-----------------------------------------");
    console.log("CLAIM CHILD TOKEN");
    console.log("-----------------------------------------\n");

    /* ---------------------------- INPUT ------------------------------ */

    const childTokenAddress = prompt("Enter the address of bridged Child Token: ");
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
    const zkEvmClient = await getZkEvmClient();
    if (zkEvmClient) {
      let childToken = zkEvmClient.erc20(childTokenAddress);

      /* ---------------------------- CLAIM ---------------------------- */

      /* 
        CLAIM DESPOSITED ROOT TOKEN 
      */
      console.log("\n-----------------------------------------");
      console.log("CLAIM - CLAIM DESPOSITED ROOT TOKEN");
      console.log("-----------------------------------------\n");
      let claimResponse = await childToken.depositClaim(transactionHash);
      await sleep(20000); // wait at least 15 for state change in goerli
      console.log(`Claim transaction hash: `, await claimResponse.getTransactionHash());
      console.log(
        `Transaction details: https://zkevm.polygonscan.com/tx/${await claimResponse.getTransactionHash()}`
      );

      console.log("\nTokens Claimed successfully");
    } else {
      console.error("zkEvmClient is undefined");
    }
  } catch (error) {
    console.log("Error in claimChildToken: ", error);
  }
};

claimChildToken()
  .then(() => {
    console.log("\n\n---------- ENDING ALL PROCESS ----------\n\n");
    process.exit(0);
  })
  .catch((err) => {
    console.error("err", err);
    process.exit(1);
  });

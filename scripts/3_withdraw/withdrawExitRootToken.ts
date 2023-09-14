import { sleep } from "../utils/sleep";
import { getZkEvmClient } from "../utils/zkEvmClient";
import { getRootUser } from "../../config";
import ps from "prompt-sync";
const prompt = ps();

const withdrawExitRootToken = async () => {
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
    const zkEvmClient = await getZkEvmClient();
    if (zkEvmClient) {
      let rootToken = zkEvmClient.erc20(rootTokenAddress);

      /* ---------------------------- WITHDRAW EXIT ---------------------------- */

      /* 
        WITHDRAW EXIT ROOT TOKEN 
      */
      console.log("\n-----------------------------------------");
      console.log("WITHDRAWEXIT - ROOT TOKEN");
      console.log("-----------------------------------------\n");
      let withdrawExitResponse = await rootToken.withdrawExit(transactionHash);
      await sleep(20000); // wait at least 20 for state change in goerli
      console.log(`WithdrawExit transaction hash: `, await withdrawExitResponse.getTransactionHash());
      console.log(
        `Transaction details: https://goerli.etherscan.io/tx/${await withdrawExitResponse.getTransactionHash()}`
      );

      console.log("\nTokens Withdrawal Exit successfully");
    } else {
      console.error("zkEvmClient is undefined");
    }
  } catch (error) {
    console.log("Error in withdrawExitRootToken: ", error);
  }
};

withdrawExitRootToken()
  .then(() => {
    console.log("\n\n---------- ENDING ALL PROCESS ----------\n\n");
    process.exit(0);
  })
  .catch((err) => {
    console.error("err", err);
    process.exit(1);
  });

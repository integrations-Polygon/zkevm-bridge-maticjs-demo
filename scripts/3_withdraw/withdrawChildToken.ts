import { sleep } from "../utils/sleep";
import { getZkEvmClient } from "../utils/zkEvmClient";
import { getChildUser } from "../../config";
import ps from "prompt-sync";
const prompt = ps();

const withdrawChildToken = async () => {
  try {
    console.log("\n-----------------------------------------");
    console.log("WITHDRAW CHILD TOKEN");
    console.log("-----------------------------------------\n");

    /* ---------------------------- INPUT ------------------------------ */

    const childTokenAddress = prompt("Enter the address of Child Token to withdraw: ");
    if (!childTokenAddress) return console.log("The address of Child Token to withdrawl cannot be null");
    if (childTokenAddress.length !== 42) return console.log(`${childTokenAddress} is not a valid address`);

    const amount = prompt("Enter the total amount of Child Token to withdraw: ");
    if (!amount) return console.log("Total amount of Child Token to withdraw cannot be null");
    if (amount <= 0)
      return console.log("Total amount of Child Token to withdraw cannot be less than or equal to zero");

    /* ---------------------------- SETUP ------------------------------ */

    /* 
      SETUP ZKEVM CLIENT
    */
    const zkEvmClient = await getZkEvmClient();
    if (zkEvmClient) {
      let childToken = zkEvmClient.erc20(childTokenAddress);

      /* ---------------------------- WITHDRAWAL ---------------------------- */

      /* 
        WITHDRAW CHILD TOKEN 
      */
      console.log("\n-----------------------------------------");
      console.log("WITHDRAW - CHILD TOKEN");
      console.log("-----------------------------------------\n");
      let withdrawResponse = await childToken.withdraw(amount, getChildUser());
      await sleep(20000); // wait at least 15 for state change in goerli
      console.log(`Approve transaction hash: `, await withdrawResponse.getTransactionHash());
      console.log(
        `Transaction details: https://zkevm.polygonscan.com/tx/${await withdrawResponse.getTransactionHash()}`
      );

      console.log("\nTokens Withdrawal successfully");
      console.log(
        `\nNext step is to Withdraw Exit, kindly store the Transaction Hash: ${await withdrawResponse.getTransactionHash()}`
      );
    } else {
      console.error("zkEvmClient is undefined");
    }
  } catch (error) {
    console.log("Error in withdrawChildToken: ", error);
  }
};

withdrawChildToken()
  .then(() => {
    console.log("\n\n---------- ENDING ALL PROCESS ----------\n\n");
    process.exit(0);
  })
  .catch((err) => {
    console.error("err", err);
    process.exit(1);
  });

import { sleep } from "../utils/sleep";
import { getZkEvmClient } from "../utils/zkEvmClient";
import { getChildUser } from "../../config";
import ps from "prompt-sync";
const prompt = ps();

const depositRootToken = async () => {
  try {
    console.log("\n-----------------------------------------");
    console.log("BRIDGE ROOT TOKEN");
    console.log("-----------------------------------------\n");

    /* ---------------------------- INPUT ------------------------------ */

    const rootTokenAddress = prompt("Enter the address of Root Token to bridge: ");
    if (!rootTokenAddress) return console.log("The address of Root Token to bridge cannot be null");

    const amount = prompt("Enter the total amount of Root Token to bridge: ");
    if (!amount) return console.log("Total amount of Root Token to bridge cannot be null");
    if (amount <= 0)
      return console.log("Total amount of Root Token to bridge cannot be less than or equal to zero");

    /* ---------------------------- SETUP ------------------------------ */

    /* 
      SETUP ZKEVM CLIENT
    */
    const zkEvmClient = await getZkEvmClient();
    if (zkEvmClient) {
      let rootToken = await zkEvmClient.erc20(rootTokenAddress, true);

      /* ---------------------------- APPROVE ---------------------------- */

      /* 
        APPROVE ERC721 PREDICATE CONTRACT 
      */
      console.log("\n-----------------------------------------");
      console.log("APPROVE - ROOT TOKEN TO BRIDGE");
      console.log("-----------------------------------------\n");
      let approveResponse = await rootToken.approve(amount);
      await sleep(20000); // wait at least 15 for state change in goerli
      console.log(`Approve transaction hash: `, await approveResponse.getTransactionHash());
      console.log(
        `Transaction details: https://goerli.etherscan.io/tx/${await approveResponse.getTransactionHash()}`
      );

      console.log("\nTokens Approved successfully");

      /* ---------------------------- DEPOSIT ---------------------------- */

      /* 
              DEPOSIT NFT
          */
      console.log("\n-----------------------------------------");
      console.log("DEPOSIT - ROOT TOKEN TO ZKEVM BRIDGE CONTRACT");
      console.log("-----------------------------------------\n");
      let depositResponse = await rootToken.deposit(amount, getChildUser());
      console.log("Deposit transaction hash: ", await depositResponse.getTransactionHash());
      console.log(
        `Transaction details: https://goerli.etherscan.io/tx/${await depositResponse.getTransactionHash()}`
      );
      console.log(`\nTokens Deposited successfully to zkEVM Bridge Contract`);
    } else {
      console.error("zkEvmClient is undefined");
    }
  } catch (error) {
    console.log("Error in despositERC721: ", error);
  }
};

depositRootToken()
  .then(() => {
    console.log("\n\n---------- ENDING ALL PROCESS ----------\n\n");
    process.exit(0);
  })
  .catch((err) => {
    console.error("err", err);
    process.exit(1);
  });

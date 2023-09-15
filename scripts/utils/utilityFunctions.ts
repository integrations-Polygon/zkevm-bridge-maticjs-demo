import { ZkEvmClient } from "@maticnetwork/maticjs";
import { getZkEvmClient } from "./zkEvmClient";
import ps from "prompt-sync";
const prompt = ps();
import { waitForKeyPress } from "./waitForUserInput";

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function MappedTokenInfo() {
  try {
    console.log("\n");

    /* ---------------------------- INPUT ------------------------------ */

    const rootTokenAddress = prompt("Enter the address of Root Token: ");
    if (!rootTokenAddress) return console.log("The address of Root Token cannot be null");
    if (rootTokenAddress.length !== 42) return console.log(`${rootTokenAddress} is not a valid address`);

    /* ---------------------------- SETUP ------------------------------ */

    /* 
      SETUP ZKEVM CLIENT
    */
    const goerli = 0;
    const orignNetwork = goerli;
    const zkEvmClient: ZkEvmClient | undefined = await getZkEvmClient();

    /* ---------------------------- MAPPING INFO ------------------------------ */

    const childTokenAddress = await zkEvmClient?.rootChainBridge.getMappedTokenInfo(
      orignNetwork,
      rootTokenAddress
    );

    if (zkEvmClient && childTokenAddress) {
      console.log(`Mapped Child Token address: ${childTokenAddress}`);
      await waitForKeyPress();
      console.clear();
    } else {
      console.log("zkEvmClient is undefined");
    }
  } catch (error) {
    console.log(`Error at MappedTokenInfo: ${error}`);
  }
}

// IS ACTUALLY ASSETING BEING MINTED ON L2 AND TRANSFERRED TO USER ON L2
export async function hasDeposited() {
  try {
    console.log("\n");
    /* ---------------------------- INPUT ------------------------------ */

    const transactionHash = prompt(
      "Enter the transaction hash of the deposited Root Token to check if it has deposited: "
    );
    if (!transactionHash) return console.log("The transaction hash of Root Token desposit cannot be null");
    if (transactionHash.length !== 66)
      return console.log(`${transactionHash} is not a valid transaction hash`);

    /* ---------------------------- SETUP ------------------------------ */

    /* 
      SETUP ZKEVM CLIENT
    */
    const zkEvmClient: ZkEvmClient | undefined = await getZkEvmClient();
    if (zkEvmClient) {
      /* ---------------------------- IS DEPOSITED ---------------------------- */

      /* 
        CHECK IF ROOT TOKEN IS DEPOSITED 
      */
      const hasDeposit: string = await zkEvmClient?.isDeposited(transactionHash);
      console.log(`Token Deposited on L1 zkEVM bridge contract: ${hasDeposit}`);
      await waitForKeyPress();
      console.clear();
    } else {
      console.log("zkEvmClient is undefined");
    }
  } catch (error) {
    console.log(`Error at hasExited: ${error}`);
  }
}

// IS ACTUALLY ASSETING BEING MINTED ON L2 AND TRANSFERRED TO USER ON L2
export async function isClaimable() {
  console.log("\n");
  try {
    /* ---------------------------- INPUT ------------------------------ */

    const transactionHash = prompt(
      "Enter the transaction hash of the deposited Root Token to check if its claimable on L2: "
    );
    if (!transactionHash) return console.log("The transaction hash of Root Token desposit cannot be null");
    if (transactionHash.length !== 66)
      return console.log(`${transactionHash} is not a valid transaction hash`);

    /* ---------------------------- SETUP ------------------------------ */

    /* 
      SETUP ZKEVM CLIENT
    */
    const zkEvmClient: ZkEvmClient | undefined = await getZkEvmClient();
    if (zkEvmClient) {
      /* ---------------------------- IS CLAIMABLE ---------------------------- */

      /* 
        CHECK IF ROOT TOKEN IS CLAIMABLE ON L2 
      */
      const isClaimable: string = await zkEvmClient?.isDepositClaimable(transactionHash);
      console.log(`Token is Claimable on L2 zkEVM brdige: ${isClaimable}`);
      await waitForKeyPress();
      console.clear();
    } else {
      console.log("zkEvmClient is undefined");
    }
  } catch (error) {
    console.log(`Error at isClaimable: ${error}`);
  }
}

export async function hasExited() {
  console.log("\n");
  try {
    /* ---------------------------- INPUT ------------------------------ */

    const transactionHash = prompt(
      "Enter the transaction hash of the withdrawn Child Token to check if its can be Exited on L1: "
    );
    if (!transactionHash) return console.log("The transaction hash of withdrawn Child Token cannot be null");
    if (transactionHash.length !== 66)
      return console.log(`${transactionHash} is not a valid transaction hash`);

    /* ---------------------------- SETUP ------------------------------ */

    /* 
      SETUP ZKEVM CLIENT
    */
    const zkEvmClient: ZkEvmClient | undefined = await getZkEvmClient();
    if (zkEvmClient) {
      /* ---------------------------- HAS EXITED ---------------------------- */

      /* 
        CHECK IF WITHDRAWN CHILD TOKEN CAN BE EXITED ON L1 
      */
      const hasExited: string = await zkEvmClient?.isWithdrawExitable(transactionHash);
      console.log(`Can withdrawn Child Token be exited on L1: ${hasExited}`);
      await waitForKeyPress();
      console.clear();
    } else {
      console.log("zkEvmClient is undefined");
    }
  } catch (error) {
    console.log(`Error at hasExited: ${error}`);
  }
}

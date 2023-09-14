import {
  getRootUser,
  getChildUser,
  getPrivateKeyGoerli,
  getPrivateKeyZkEvm,
  getInfuraProjectId,
  getZkEvmRpcUrl,
} from "../../config";
import { use, ZkEvmClient } from "@maticnetwork/maticjs";
import HDWalletProvider from "@truffle/hdwallet-provider";
import { Web3ClientPlugin } from "@maticnetwork/maticjs-ethers";

use(Web3ClientPlugin);

export async function getZkEvmClient(network = "testnet", version = "mumbai") {
  try {
    const zkEvmClient = new ZkEvmClient();
    return await zkEvmClient.init({
      network: network,
      version: version,
      parent: {
        provider: new HDWalletProvider(
          getPrivateKeyGoerli(),
          `https://goerli.infura.io/v3/${getInfuraProjectId()}`
        ),
        defaultConfig: {
          from: getRootUser(),
        },
      },
      child: {
        provider: new HDWalletProvider(getPrivateKeyZkEvm(), getZkEvmRpcUrl()),
        defaultConfig: {
          from: getChildUser(),
        },
      },
    });
  } catch (error) {
    console.log("error unable to initiate fxPortalClient", error);
  }
}

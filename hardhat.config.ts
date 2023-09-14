import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "solidity-coverage";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-etherscan";
import {
  getExplorerApiKeyGoerli,
  getPrivateKeyGoerli,
  getZkEvmRpcUrl,
  getExplorerApiKeyZkEvm,
  getInfuraProjectId,
  getPrivateKeyZkEvm,
} from "./config";

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.21",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    zkEVM: {
      url: getZkEvmRpcUrl(),
      gasPrice: "auto",
      accounts: getPrivateKeyZkEvm() !== undefined ? [getPrivateKeyZkEvm()] : [],
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${getInfuraProjectId()}`,
      gasPrice: "auto",
      accounts: getPrivateKeyGoerli() !== undefined ? [getPrivateKeyGoerli()] : [],
    },
  },
  paths: {
    sources: "src",
  },
  typechain: {
    outDir: "src/types",
    target: "ethers-v5",
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    //apiKey: getExplorerApiKeyGoerli() || "",
    apiKey: getExplorerApiKeyZkEvm() || "",
    customChains: [
      {
        network: "zkEVM",
        chainId: 1422,
        urls: {
          apiURL: "https://api-zkevm.polygonscan.com/api",
          browserURL: "https://zkevm.polygonscan.com/",
        },
      },
    ],
  },
};

export default config;

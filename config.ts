import { config } from "dotenv";
config();

export const getRootUser = () => {
  const rootUser = process.env.ROOT_USER;

  if (!rootUser) {
    throw new Error("ROOT_USER environment variable is not set.");
  }

  return rootUser;
};

export const getChildUser = (): string => {
  const childUser = process.env.CHILD_USER;

  if (!childUser) {
    throw new Error("CHILD_USER environment variable is not set.");
  }

  return childUser;
};

export const getInfuraProjectId = (): string => {
  const infuraProjectId = process.env.INFURA_PROJECT_ID;

  if (!infuraProjectId) {
    throw new Error("INFURA_PROJECT_ID environment variable is not set.");
  }

  return infuraProjectId;
};

export const getZkEvmRpcUrl = (): string => {
  const zkEvmRpcUrl = process.env.ZKEVM_RPC_URL;

  if (!zkEvmRpcUrl) {
    throw new Error("ZKEVM_RPC_URL environment variable is not set.");
  }

  return zkEvmRpcUrl;
};

export const getExplorerApiKeyZkEvm = (): string => {
  const explorerApiKeyZkEvm = process.env.EXPLORER_API_KEY_ZKEVM;

  if (!explorerApiKeyZkEvm) {
    throw new Error("EXPLORER_API_KEY_ZKEVM environment variable is not set.");
  }

  return explorerApiKeyZkEvm;
};

export const getExplorerApiKeyGoerli = (): string => {
  const explorerApiKeyGoerli = process.env.EXPLORER_API_KEY_GOERLI;

  if (!explorerApiKeyGoerli) {
    throw new Error("EXPLORER_API_KEY_GOERLI environment variable is not set.");
  }

  return explorerApiKeyGoerli;
};

export const getPrivateKeyZkEvm = (): string => {
  const privateKeyZkEvm = process.env.PRIVATE_KEY_ZKEVM;

  if (!privateKeyZkEvm) {
    throw new Error("PRIVATE_KEY_ZKEVM environment variable is not set.");
  }

  return privateKeyZkEvm;
};

export const getPrivateKeyGoerli = (): string => {
  const privateKeyGoerli = process.env.PRIVATE_KEY_GOERLI;

  if (!privateKeyGoerli) {
    throw new Error("PRIVATE_KEY_GOERLI environment variable is not set.");
  }

  return privateKeyGoerli;
};

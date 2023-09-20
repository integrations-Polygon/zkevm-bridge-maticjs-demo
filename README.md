# Polygon zkEVM Bridge Client using Maticjs SDK

This repository contains all the necessary steps to deploy a sample ERC20 token to Goerli and use Polygon zkEVM bridge client to bridge assets from Ethereum Goerli testnet L1 to Polygon zkEVM testnet L2. **This** script provides an interactive CLI for interacting with the zkEVM bridge. It facilitates various operations and utility functions concerning the ERC20 token.

## GETTING STARTED

- Clone this repository

```bash
git clone https://github.com/integrations-Polygon/zkevm-bridge-maticjs-demo.git
```

- Navigate to `zkevm-bridge-maticjs-demo` folder

```bash
cd zkevm-bridge-maticjs-demo
```

- Install dependencies

```bash
yarn
```

- Create `.env` file

```bash
cp .example.env .env
```

- Configure environment variables in `.env`

```
ROOT_USER=<root-user-address>
CHILD_USER=<child-user-address>
ZKEVM_RPC_URL=<zkevm-rpc-url>
INFURA_PROJECT_ID=<infura-project-id>
PRIVATE_KEY_ZKEVM=<private-key-polygon>
PRIVATE_KEY_GOERLI=<private-key-goerli>
EXPLORER_API_KEY_GOERLI=<api-key-ethereum>
```

- Compile the smart contract and its types

```bash
npx hardhat compile
```

- Deploy the ERC20TestToken smart contract on Goerli

```bash
npx hardhat run --network goerli scripts/0_deploy/deploy_rootToken.ts
```
### **Operations Supported:**

1. **Deposit Root Token on L1 zkEVM bridge.**

   - Provide the root token address and amount you want to bridge. The script will handle token approval and the deposit to the bridge.

2. **Claim deposited Root Token on L2 zkEVM bridge.**

   - After depositing on L1, use this to claim the equivalent amount on L2 by providing the child token address and the transaction hash of your L1 deposit.

3. **Withdraw Child Token on L2 zkEVM bridge.**

   - Provide the child token address and amount you want to withdraw. The token will be burned on L2, and a corresponding claim will be available on L1.

4. **WithdrawExit Root Token on L1 zkEVM bridge.**
   - After burning on L2, use this function to claim the tokens back on L1 by providing the root token address and the transaction hash of your L2 withdrawal.

### **Utility Functions:**

5. **View zkEVM bridge configuration.**

   - Displays chain IDs and bridge contract addresses for both L1 and L2.

6. **Check if Root Token has deposited on L1 zkEVM bridge contract.**

   - Verify if your root token deposit transaction has been recognized by the bridge by providing the transaction hash.

7. **Check if Root Token is Claimable on L2.**

   - Check if your deposited token on L1 can be claimed on L2 by providing the deposit transaction hash.

8. **Check Root Token to Child Token Mapping.**

   - Provide a root token address to get its corresponding child token address on L2.

9. **Check if withdrawn Child Token can exit on L1 zkEVM bridge contract.**

   - After withdrawing on L2, verify if the tokens can be claimed back on L1 by providing the withdrawal transaction hash.

10. **Exit Script.**

- Use this to safely terminate the script.

### **Requirements**
- To interact with the bridge, you'll need:
   - Valid Ethereum addresses for Root and Child tokens.
   - A transaction hash, for certain operations.
   - Ensure that provided addresses and transaction hashes are valid to avoid errors.
   
### **Note**
- The script incorporates waits (sleep(60000)) to accommodate for state changes that might take up to 60 seconds.
- Always ensure that the zkEvmClient is defined before performing operations. This client is responsible for interactions with the zkEVM bridge.


### **Usage:**

1. Start the script.

```bash
npx hardhat run scripts/startScript.ts
```

2. Follow the on-screen prompts to choose your desired operation.

3. When prompted, provide the required inputs such as addresses and transaction hashes.

4. The script will display the result of the operation and/or provide you with a link to view the transaction details on Etherscan or Polygonscan.

### **Errors & Troubleshooting:**

- Always ensure you're providing valid Ethereum addresses (42 characters long) and valid transaction hashes (66 characters long).
- If you encounter any errors during any operation, the script will display an error message. Read the error details to understand and rectify the issue.

For further assistance, please refer to the zkEVM bridge's official documentation or contact support.

### **Feedback & Limitations:**

- **[depositClaim()](https://wiki.polygon.technology/docs/zkevm/maticjs/zkevm-client-erc20/#depositclaim)** - While this method is referenced in the ERC20 Methods section of the documentation, it doesn't currently specify that the **"claim"** process is automated and the users don’t have to explicitly call this method. This omission can mislead new developers who rely on the documentation for scripting, causing them to mistakenly incorporate this method into their codes. Often, this results in errors, primarily because the claim either isn't claimable or has already been auto-claimed. The error messages provided are cryptic, often presenting as hexadecimal codes, making it challenging for developers to decipher the issue.

- **[Calling ERC 20 Method](https://wiki.polygon.technology/docs/zkevm/maticjs/zkevm-client-erc20/#calling-erc20-method) Passing second argument for isRoot is optional** - This statement alerts users to an important detail, yet it doesn't clarify the default value for **isRoot** or specify its usage context. Additionally, the Maticjs client references the argument as **isParent**, not **isRoot**, adding to potential confusion.

- **getMappedTokenInfo()** - This method is located in the Maticjs zkEvm bridge client, specifically under *zkevm_bridge.d.ts*. The accompanying comments suggest it's designed to retrieve the token address created by the bridge contract on the non-origin chain. However, it consistently returns a 0x00 address. It's unclear whether the method is functioning correctly or because there's a lack of guidance on its proper implementation.

- **precalculatedMappedTokenInfo()** - Within the Maticjs zkEvm bridge client, there's a method outlined in *zkevm_bridge.d.ts*. Given that the preceding method didn't yield the expected results, this method has garnered interest. The comment indicates that even if the wrapped contract isn't live on the destination chain, this function predicts its forthcoming address. However, a discrepancy arises in the method's definition: while zkevm_bridge.d.ts specifies the need for only two arguments—originNetwork: number and originTokenAddress: string—actual implementation results in an error indicating a requirement for five parameters. This raises questions about the method's accuracy, potential discrepancies in its definition, or perhaps a gap in instructions for its correct usage.

- **isDeposited()** - Located in the Maticjs zkEvm bridge client, as specified in *zkevm_bridge_client.d.ts*, this method examines if a give txHash has been deposited or not and it checks if a deposit has been completed. While one would expect it to return true immediately after a successful deposit from a user's address to the bridge contract, this is not the case. Instead, it returns true only once the asset is minted on L2 and moved to the user's L2 address. Given this behavior, a more descriptive name for this method might be preferable.

- **isDepositClaimable()** - Also found in the Maticjs zkEvm bridge client, as specified in *zkevm_bridge_client.d.ts*, this method examines if a given txHash is synchronized with the child chain. Although one would assume it returns true as soon as the deposit becomes claimable on L2, in practice, it returns true only when the asset is minted on L2 and transferred to the L2 user. This is often less noticeable since claiming is typically instantaneous and automated. However, in our scenario, both **isDeposited()** and **isDepositClaimable()** yield almost identical results, which can be confusing. A renaming to better reflect its actual functionality might be 

### **Contributing**:
If you encounter any issues or have suggestions for improvements, please open an issue or submit a pull request. We welcome community contributions.

  
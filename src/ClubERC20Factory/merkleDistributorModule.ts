import merkleDistributorModule_ABI from "src/contracts/MerkleDistributorModule.json";

import { getGnosisTxnInfo } from "./shared/gnosisTransactionInfo";

export class MerkleDistributorModuleContract {
  isGnosisSafe: boolean;
  // This will be used to call other functions. eg mint
  contract;

  // initialize a contract instance
  constructor(contractAddress: string, web3: any) {
    this.contract = new web3.eth.Contract(
      merkleDistributorModule_ABI,
      contractAddress,
    );
    this.isGnosisSafe =
      web3._provider.wc?._peerMeta.name === "Gnosis Safe Multisig";
  }

  async depositToken(clubAddress: string): Promise<string> {
    return await this.contract.methods.depositToken(clubAddress).call();
  }

  /**
   * When a member makes a deposit, we mint tokens equivalent to the deposit/
   * mint amount and then transfer the tokens to the caller address.
   *
   * Note: All validation should be handled before calling this method.
   *
   * @param amount
   * @param clubAddress
   * @param ownerAddress
   * @param onTxConfirm
   * @param onTxReceipt
   */
  async claim(
    ownerAddress: string,
    clubAddress: string,
    amount: string,
    index: number,
    merkleProof: [],
    onTxReceipt: (receipt?) => void,
  ): Promise<string> {
    return await new Promise((resolve, reject) => {
      this.contract.methods
        .claim(clubAddress, amount, index, merkleProof)
        .send({ from: ownerAddress })
        .on("receipt", onTxReceipt)
        .on("error", reject)
        .on("transactionHash", async (transactionHash) => {
          if (!this.isGnosisSafe) {
            return resolve(transactionHash);
          }

          // Stop waiting if we are connected to gnosis safe via walletConnect
          const receipt: any = await getGnosisTxnInfo(transactionHash);
          if (receipt.isSuccessful) {
            onTxReceipt(receipt);
            resolve(transactionHash);
          } else {
            reject("Receipt failed");
          }
        });
    });
  }
}

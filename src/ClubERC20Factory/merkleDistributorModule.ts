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

  /**
   * When a member makes a deposit, we mint tokens equivalent to the deposit/
   * mint amount and then transfer the tokens to the caller address.
   *
   * Note: All validation should be handled before calling this method.
   *
   * @param amount
   * @param clubAddress
   * @param forAddress
   * @param onTxConfirm
   * @param onTxReceipt
   */
  claim = async (
    forAddress: string,
    clubAddress: string,
    amount: string,
    index: number,
    merkleProof: string[],
    onTxReceipt: (receipt?) => void,
  ): Promise<string> =>
    new Promise((resolve, reject) =>
      this.contract.methods
        .claim(clubAddress, 0, amount, index, merkleProof)
        .send({ from: forAddress })
        .on("receipt", onTxReceipt)
        .on("error", reject)
        .on("transactionHash", async (transactionHash: string) => {
          if (!this.isGnosisSafe) {
            return resolve(transactionHash);
          }

          // Stop waiting if we are connected to gnosis safe via walletConnect
          const receipt = await getGnosisTxnInfo(transactionHash);
          if (!(receipt as { isSuccessful: boolean }).isSuccessful) {
            return reject("Receipt failed");
          }

          onTxReceipt(receipt);
          return resolve(transactionHash);
        }),
    );
}

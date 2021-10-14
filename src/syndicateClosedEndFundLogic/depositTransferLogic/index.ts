import DepositTransferLogicABI from "src/contracts/SyndicateClosedEndFundDepositTransferLogicV0.json";
import { BaseLogicContract } from "../baseLogicContract";
import { getGnosisTxnInfo } from "../shared/gnosisTransactionInfo";

export class SyndicateDepositTransferLogic extends BaseLogicContract {
  constructor(contractName: string, web3: any) {
    super(contractName, web3, DepositTransferLogicABI.abi);
    this.initializeLogicContract();
  }

  /**
   *
   * @param syndicateAddress
   * @param memberAddress
   * @param targetAddress
   * @param amount
   * @param manager
   * @param onTxConfirm
   * @param onTxReceipt
   * @returns
   */
  async managerTransferDepositForMembers(
    syndicateAddress: string,
    memberAddress: string,
    targetAddress: string,
    amount: string,
    manager: string,
    onTxConfirm: () => void,
    onTxReceipt: () => void,
  ): Promise<void> {
    if (
      !syndicateAddress.trim() ||
      !memberAddress.trim() ||
      !targetAddress.trim() ||
      !amount
    )
      return;
    let gnosisTxHash;
    await new Promise((resolve, reject) => {
      this.logicContractInstance.methods
        .managerTransferDepositForMembers(
          syndicateAddress,
          memberAddress,
          targetAddress,
          amount,
        )
        .send({
          from: manager,
        })
        .on("transactionHash", (transactionHash) => {
          // user has confirmed the transaction so we should start loader state.
          // show loading modal
          onTxConfirm();

          // Stop waiting if we are connected to gnosis safe via walletConnect
          if (
            this.web3._provider.wc?._peerMeta.name === "Gnosis Safe Multisig"
          ) {
            gnosisTxHash = transactionHash;
            resolve(transactionHash);
          }
        })
        .on("receipt", (receipt) => {
          onTxReceipt();
          resolve(receipt);
        })
        .on("error", (error) => {
          reject(error);
        });
    });

    // fallback for gnosisSafe <> walletConnect
    if (gnosisTxHash) {
      await getGnosisTxnInfo(gnosisTxHash);
      onTxReceipt();
    }
  }

  async getDepositTransferredEvents(
    depositTransferEventName: string,
    filter = {},
  ): Promise<Array<unknown>> {
    if (!depositTransferEventName.trim()) return [];

    try {
      return await this.logicContractInstance.getPastEvents(
        depositTransferEventName,
        {
          filter,
          fromBlock: "earliest",
          toBlock: "latest",
        },
      );
    } catch (error) {
      return [];
    }
  }
}

import DepositLogicABI from "src/contracts/SyndicateClosedEndFundDepositLogicV0.json";
import { BaseLogicContract } from "../baseLogicContract";
import { getGnosisTxnInfo } from "../shared/gnosisTransactionInfo";

export class SyndicateDepositLogic extends BaseLogicContract {
  constructor(contractName: string, web3: any) {
    super(contractName, web3, DepositLogicABI.abi);
    this.initializeLogicContract();
  }

  /**
   * Handle member deposits into a syndicate.
   */
  async deposit({
    syndicateAddress,
    amount,
    account,
    setMetamaskConfirmPending,
    setSubmitting,
    setTransactionHash,
  }: {
    syndicateAddress: string;
    amount: string;
    account: string;
    setMetamaskConfirmPending: (value: boolean) => void;
    setSubmitting: (value: boolean) => void;
    setTransactionHash: (value: string) => void;
  }): Promise<void> {
    let gnosisTxHash;
    await new Promise((resolve, reject) => {
      this.logicContractInstance.methods
        .memberDeposit(syndicateAddress, amount)
        .send({ from: account })
        .on("transactionHash", (transactionHash) => {
          // user has confirmed the transaction so we should start loader state.
          // show loading modal
          setMetamaskConfirmPending(false);
          setSubmitting(true);

          // Stop waiting if we are connected to gnosis safe via walletConnect
          if (
            this.web3._provider.wc?._peerMeta.name === "Gnosis Safe Multisig"
          ) {
            setTransactionHash("");
            gnosisTxHash = transactionHash;
            resolve(transactionHash);
          }

          setTransactionHash(transactionHash);
        })
        .on("receipt", (receipt) => {
          setMetamaskConfirmPending(false);
          setSubmitting(false);
          resolve(receipt);
        })
        .on("error", (error) => {
          setMetamaskConfirmPending(false);
          setSubmitting(false);
          reject(error);
        });
    });

    // fallback for gnosisSafe <> walletConnect
    if (gnosisTxHash) {
      const receipt: any = await getGnosisTxnInfo(gnosisTxHash);
      setTransactionHash(receipt.transactionHash);
    }
  }

  /**
   * Retrieve events associated with member deposit
   *
   * @param {string} depositEventName name of events to retrieve.
   * @returns {array} all emitted events for the specified event name.
   */
  async getMemberDepositEvents(
    depositEventName: string,
    filter = {},
  ): Promise<Array<unknown>> {
    if (!depositEventName.trim()) return [];

    try {
      const memberDepositEvents =
        await this.logicContractInstance.getPastEvents(depositEventName, {
          filter,
          fromBlock: "earliest",
          toBlock: "latest",
        });
      return [...memberDepositEvents];
    } catch (error) {
      return [];
    }
  }

  /**
   * Handles deposit withdrawals before syndicate is closed and
   * all deposits are invested.
   *
   * For withdrawal when syndicate is closed, use
   * distributionLogic contract.
   *
   * @param syndicateAddress
   * @param amount
   * @param account
   * @param dispatch
   * @returns
   */
  async withdrawMemberDeposit(
    syndicateAddress: string,
    amount: string,
    account: string,
    setMetamaskConfirmPending: (arg0: boolean) => void,
    setSubmittingWithdrawal: (arg0: boolean) => void,
  ): Promise<void> {
    if (!syndicateAddress.trim() || !account || !amount || amount == "0") {
      return;
    }
    await this.logicContractInstance.methods
      .memberWithdraw(syndicateAddress, amount)
      .send({ from: account })
      .on("transactionHash", () => {
        setMetamaskConfirmPending(false);
        setSubmittingWithdrawal(true);
      });
  }

  /**
   * Handles rejecting member deposits
   * @param syndicateAddress
   * @param {array} memberAddresses
   * @param manager
   * @param setShowWalletConfirmationModal
   * @param setSubmitting
   * @returns
   */
  async managerRejectDepositForMembers(
    syndicateAddress: string,
    memberAddresses: Array<string>,
    manager: string,
    setShowWalletConfirmationModal: (status: boolean) => void,
    setSubmitting: (arg0: boolean) => void,
    handleReceipt: () => void,
  ): Promise<void> {
    if (!syndicateAddress.trim() || !memberAddresses.length) return;

    let gnosisTxHash;
    await new Promise((resolve, reject) => {
      this.logicContractInstance.methods
        .managerRejectDepositForMembers(syndicateAddress, memberAddresses)
        .send({ from: manager })
        .on("transactionHash", (transactionHash) => {
          // close wallet confirmation modal
          setShowWalletConfirmationModal(false);
          setSubmitting(true);

          // Stop waiting if we are connected to gnosis safe via walletConnect
          if (
            this.web3._provider.wc?._peerMeta.name === "Gnosis Safe Multisig"
          ) {
            gnosisTxHash = transactionHash;
            resolve(transactionHash);
          }
        })
        .on("receipt", (receipt) => {
          handleReceipt();
          resolve(receipt);
        })
        .on("error", (error) => {
          reject(error);
        });
    });

    // fallback for gnosisSafe <> walletConnect
    if (gnosisTxHash) {
      await getGnosisTxnInfo(gnosisTxHash);
    }
    setSubmitting(false);
  }

  /**
   * Used by a manager to manually adjust the deposit amount for
   * multiple member address (e.g. in response to off-chain transactions).
   *
   * @param syndicateAddress
   * @param memberAddresses
   * @param memberAmounts
   * @param manager
   * @param setShowWalletConfirmationModal
   * @param setSubmitting
   * @returns
   */
  async managerSetDepositForMembers(
    syndicateAddress: string,
    memberAddresses: string[],
    memberAmounts: string[],
    manager: string,
    setShowWalletConfirmationModal: (arg0: boolean) => void,
    onTxConfirm: (arg0: boolean) => void,
    onTxReceipt: () => void,
  ): Promise<void> {
    if (
      !syndicateAddress.trim() ||
      !memberAddresses.length ||
      !memberAmounts.length ||
      !manager.trim()
    ) {
      return;
    }

    let gnosisTxHash;
    await new Promise((resolve, reject) => {
      this.logicContractInstance.methods
        .managerSetDepositForMembers(
          syndicateAddress,
          memberAddresses,
          memberAmounts,
        )
        .send({ from: manager })
        .on("transactionHash", (transactionHash) => {
          setShowWalletConfirmationModal(false);
          onTxConfirm(true);

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

  /**
   * Set the maximum deposit per wallet address
   *
   * @param {string} syndicateAddress
   * @param {number} depositMemberMax
   * @param manager
   * @param setShowWalletConfirmationModal
   * @param setSubmitting
   */
  async managerSetDepositMemberMax(
    syndicateAddress,
    depositMemberMax,
    manager: string,
    setShowWalletConfirmationModal,
    setSubmitting,
  ) {
    if (!syndicateAddress.trim()) return;

    setShowWalletConfirmationModal(true);

    let gnosisTxHash;
    await new Promise((resolve, reject) => {
      this.logicContractInstance.methods
        .managerSetDepositMemberMax(syndicateAddress, depositMemberMax)
        .send({ from: manager })
        .on("transactionHash", (transactionHash) => {
          setShowWalletConfirmationModal(false);
          setSubmitting(true);

          // Stop waiting if we are connected to gnosis safe via walletConnect
          if (
            this.web3._provider.wc?._peerMeta.name === "Gnosis Safe Multisig"
          ) {
            gnosisTxHash = transactionHash;
            resolve(transactionHash);
          }
        })
        .on("receipt", (receipt) => {
          resolve(receipt);
        })
        .on("error", (error) => {
          reject(error);
        });
    });

    // fallback for gnosisSafe <> walletConnect
    if (gnosisTxHash) {
      await getGnosisTxnInfo(gnosisTxHash);
    }
    setSubmitting(false);
  }

  /**
   * Set the maximum total deposit amount.
   *
   * @param {string} syndicateAddress
   * @param {number} depositTotalMax
   * @param manager
   * @param setShowWalletConfirmationModal
   * @param setSubmitting
   */
  async managerSetDepositTotalMax(
    syndicateAddress,
    depositTotalMax,
    manager: string,
    setShowWalletConfirmationModal,
    setSubmitting,
  ) {
    if (!syndicateAddress.trim()) return;

    setShowWalletConfirmationModal(true);

    let gnosisTxHash;
    await new Promise((resolve, reject) => {
      this.logicContractInstance.methods
        .managerSetDepositTotalMax(syndicateAddress, depositTotalMax)
        .send({ from: manager })
        .on("transactionHash", (transactionHash) => {
          setShowWalletConfirmationModal(false);
          setSubmitting(true);

          // Stop waiting if we are connected to gnosis safe via walletConnect
          if (
            this.web3._provider.wc?._peerMeta.name === "Gnosis Safe Multisig"
          ) {
            gnosisTxHash = transactionHash;
            resolve(transactionHash);
          }
        })
        .on("receipt", (receipt) => {
          resolve(receipt);
        })
        .on("error", (error) => {
          reject(error);
        });
    });

    // fallback for gnosisSafe <> walletConnect
    if (gnosisTxHash) {
      await getGnosisTxnInfo(gnosisTxHash);
    }
    setSubmitting(false);
  }

  /**
   * Set the minimum total deposit amount.
   *
   * @param {string} syndicateAddress
   * @param {number} depositMemberMin
   * @param manager
   * @param setShowWalletConfirmationModal
   * @param setSubmitting
   */
  async managerSetDepositMemberMin(
    syndicateAddress,
    depositMemberMin,
    manager: string,
    setShowWalletConfirmationModal,
    setSubmitting,
  ) {
    if (!syndicateAddress.trim()) return;

    setShowWalletConfirmationModal(true);

    let gnosisTxHash;
    await new Promise((resolve, reject) => {
      this.logicContractInstance.methods
        .managerSetDepositMemberMin(syndicateAddress, depositMemberMin)
        .send({ from: manager })
        .on("transactionHash", (transactionHash) => {
          setShowWalletConfirmationModal(false);
          setSubmitting(true);

          // Stop waiting if we are connected to gnosis safe via walletConnect
          if (
            this.web3._provider.wc?._peerMeta.name === "Gnosis Safe Multisig"
          ) {
            gnosisTxHash = transactionHash;
            resolve(transactionHash);
          }
        })
        .on("receipt", (receipt) => {
          resolve(receipt);
        })
        .on("error", (error) => {
          reject(error);
        });
    });

    // fallback for gnosisSafe <> walletConnect
    if (gnosisTxHash) {
      await getGnosisTxnInfo(gnosisTxHash);
    }
    setSubmitting(false);
  }
}

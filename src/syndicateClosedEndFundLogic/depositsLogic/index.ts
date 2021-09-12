import DepositLogicABI from "src/contracts/SyndicateClosedEndFundDepositLogicV0.json";
import { BaseLogicContract } from "../baseLogicContract";

export class SyndicateDepositLogic extends BaseLogicContract {
  constructor(contractName: any, web3: any) {
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
  }: {
    syndicateAddress: string;
    amount: string;
    account: string;
    setMetamaskConfirmPending: (value: boolean) => void;
    setSubmitting: (value: boolean) => void;
  }): Promise<void> {
    await this.logicContractInstance.methods
      .memberDeposit(syndicateAddress, amount)
      .send({ from: account })
      .on("transactionHash", () => {
        // user has confirmed the transaction so we should start loader state.
        // show loading modal
        setMetamaskConfirmPending(false);
        setSubmitting(true);
      });
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
    await this.logicContractInstance.methods
      .managerRejectDepositForMembers(syndicateAddress, memberAddresses)
      .send({ from: manager })
      .on("transactionHash", () => {
        // close wallet confirmation modal
        setShowWalletConfirmationModal(false);
        setSubmitting(true);
      })
      .on("receipt", async () => {
        handleReceipt();
      });
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
    setSubmitting: (arg0: boolean) => void,
  ): Promise<void> {
    if (
      !syndicateAddress.trim() ||
      !memberAddresses.length ||
      !memberAmounts.length ||
      !manager.trim()
    ) {
      return;
    }
    await this.logicContractInstance.methods
      .managerSetDepositForMembers(
        syndicateAddress,
        memberAddresses,
        memberAmounts,
      )
      .send({ from: manager })
      .on("transactionHash", () => {
        setShowWalletConfirmationModal(false);
        setSubmitting(true);
      });
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

    await this.logicContractInstance.methods
      .managerSetDepositMemberMax(syndicateAddress, depositMemberMax)
      .send({ from: manager })
      .on("transactionHash", () => {
        setShowWalletConfirmationModal(false);
        setSubmitting(true);
      });
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

    await this.logicContractInstance.methods
      .managerSetDepositTotalMax(syndicateAddress, depositTotalMax)
      .send({ from: manager })
      .on("transactionHash", () => {
        setShowWalletConfirmationModal(false);
        setSubmitting(true);
      });
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

    await this.logicContractInstance.methods
      .managerSetDepositMemberMin(syndicateAddress, depositMemberMin)
      .send({ from: manager })
      .on("transactionHash", () => {
        setShowWalletConfirmationModal(false);
        setSubmitting(true);
      });
    setSubmitting(false);
  }
}

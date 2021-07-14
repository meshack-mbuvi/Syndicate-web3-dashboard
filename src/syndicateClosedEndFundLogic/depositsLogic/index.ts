import DepositLogicABI from "src/contracts/SyndicateClosedEndFundDepositLogicV0.json";
import { BaseLogicContract } from "../baseLogicContract";

export class SyndicateDepositLogic extends BaseLogicContract {
  constructor(contractName: any, contractAddress: string, web3: any) {
    super(contractName, contractAddress, web3, DepositLogicABI.abi);
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
  }) {
    try {
      await this.logicContractInstance.methods
        .memberDeposit(syndicateAddress, amount)
        .send({ from: account, gasLimit: 800000 })
        .on("transactionHash", () => {
          // user has confirmed the transaction so we should start loader state.
          // show loading modal
          setMetamaskConfirmPending(false);
          setSubmitting(true);
        });
    } catch (error) {
      setSubmitting(false);
      setMetamaskConfirmPending(false);
      throw error;
    }
  }

  /**
   * Retrieve events associated with member deposit
   *
   * @param {string} depositEventName name of events to retrieve.
   * @returns {array} all emitted events for the specified event name.
   */
  async getMemberDepositEvents(depositEventName: string, filter = {}) {
    if (!depositEventName.trim()) return [];

    try {
      const memberDepositEvents = await this.logicContractInstance.getPastEvents(
        depositEventName,
        { filter, fromBlock: "earliest", toBlock: "latest" },
      );
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
    setMetamaskConfirmPending: Function,
    setSubmittingWithdrawal: Function,
  ) {
    if (!syndicateAddress.trim() || !account || !amount || amount == "0") {
      return;
    }

    try {
      await this.logicContractInstance.methods
        .memberWithdraw(syndicateAddress, amount)
        .send({ from: account, gasLimit: 800000 })
        .on("transactionHash", () => {
          setMetamaskConfirmPending(false);
          setSubmittingWithdrawal(true);
        })
        .on("error", (error) => console.log({ error }));
    } catch (error) {
      throw error;
    }
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
    syndicateAddress,
    memberAddresses,
    manager,
    setShowWalletConfirmationModal,
    setSubmitting,
  ) {
    if (!syndicateAddress.trim() || !memberAddresses.length) return;

    try {
      await this.logicContractInstance.methods
        .managerRejectDepositForMembers(syndicateAddress, memberAddresses)
        .send({ from: manager, gasLimit: 800000 })
        .on("transactionHash", () => {
          // close wallet confirmation modal
          setShowWalletConfirmationModal(false);
          setSubmitting(true);
        })
        .on("receipt", async () => {
          setSubmitting(false);
        });
    } catch (error) {
      throw error;
    }
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
    syndicateAddress,
    memberAddresses,
    memberAmounts,
    manager,
    setShowWalletConfirmationModal,
    setSubmitting,
  ) {
    if (
      !syndicateAddress.trim() ||
      !memberAddresses.length ||
      !memberAmounts.length ||
      !manager.trim()
    ) {
      return;
    }

    try {
      await this.logicContractInstance.methods
        .managerSetDepositForMembers(
          syndicateAddress,
          memberAddresses,
          memberAmounts,
        )
        .send({ from: manager, gasLimit: 800000 })
        .on("transactionHash", () => {
          setShowWalletConfirmationModal(false);
          setSubmitting(true);
        });
    } catch (error) {
      throw error;
    }
  }
}

import managerLogicABI from "src/contracts/SyndicateClosedEndFundManagerLogicV0.json";
import { BaseLogicContract } from "../baseLogicContract";
import { CreateSyndicateData } from "../shared";

/**
 * Handles syndicate manager logic
 */
export class SyndicateManagerLogic extends BaseLogicContract {
  /**
   *
   * @param SyndicateCoordinatorInstance - contract instance of
   *  syndicate coordinator logic
   * @param web3 - an instance of web3
   * Initialize a contract instance using the provided name.
   */
  constructor(contractName: string, web3: any) {
    super(contractName, web3, managerLogicABI.abi);
    this.initializeLogicContract();
  }

  /**
   * This method handles creation of a new syndicate.
   *
   * @param syndicateData
   * @param managerAccount
   * @param dispatch
   */
  async createSyndicate(
    syndicateData: CreateSyndicateData,
    managerAccount: string,
    setShowWalletConfirmationModal: Function,
    setSubmitting: Function,
  ) {
    await this.initializeLogicContract();

    const {
      managerManagementFeeBasisPoints,
      managerPerformanceFeeBasisPoints,
      syndicateProfitShareBasisPoints,
      numMembersMax,
      depositERC20Address,
      depositMinMember,
      depositMaxMember,
      depositMaxTotal,
      dateCloseUnixTime,
      allowlistEnabled,
      modifiable,
      transferable,
    } = syndicateData;
    try {
      setShowWalletConfirmationModal(true);

      await this.logicContractInstance.methods
        .createSyndicate(
          managerManagementFeeBasisPoints,
          managerPerformanceFeeBasisPoints,
          syndicateProfitShareBasisPoints,
          numMembersMax,
          depositERC20Address,
          depositMinMember,
          depositMaxMember,
          depositMaxTotal,
          dateCloseUnixTime,
          allowlistEnabled,
          modifiable,
          transferable,
        )
        .send({ from: managerAccount })
        .on("transactionHash", () => {
          // close wallet confirmation modal
          setShowWalletConfirmationModal(false);
          setSubmitting(true);
        });
    } catch (error) {
      setShowWalletConfirmationModal(false);
      throw error;
    }
  }

  /**
   *
   * Retrieves all events emitted during syndicate creation, filters them by
   * syndicateAddress(account connected) and returns the details
   * @param syndicateAddress
   * @returns
   */
  async getSyndicatesForManager(syndicateAddress: string) {
    try {
      if (!this.logicContractInstance) {
        await this.initializeLogicContract();
      }
      const syndicateEvents = await this.logicContractInstance.getPastEvents(
        "createdSyndicate",
        {
          fromBlock: "earliest",
          filter: { syndicateAddress },
          toBlock: "latest",
        },
      );
      return syndicateEvents;
    } catch {
      return [];
    }
  }

  /**
   * Black list an address(es) so that it cannot deposit into syndicate
   *
   * @param {string} syndicateAddress
   * @param {array} memberAddresses - an array of address to be blacklisted.
   */
  async managerBlockAddresses(
    syndicateAddress,
    memberAddresses,
    manager,
    setShowWalletConfirmationModal,
    setSubmitting,
  ) {
    if (!syndicateAddress.trim() || !memberAddresses.length) return;

    try {
      setShowWalletConfirmationModal(true);

      await this.logicContractInstance.methods
        .managerBlockAddresses(syndicateAddress, memberAddresses)
        .send({ from: manager, gasLimit: 800000 })
        .on("transactionHash", () => {
          // close wallet confirmation modal
          setShowWalletConfirmationModal(false);
          setSubmitting(true);
        });
      setSubmitting(false);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param syndicateAddress The address of the Syndicate to accept the
   * allowedAdresses
   * @param memberAddresses An array of addresses to be allowed by the
   * Syndicate
   * @notice This function is only relevant when the manager has turned the
   * allowlist on (`SyndicateValues.allowlistEnabled == true`). If the
   * allowlist is off, anyone can make a deposit to the Syndicate without the
   * manager specifically allowing their address.
   * @dev Allowing a single address costs 31527 in gas without an array and
   * 32445 in gas with an array. This is a difference in cost of $0.17
   * at current gas prices, which is a worthwhile trade off considering that (a
   * allowing only one address will be less common than allowing multiple
   * addresses and (b) having two different allowAddress functions poses a
   * security risk if we forget to reconcile changes between them
   * @param manager
   * @param setShowWalletConfirmationModal A function to be triggered when
   * to disable modal
   * @param setSubmitting
   * @returns
   */
  async managerAllowAddresses(
    syndicateAddress,
    memberAddresses,
    manager,
    setShowWalletConfirmationModal,
    setSubmitting,
  ) {
    if (!syndicateAddress.trim() || !manager.trim() || !memberAddresses.length)
      return;

    try {
      setShowWalletConfirmationModal(true);
      await this.logicContractInstance.methods
        .managerAllowAddresses(syndicateAddress, memberAddresses)
        .send({ from: manager, gasLimit: 800000 })
        .on("transactionHash", () => {
          // close wallet confirmation modal
          setShowWalletConfirmationModal(false);
          setSubmitting(true);
        });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Used by manager to close an open syndicate
   *
   * @param syndicateAddress
   * @param manager
   * @param setShowWalletConfirmationModal
   * @param setSubmitting
   * @returns
   */
  async managerCloseSyndicate(
    syndicateAddress: string,
    manager: string,
    setShowWalletConfirmationModal: Function,
    setSubmitting: Function,
  ) {
    if (!syndicateAddress.trim() || !manager.trim()) return;

    try {
      await this.logicContractInstance.methods
        .managerCloseSyndicate(syndicateAddress)
        .send({ from: manager, gasLimit: 800000 })
        .on("transactionHash", () => {
          // close wallet confirmation modal
          setShowWalletConfirmationModal(false);

          setSubmitting(true);
        });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Use by a syndicate manager to updates manage fee address
   * @param syndicateAddress
   * @param managerFeeAddress
   * @param manager
   * @param setShowWalletConfirmationModal
   * @param setSavingMemberAddress
   * @returns
   */
  async managerSetManagerFeeAddress(
    syndicateAddress: string,
    managerFeeAddress: string,
    manager: string,
    setShowWalletConfirmationModal: Function,
    setSavingMemberAddress: Function,
  ) {
    if (!syndicateAddress.trim() || !managerFeeAddress.trim()) {
      return;
    }

    try {
      await this.logicContractInstance.methods
        .managerSetManagerFeeAddress(syndicateAddress, managerFeeAddress)
        .send({ from: manager, gasLimit: 800000 })
        .on("transactionHash", () => {
          setShowWalletConfirmationModal(false);
          setSavingMemberAddress(true);
        });
      setSavingMemberAddress(false);
    } catch (error) {
      setSavingMemberAddress(false);

      throw error;
    }
  }

  /**
   * Retrieve events associated with manager actions
   *
   * @param managerEventName
   * @param filter
   * @returns
   */
  async getManagerEvents(managerEventName: string, filter) {
    try {
      await this.initializeLogicContract();

      const managerEvents = await this.logicContractInstance.getPastEvents(
        managerEventName,
        {
          filter,
          fromBlock: "earliest",

          toBlock: "latest",
        },
      );

      return managerEvents;
    } catch (error) {
      return [];
    }
  }
}

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
   * @param onSuccess
   */
  async createSyndicate(
    syndicateData: CreateSyndicateData,
    managerAccount: string,
    onTxConfirm: () => void,
  ): Promise<void> {
    await this.initializeLogicContract();

    const {
      managerManagementFeeBasisPoints,
      managerDistributionShareBasisPoints,
      syndicateDistributionShareBasisPoints,
      numMembersMax,
      depositERC20Address,
      depositMemberMin,
      depositMemberMax,
      depositTotalMax,
      dateCloseUnixTime,
      allowlistEnabled,
      modifiable,
      transferable,
    } = syndicateData;

    await this.logicContractInstance.methods
      .createSyndicate(
        managerManagementFeeBasisPoints,
        managerDistributionShareBasisPoints,
        syndicateDistributionShareBasisPoints,
        numMembersMax,
        depositERC20Address,
        depositMemberMin,
        depositMemberMax,
        depositTotalMax,
        dateCloseUnixTime,
        modifiable,
        allowlistEnabled,
        transferable,
      )
      .send({ from: managerAccount })
      .on("transactionHash", () => {
        // wallet confirmation modal
        onTxConfirm();
      });
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
        "SyndicateCreated",
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
    setShowWalletConfirmationModal: (arg0: boolean) => void,
    setSubmitting: (arg0: boolean) => void,
  ): Promise<void> {
    if (!syndicateAddress.trim() || !manager.trim()) return;
    await this.logicContractInstance.methods
      .managerCloseSyndicate(syndicateAddress)
      .send({ from: manager, gasLimit: 800000 })
      .on("transactionHash", () => {
        // close wallet confirmation modal
        setShowWalletConfirmationModal(false);

        setSubmitting(true);
      });
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
    setShowWalletConfirmationModal: (arg0: boolean) => void,
    setSavingMemberAddress: (arg0: boolean) => void,
  ) {
    if (!syndicateAddress.trim() || !managerFeeAddress.trim()) {
      return;
    }

    try {
      setShowWalletConfirmationModal(true);

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
  async getManagerEvents(managerEventName: string, filter: any) {
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

  /**
   * Set the maximum members that can contribute to the Syndicate
   *
   * @param {string} syndicateAddress
   * @param {number} numMembersMax
   * @param manager
   * @param setShowWalletConfirmationModal
   * @param setSubmitting
   */
  async managerSetNumMembersMax(
    syndicateAddress,
    numMembersMax,
    manager: string,
    setShowWalletConfirmationModal,
    setSubmitting,
  ) {
    if (!syndicateAddress.trim()) return;

    try {
      setShowWalletConfirmationModal(true);

      await this.logicContractInstance.methods
        .managerSetNumMembersMax(syndicateAddress, numMembersMax)
        .send({ from: manager, gasLimit: 800000 })
        .on("transactionHash", () => {
          setShowWalletConfirmationModal(false);
          setSubmitting(true);
        });
      setSubmitting(false);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Manager update the distribution share that goes to Syndicate
   *
   * @param {string} syndicateAddress
   * @param {number} syndicateDistributionShareBasisPoints
   * @param manager
   * @param setShowWalletConfirmationModal
   * @param setSubmitting
   */
  async managerSetSyndicateDistributionShare(
    syndicateAddress,
    syndicateDistributionShareBasisPoints,
    manager: string,
    setShowWalletConfirmationModal,
    setSubmitting,
  ) {
    if (!syndicateAddress.trim()) return;

    try {
      setShowWalletConfirmationModal(true);

      await this.logicContractInstance.methods
        .managerSetSyndicateDistributionShare(
          syndicateAddress,
          syndicateDistributionShareBasisPoints,
        )
        .send({ from: manager, gasLimit: 800000 })
        .on("transactionHash", () => {
          setShowWalletConfirmationModal(false);
          setSubmitting(true);
        });
      setSubmitting(false);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Manager update fee basis points
   *
   * @param {string} syndicateAddress
   * @param {number} managerManagementFeeBasisPoints
   * @param {number} managerDistributionShareBasisPoints
   * @param manager
   * @param setShowWalletConfirmationModal
   * @param setSubmitting
   */
  async managerSetManagerFees(
    syndicateAddress,
    managerManagementFeeBasisPoints,
    managerDistributionShareBasisPoints,
    manager: string,
    setShowWalletConfirmationModal,
    setSubmitting,
  ) {
    if (!syndicateAddress.trim()) return;

    try {
      setShowWalletConfirmationModal(true);

      await this.logicContractInstance.methods
        .managerSetManagerFees(
          syndicateAddress,
          managerManagementFeeBasisPoints,
          managerDistributionShareBasisPoints,
        )
        .send({ from: manager, gasLimit: 800000 })
        .on("transactionHash", () => {
          setShowWalletConfirmationModal(false);
          setSubmitting(true);
        });
      setSubmitting(false);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Manager to nominate a new manager
   *
   * @param {string} syndicateAddress
   * @param {number} managerPendingAddress
   * @param manager
   * @param setShowWalletConfirmationModal
   * @param setSubmitting
   */
  async managerSetManagerPending(
    syndicateAddress,
    managerPendingAddress,
    manager: string,
    setShowWalletConfirmationModal,
    setSubmitting,
  ) {
    if (!syndicateAddress.trim()) return;

    try {
      setShowWalletConfirmationModal(true);

      await this.logicContractInstance.methods
        .managerSetManagerPending(syndicateAddress, managerPendingAddress)
        .send({ from: manager, gasLimit: 800000 })
        .on("transactionHash", () => {
          setShowWalletConfirmationModal(false);
          setSubmitting(true);
        });
      setSubmitting(false);
    } catch (error) {
      throw error;
    }
  }
}

import allowlistLogicABI from "src/contracts/SyndicateClosedEndFundAllowlistLogicV0.json";
import { BaseLogicContract } from "../baseLogicContract";

/**
 * Handles syndicate allowlist logic
 */
export class SyndicateAllowlistLogic extends BaseLogicContract {
  /**
   *
   * @param SyndicateCoordinatorInstance - contract instance of
   *  syndicate coordinator logic
   * @param web3 - an instance of web3
   * Initialize a contract instance using the provided name.
   */
  constructor(contractName: string, contractAddress: string, web3: any) {
    super(contractName, contractAddress, web3, allowlistLogicABI.abi);
    this.initializeLogicContract();
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
   * Retrieve events associated with allowlist actions
   *
   * @param allowlistEventName
   * @param filter
   * @returns
   */
  async getAllowlistEvents(allowlistEventName: string, filter) {
    try {
      await this.initializeLogicContract();

      const allowlistEvents = await this.logicContractInstance.getPastEvents(
        allowlistEventName,
        {
          filter,
          fromBlock: "earliest",

          toBlock: "latest",
        },
      );

      return allowlistEvents;
    } catch (error) {
      return [];
    }
  }
}

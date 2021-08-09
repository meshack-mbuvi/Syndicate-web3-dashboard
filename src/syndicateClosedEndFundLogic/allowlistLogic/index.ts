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
  constructor(contractName: string, web3: any) {
    super(contractName, web3, allowlistLogicABI.abi);
    this.initializeLogicContract();
  }

  /**
   * Black list an address(es) so that it cannot deposit into syndicate
   *
   * @param {string} syndicateAddress
   * @param {array} memberAddresses - an array of address to be blacklisted.
   */
  async managerBlockAddresses(
    syndicateAddress: string,
    memberAddresses: string[],
    manager: string,
    setShowWalletConfirmationModal: (arg0: boolean) => void,
    setSubmitting: (arg0: boolean) => void,
  ): Promise<void> {
    if (!syndicateAddress.trim() || !memberAddresses.length) return;
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
   * @param cb A callback function that is called once the method succeeds
   * @returns
   */
  async managerAllowAddresses(
    syndicateAddress: string,
    memberAddresses: string[],
    manager: string,
    onTxConfirm: () => void,
  ): Promise<void> {
    if (
      !syndicateAddress.trim() ||
      !manager.trim() ||
      !memberAddresses.length
    ) {
      return;
    }
    await this.logicContractInstance.methods
      .managerAllowAddresses(syndicateAddress, memberAddresses)
      .send({ from: manager, gasLimit: 800000 })
      .on("transactionHash", () => {
        // close wallet confirmation modal
        onTxConfirm();
      });
  }

  /**
   * Retrieve events associated with allowlist actions
   *
   * @param allowlistEventName
   * @param filter
   * @returns
   */
  async getAllowlistEvents(
    allowlistEventName: string,
    filter: any,
  ): Promise<Array<string>> {
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

  /**
   * Allow Syndicate to accept or not accept deposits from allowed addresses
   *
   * @param {string} syndicateAddress
   * @param {bool} allowlistEnabled
   * @param manager
   * @param setShowWalletConfirmationModal
   * @param setSubmitting
   */
  async managerSetAllowlistEnabled(
    syndicateAddress,
    allowListEnabled,
    manager: string,
    setShowWalletConfirmationModal,
    setSubmitting,
  ) {
    if (!syndicateAddress.trim()) return;

    try {
      setShowWalletConfirmationModal(true);

      await this.logicContractInstance.methods
        .managerSetAllowlistEnabled(syndicateAddress, allowListEnabled)
        .send({ from: manager, gasLimit: 800000 })
        .on("transactionHash", () => {
          // close wallet confirmation modal
          setShowWalletConfirmationModal(false);
          setSubmitting(true);
        }).on("receipt", () => {
          setSubmitting(false);
        });
      await setSubmitting(false);
    } catch (error) {
      throw error;
    }
  }
}

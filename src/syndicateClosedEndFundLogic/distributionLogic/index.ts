import DistributionLogicABI from "src/contracts/SyndicateClosedEndFundDistributionLogicV0.json";
import { BaseLogicContract } from "../baseLogicContract";

export class SyndicateDistributionLogic extends BaseLogicContract {
  constructor(contractName: any, web3: any) {
    super(contractName, web3, DistributionLogicABI.abi);
    this.initializeLogicContract();
  }

  /**
   * Retrieves specific events from distribution logic contract.
   *
   * @param distributionEvent - name of the events to be retrieved.
   * @param syndicateAddress - address on which to filter distribution events
   * @returns {array} all emitted events for the specified event name
   */
  async getDistributionEvents(
    distributionEvent: string,
    filter = {},
  ): Promise<[]> {
    if (!distributionEvent.trim()) return;
    try {
      await this.initializeLogicContract();

      const managerDistributionEvents = await this.logicContractInstance.getPastEvents(
        distributionEvent,
        {
          filter,
          fromBlock: "earliest",
          toBlock: "latest",
        },
      );

      return managerDistributionEvents;
    } catch (error) {
      return [];
    }
  }

  async calculateDistributionShares(
    amount: string,
    syndicateDistributionShareBasisPoints: string | number,
    managerDistributionShareBasisPoints: string | number,
  ): Promise<{
    toMembers: string;
    toSyndicate: string;
    toManager: string;
  }> {
    if (
      !amount.trim() ||
      !syndicateDistributionShareBasisPoints ||
      !managerDistributionShareBasisPoints
    )
      return {
        toMembers: "0",
        toSyndicate: "0",
        toManager: "0",
      };

    try {
      const distributionShare = await this.logicContractInstance.methods
        .calculateDistributionShares(
          amount,
          syndicateDistributionShareBasisPoints,
          managerDistributionShareBasisPoints,
        )
        .call();

      return {
        toMembers: distributionShare[0],
        toSyndicate: distributionShare[1],
        toManager: distributionShare[2],
      };
    } catch (error) {
      return {
        toMembers: "0",
        toSyndicate: "0",
        toManager: "0",
      };
    }
  }

  /**
   * Retrieves total distributions for a given distributionERC20Address
   * @param syndicateAddress
   * @param distributionERC20Address
   * @returns
   */
  async getDistributionTotal(
    syndicateAddress: string,
    distributionERC20Address: string,
  ) {
    try {
      const totalDistributions = await this.logicContractInstance.methods
        .getDistributionTotal(syndicateAddress, distributionERC20Address)
        .call();
      return totalDistributions;
    } catch (error) {
      return "0";
    }
  }

  /**
   * Used by a syndicate manager to distribute tokens to members.
   *
   * @param syndicateAddress
   * @param distributionERC20TokenAddresses
   * @param tokenDistributionAmounts
   * @param manager
   * @param setMetamaskConfirmationPending
   * @param setSubmitting
   * @param processSetDistributionEvent
   * @returns
   */
  async managerSetDistributions(
    syndicateAddress: string,
    distributionERC20TokenAddresses: string | any[],
    tokenDistributionAmounts: any,
    manager: string,
    setMetamaskConfirmationPending: (arg0: boolean) => void,
    setSubmitting: (arg0: boolean) => void,
    processSetDistributionEvent: (arg0: any) => void,
  ) {
    if (
      !syndicateAddress.trim() ||
      !Array.isArray(distributionERC20TokenAddresses) ||
      !distributionERC20TokenAddresses.length ||
      !Array.isArray(tokenDistributionAmounts) ||
      !tokenDistributionAmounts ||
      !manager.trim()
    ) {
      return;
    }

    await this.logicContractInstance.methods
      .managerSetDistributions(
        syndicateAddress,
        distributionERC20TokenAddresses,
        tokenDistributionAmounts,
      )
      .send({ from: manager, gasLimit: 800000 })
      .on("transactionHash", () => {
        // user has confirmed the transaction so we should start loader state.
        // show loading modal
        setMetamaskConfirmationPending(false);
        setSubmitting(true);
      })
      .on("receipt", (receipt: { events }) => {
        // For a single distribution token, a single event is
        // emitted, and thus DistributionAdded will be an
        // object whereas for multiple distribution tokens, multiple
        // events are emitted and therefore DistributionAdded // will be an array
        const { DistributionAdded } = receipt.events;
        if (Array.isArray(DistributionAdded)) {
          DistributionAdded.forEach((distributionEvent) => {
            processSetDistributionEvent(distributionEvent);
          });
        } else {
          processSetDistributionEvent(DistributionAdded);
        }
      });
    setSubmitting(false);
  }

  /**
   * Retrieves distribution share for a given syndicate.
   *
   * @param totalMemberDeposits
   * @param totalSyndicateDeposits
   * @param memberDistributionsWithdrawalsToDate
   * @param totalTokenDistributions
   * @returns
   */
  async calculateEligibleDistribution(
    totalMemberDeposits: string,
    totalSyndicateDeposits: string,
    memberDistributionsWithdrawalsToDate: string,
    totalTokenDistributions: string,
  ): Promise<string> {
    await this.initializeLogicContract();

    if (totalSyndicateDeposits == "0" || totalTokenDistributions == "0") return;

    const eligibleWithdraw = await this.logicContractInstance.methods
      .calculateEligibleDistribution(
        totalMemberDeposits,
        totalSyndicateDeposits,
        memberDistributionsWithdrawalsToDate,
        totalTokenDistributions,
      )
      .call();

    return eligibleWithdraw;
  }

  /**
   * Used by member to withdraw distributions.
   *
   * @param syndicateAddress
   * @param memberAccount
   * @param ERC20Address
   * @param amount
   * @param setMetamaskConfirmPending
   * @param setSubmittingWithdrawal
   * @returns
   */
  async memberClaimDistributions(
    syndicateAddress: string,
    memberAccount: string,
    ERC20Addresses: string[],
    amounts: string[],
    setMetamaskConfirmPending: (pending: boolean) => void,
    setSubmittingWithdrawal: (submitting: boolean) => void,
  ): Promise<void> {
    if (!ERC20Addresses.length || !amounts.length || !memberAccount.trim()) {
      return;
    }

    try {
      await this.logicContractInstance.methods
        .memberClaimDistributions(syndicateAddress, ERC20Addresses, amounts)
        .send({ from: memberAccount, gasLimit: 800000 })
        .on("transactionHash", () => {
          setMetamaskConfirmPending(false);
          setSubmittingWithdrawal(true);
        });
      setSubmittingWithdrawal(false);
    } catch (error) {
      setSubmittingWithdrawal(false);
      throw error;
    }
  }

  /**
   * Used by manager to update distributions claimed by members.
   *
   * @param syndicateAddress
   * @param memberAddresses
   * @param distributionERC20Addresses
   * @param amounts
   * @param manager
   * @param setShowWalletConfirmationModal
   * @param setSubmitting
   * @returns
   */
  async managerSetDistributionsClaimedForMembers(
    syndicateAddress: string,
    memberAddresses: string[],
    distributionERC20Addresses: string[],
    amounts: string[],
    manager: string,
    setShowWalletConfirmationModal: (pending: boolean) => void,
    setSubmitting: (pending: boolean) => void,
  ): Promise<string> {
    if (
      !memberAddresses.length ||
      !distributionERC20Addresses.length ||
      !amounts.length
    ) {
      return;
    }
    try {
      await this.logicContractInstance.methods
        .managerSetDistributionsClaimedForMembers(
          syndicateAddress,
          distributionERC20Addresses,
          memberAddresses,
          amounts,
        )
        .send({ from: manager, gasLimit: 800000 })
        .on("transactionHash", () => {
          setShowWalletConfirmationModal(false);
          setSubmitting(true);
        });
    } catch (error) {
      setSubmitting(false);
      throw error;
    }
  }

  async getDistributionClaimedMember(
    syndicateAddress: string,
    memberAddress: string,
    distributionERC20Address: string,
  ): Promise<string> {
    if (
      !memberAddress.trim() ||
      !syndicateAddress.trim() ||
      !distributionERC20Address.trim()
    ) {
      return;
    }

    // Just make sure everything is set up correctly
    this.initializeLogicContract();

    try {
      const claimedDistributions = await this.logicContractInstance?.methods
        .getDistributionClaimedMember(
          syndicateAddress,
          memberAddress,
          distributionERC20Address,
        )
        .call();
      return claimedDistributions;
    } catch (error) {
      return;
    }
  }
}

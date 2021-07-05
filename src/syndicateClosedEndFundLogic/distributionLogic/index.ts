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
  async getDistributionEvents(distributionEvent: string, filter = {}) {
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

  async calculateProfitShare(
    amount: string,
    syndicateProfitShareBasisPoints: string | number,
    managerProfitShareBasisPoints: string | number,
  ): Promise<{
    toMembers: string;
    toSyndicate: string;
    toManager: string;
  }> {
    if (
      !amount.trim() ||
      !syndicateProfitShareBasisPoints ||
      !managerProfitShareBasisPoints
    )
      return {
        toMembers: "0",
        toSyndicate: "0",
        toManager: "0",
      };

    try {
      const profitShare = await this.logicContractInstance.methods
        .calculateProfitShare(
          amount,
          syndicateProfitShareBasisPoints,
          managerProfitShareBasisPoints,
        )
        .call();

      return {
        toMembers: profitShare[0],
        toSyndicate: profitShare[1],
        toManager: profitShare[2],
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
    distributionERC20TokenAddresses,
    tokenDistributionAmounts,
    manager,
    setMetamaskConfirmationPending,
    setSubmitting,
    processSetDistributionEvent,
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

    try {
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
        .on("receipt", (receipt) => {
          // For a single distribution token, a single event is
          // emitted, and thus managerSetterDistribution will be an
          // object whereas for multiple distribution tokens, multiple
          // events are emitted and therefore managerSetterDistribution // will be an array
          const { managerSetterDistribution } = receipt.events;
          if (Array.isArray(managerSetterDistribution)) {
            managerSetterDistribution.forEach((distributionEvent) => {
              processSetDistributionEvent(distributionEvent);
            });
          } else {
            processSetDistributionEvent(managerSetterDistribution);
          }
        });
      setSubmitting(false);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves profit share for a given syndicate.
   *
   * @param totalMemberDeposits
   * @param totalSyndicateDeposits
   * @param memberDistributionsWithdrawalsToDate
   * @param totalTokenDistributions
   * @returns
   */
  async calculateEligibleDistributions(
    totalMemberDeposits,
    totalSyndicateDeposits,
    memberDistributionsWithdrawalsToDate,
    totalTokenDistributions,
  ) {
    if (totalSyndicateDeposits == "0" || totalTokenDistributions == "0") return;
    try {
      const eligibleWithdraw = await this.logicContractInstance.methods
        .calculateEligibleDistributions(
          totalMemberDeposits,
          totalSyndicateDeposits,
          memberDistributionsWithdrawalsToDate,
          totalTokenDistributions,
        )
        .call();

      return eligibleWithdraw;
    } catch (error) {
      throw error;
    }
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
  async memberClaimDistribution(
    syndicateAddress: string,
    memberAccount: string,
    ERC20Address: string,
    amount: string,
    setMetamaskConfirmPending: Function,
    setSubmittingWithdrawal: Function,
  ) {
    if (
      !syndicateAddress.trim() ||
      !amount.trim() ||
      !memberAccount.trim() ||
      amount.toString() == "0" ||
      !ERC20Address.trim()
    ) {
      return;
    }

    try {
      await this.logicContractInstance.methods
        .memberClaimDistribution(syndicateAddress, ERC20Address, amount)
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
  async managerSetDistributionClaimedForMembers(
    syndicateAddress: string,
    memberAddresses: string[],
    distributionERC20Addresses: string[],
    amounts: string[],
    manager: string,
    setShowWalletConfirmationModal: Function,
    setSubmitting: Function,
  ) {
    if (
      !memberAddresses.length ||
      !distributionERC20Addresses.length ||
      !amounts.length
    ) {
      return;
    }
    try {
      await this.logicContractInstance.methods
        .managerSetDistributionClaimedForMembers(
          syndicateAddress,
          memberAddresses,
          distributionERC20Addresses,
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
}

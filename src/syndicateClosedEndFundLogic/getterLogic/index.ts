import GetterLogicABI from "src/contracts/SyndicateClosedEndFundGetterLogicV0.json";
import { BaseLogicContract } from "../baseLogicContract";
import { SyndicateMemberInfo, SyndicateValues } from "../shared";

export class SyndicateGetterLogic extends BaseLogicContract {
  constructor(contractName: string, web3: any) {
    super(contractName, web3, GetterLogicABI.abi);
    this.initializeLogicContract();
  }

  /**
   * Retrives memberDeposits, memberClaimedDistributions and addressAllowed
   * value for the given member address.
   *
   * @param syndicateAddress
   * @param memberAddress
   * @returns {object} memberInfo details for a given syndicate address
   */
  public async getMemberInfo(
    syndicateAddress: string,
    memberAddress: string
  ): Promise<SyndicateMemberInfo> {
    if (!syndicateAddress.trim() || !memberAddress.trim()) {
      return;
    }

    try {
      await this.initializeLogicContract();

      const {
        deposit,
        claimedDistributionPrimary,
        addressAllowed,
      } = await this.logicContractInstance.methods
        .getMemberInfo(syndicateAddress, memberAddress)
        .call();

      return {
        memberDeposit: deposit,
        memberClaimedDistribution: claimedDistributionPrimary,
        memberAddressAllowed: addressAllowed,
      };
    } catch {
      return null;
    }
  }

  /**
   * Get values for a syndicate
   * @param syndicateAddress
   * @returns
   */
  public async getSyndicateValues(
    syndicateAddress: string
  ): Promise<SyndicateValues> {
    if (!syndicateAddress.trim()) return;

    try {
      await this.initializeLogicContract();

      const {
        allowlistEnabled,
        dateClose,
        dateCreation,
        depositERC20Address,
        depositMaxMember,
        depositMaxTotal,
        depositMinMember,
        depositTotal,
        distributing,
        managerCurrent,
        managerFeeAddress,
        managerManagementFeeBasisPoints,
        managerPending,
        managerPerformanceFeeBasisPoints,
        modifiable,
        numMembersCurrent,
        numMembersMax,
        open,
        syndicateProfitShareBasisPoints,
        transferable,
      } = await this.logicContractInstance.methods
        .getSyndicateValues(syndicateAddress)
        .call();

      return {
        syndicateAddress,
        allowlistEnabled,
        dateClose,
        dateCreation,
        depositERC20Address,
        depositMaxMember,
        depositMaxTotal,
        depositMinMember,
        depositTotal,
        distributing,
        managerCurrent,
        managerFeeAddress,
        managerManagementFeeBasisPoints,
        managerPending,
        managerPerformanceFeeBasisPoints,
        modifiable,
        numMembersCurrent,
        numMembersMax,
        open,
        syndicateProfitShareBasisPoints,
        transferable,
      };
    } catch (error) {
      return null;
    }
  }
}

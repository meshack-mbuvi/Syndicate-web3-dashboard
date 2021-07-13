import GetterLogicABI from "src/contracts/SyndicateClosedEndFundGetterLogicV0.json";
import { BaseLogicContract } from "../baseLogicContract";
import { SyndicateMemberInfo, SyndicateValues } from "../shared";

export class SyndicateGetterLogic extends BaseLogicContract {
  constructor(contractName: string, contractAddress: string, web3: any) {
    super(contractName, contractAddress, web3, GetterLogicABI.abi);
    this.initializeLogicContract();
  }

  /**
   * Retrives memberDeposits, DistributionClaimed and addressAllowed
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
        distributionClaimedDepositERC20,
        isAllowlisted,
      } = await this.logicContractInstance.methods
        .getMemberInfo(syndicateAddress, memberAddress)
        .call();

      return {
        memberDeposit: deposit,
        DistributionClaimed: distributionClaimedDepositERC20,
        memberAddressAllowed: isAllowlisted,
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
        dateCreated,
        depositERC20Address,
        depositMemberMax,
        depositTotalMax,
        depositMemberMin,
        depositTotal,
        distributing,
        managerCurrent,
        managerFeeAddress,
        managerManagementFeeBasisPoints,
        managerPending,
        managerDistributionShareBasisPoints,
        modifiable,
        numMembersCurrent,
        numMembersMax,
        open,
        syndicateDistributionShareBasisPoints,
        transferable,
      } = await this.logicContractInstance.methods
        .getSyndicateValues(syndicateAddress)
        .call();

      return {
        syndicateAddress,
        allowlistEnabled,
        dateClose,
        dateCreated,
        depositERC20Address,
        depositMemberMax,
        depositTotalMax,
        depositMemberMin,
        depositTotal,
        distributing,
        managerCurrent,
        managerFeeAddress,
        managerManagementFeeBasisPoints,
        managerPending,
        managerDistributionShareBasisPoints,
        modifiable,
        numMembersCurrent,
        numMembersMax,
        open,
        syndicateDistributionShareBasisPoints,
        transferable,
      };
    } catch (error) {
      return null;
    }
  }
}

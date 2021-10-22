/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface SyndicateClosedEndFundDistributionLogicV0Contract
  extends Truffle.Contract<SyndicateClosedEndFundDistributionLogicV0Instance> {
  "new"(
    owner: string,
    storeAddress: string,
    meta?: Truffle.TransactionDetails
  ): Promise<SyndicateClosedEndFundDistributionLogicV0Instance>;
}

export interface DistributionAdded {
  name: "DistributionAdded";
  args: {
    syndicateAddress: string;
    distributionERC20Address: string;
    amountToMembers: BN;
    amountToSyndicate: BN;
    amountToManager: BN;
    0: string;
    1: string;
    2: BN;
    3: BN;
    4: BN;
  };
}

export interface DistributionClaimed {
  name: "DistributionClaimed";
  args: {
    syndicateAddress: string;
    distributionERC20Address: string;
    memberAddress: string;
    amount: BN;
    actor: string;
    0: string;
    1: string;
    2: string;
    3: BN;
    4: string;
  };
}

export interface DistributionERC20AddressAdded {
  name: "DistributionERC20AddressAdded";
  args: {
    syndicateAddress: string;
    distributionERC20Address: string;
    0: string;
    1: string;
  };
}

export interface OwnershipTransferred {
  name: "OwnershipTransferred";
  args: {
    previousOwner: string;
    newOwner: string;
    0: string;
    1: string;
  };
}

export interface SyndicateFeeAddressUpdated {
  name: "SyndicateFeeAddressUpdated";
  args: {
    contractFeeAddress: string;
    0: string;
  };
}

type AllEvents =
  | DistributionAdded
  | DistributionClaimed
  | DistributionERC20AddressAdded
  | OwnershipTransferred
  | SyndicateFeeAddressUpdated;

export interface SyndicateClosedEndFundDistributionLogicV0Instance
  extends Truffle.ContractInstance {
  BASIS_POINTS_DENOMINATOR(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  /**
   * This function is needed to allow inheriting contracts to only be able to view but not change syndicateFeeAddress without going through ownerSetSyndicateFeeAddress
   * getter function for syndicate fee address.
   */
  getSyndicateFeeAddress(
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  /**
   * Returns the address of the current owner.
   */
  owner(txDetails?: Truffle.TransactionDetails): Promise<string>;

  /**
   * Renounce ownership of the contract
   */
  ownerRenounceOwnership: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  /**
   * set a new fee address for the contract function that can only be triggered by the contract owner.
   * @param feeAddress The owner's new contract fee address
   */
  ownerSetSyndicateFeeAddress: {
    (feeAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      feeAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      feeAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      feeAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Transfers ownership to the provided address.
   * @param newOwner The new owner's address.
   */
  ownerTransferOwnership: {
    (newOwner: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      newOwner: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      newOwner: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      newOwner: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.
   */
  renounceOwnership: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  /**
   * Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.
   */
  transferOwnership: {
    (newOwner: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      newOwner: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      newOwner: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      newOwner: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Used by a manager to initialize or increase the available distributions for multiple ERC20 tokens after a Syndicate has been closed.
   * @param amounts The amounts to be added to the available distributions of each ERC20 token indexed in `distributionERC20Addresses`. This array must have the same length as `distributionERC20Addresses`.
   * @param distributionERC20Addresses The ERC20 contract addresses of the distributions. Distributions can be set for any ERC20 token, including the deposit token.
   * @param syndicateAddress The address of the Syndicate
   */
  managerSetDistributions: {
    (
      syndicateAddress: string,
      distributionERC20Addresses: string[],
      amounts: (number | BN | string)[],
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      syndicateAddress: string,
      distributionERC20Addresses: string[],
      amounts: (number | BN | string)[],
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      syndicateAddress: string,
      distributionERC20Addresses: string[],
      amounts: (number | BN | string)[],
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      distributionERC20Addresses: string[],
      amounts: (number | BN | string)[],
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Used by a manager to modify the claimed distribution amount for a given member addressThis function can only be called if the Syndicate is modifiable. The modifiable boolean is set by the manager on creation and cannot be changed after the Syndicate is created.Claimed distributions can only be raised. If we allowed a manager to lower a member's claimed distributions, the manager's token allowance and token balance may not be enough to cover all future distributions.Claimed distributions cannot exceed the member's eligible distributions as calculated from their deposit. If we allowed a manager to raise a member's claimed distributions above their eligible distributions, we would have to adjust `distributionTotal` accordingly and this would result in every other member being eligible for an additional distribution, which the manager may not have a sufficient allowance/balance to cover.This function can only be called after distributions are   enabled. Before distributions are enabled, there is no reason to call this function since there are no distributions available to claim.
   * @param amounts The amounts to increase the claimed distribution of the corresponding index in memberAddresses. All paramter arrays must match exactly in length.
   * @param distributionERC20Addresses The ERC20 contract addresses of the distribution.
   * @param memberAddresses The addresses of the members whose info is being set.
   * @param syndicateAddress The address of the Syndicate
   */
  managerSetDistributionsClaimedForMembers: {
    (
      syndicateAddress: string,
      distributionERC20Addresses: string[],
      memberAddresses: string[],
      amounts: (number | BN | string)[],
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      syndicateAddress: string,
      distributionERC20Addresses: string[],
      memberAddresses: string[],
      amounts: (number | BN | string)[],
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      syndicateAddress: string,
      distributionERC20Addresses: string[],
      memberAddresses: string[],
      amounts: (number | BN | string)[],
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      distributionERC20Addresses: string[],
      memberAddresses: string[],
      amounts: (number | BN | string)[],
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Distribution claims are processed before any fees that an ERC20 token may assess. The amount that all users receive may be lower if an ERC20 token takes a fee upon transfers.
   * The member is identified via `msg.sender`. This function must be called from the address associated with the member's deposit.This function may only be called after the Syndicate is closed by the manager, though the Syndicate may be closed for some time before a distribution is set (e.g. after funds have been raised but while they are being used for investments)
   * @param amounts The amounts (in token types specified by `distributionERC20Addresses`) to be claimed
   * @param distributionERC20Addresses The token types to be transferred from the Syndicate to the member. Members may only claim distributions from ERC20 contract addresses that the manager has set for distribution.
   * @param syndicateAddress The Syndicate that a member will claim distributions from
   */
  memberClaimDistributions: {
    (
      syndicateAddress: string,
      distributionERC20Addresses: string[],
      amounts: (number | BN | string)[],
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      syndicateAddress: string,
      distributionERC20Addresses: string[],
      amounts: (number | BN | string)[],
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      syndicateAddress: string,
      distributionERC20Addresses: string[],
      amounts: (number | BN | string)[],
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      distributionERC20Addresses: string[],
      amounts: (number | BN | string)[],
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Get a Syndicate's total distributions for a given ERC20
   * @param distributionERC20Address The ERC20 address of the token whose distributions are being queried
   * @param syndicateAddress The address of the Syndicate
   */
  getDistributionTotal(
    syndicateAddress: string,
    distributionERC20Address: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  /**
   * Get a member's claimed distributions for a given ERC20
   * @param distributionERC20Address The ERC20 address of the token whose distributions are being queried
   * @param memberAddress The address of the member whose info is being queried
   * @param syndicateAddress The address of the Syndicate
   */
  getDistributionClaimedMember(
    syndicateAddress: string,
    distributionERC20Address: string,
    memberAddress: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  /**
   * Get a member's unclaimed distribution for a given ERC20
   * @param distributionERC20Address The ERC20 address of the token whose distributions are being queried
   * @param memberAddress The address of the member whose info is being queried
   * @param syndicateAddress The address of the Syndicate
   */
  getDistributionUnclaimedMember(
    syndicateAddress: string,
    distributionERC20Address: string,
    memberAddress: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  /**
   * Get a Syndicate's total claimed distributions for a given ERC20
   * @param distributionERC20Address The ERC20 address of the token whose distributions are being queried
   * @param syndicateAddress The address of the Syndicate
   */
  getDistributionClaimedTotal(
    syndicateAddress: string,
    distributionERC20Address: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  /**
   * HIGH RISK: If this calculation is incorrect, a user could withdraw more or less than they are entitled to.
   * Calculates the maximum value in distribution tokens that a member can withdraw based on their percent ownership of the Syndicate, the total amount of a particular token available for distribution, and the amount of that distribution token that the member has already claimed.
   * @param depositMember Member's deposit to the Syndicate at the moment that it was closed by the manager
   * @param depositTotal Total deposits (from anyone) to the Syndicate
   * @param distributionClaimedMember Value in distributions that user has withdrawn from the fund already.  Make sure this matches the token type of `distributionTotal`.
   * @param distributionTotal Total distributions available from the fund, claimed or not.  Make sure this matches the token type of `distributionClaimedMember`.
   */
  calculateEligibleDistribution(
    depositMember: number | BN | string,
    depositTotal: number | BN | string,
    distributionClaimedMember: number | BN | string,
    distributionTotal: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  /**
   * Calculates the amount of a distribution that goes to the members, Syndicate Protocol, and the syndicate manager.
   * @param amount Total amount to be withdrawn, including fees.
   * @param managerDistributionShareBasisPoints Share to the syndicate manager in basis points (i.e. as a fraction divided by 10000)
   * @param syndicateDistributionShareBasisPoints Distribution share to Syndicate Protocol in basis points (i.e. as a fraction divided by 10000)
   */
  calculateDistributionShares(
    amount: number | BN | string,
    syndicateDistributionShareBasisPoints: number | BN | string,
    managerDistributionShareBasisPoints: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<{ 0: BN; 1: BN; 2: BN }>;

  methods: {
    BASIS_POINTS_DENOMINATOR(
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    /**
     * This function is needed to allow inheriting contracts to only be able to view but not change syndicateFeeAddress without going through ownerSetSyndicateFeeAddress
     * getter function for syndicate fee address.
     */
    getSyndicateFeeAddress(
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    /**
     * Returns the address of the current owner.
     */
    owner(txDetails?: Truffle.TransactionDetails): Promise<string>;

    /**
     * Renounce ownership of the contract
     */
    ownerRenounceOwnership: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    /**
     * set a new fee address for the contract function that can only be triggered by the contract owner.
     * @param feeAddress The owner's new contract fee address
     */
    ownerSetSyndicateFeeAddress: {
      (feeAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        feeAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        feeAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        feeAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Transfers ownership to the provided address.
     * @param newOwner The new owner's address.
     */
    ownerTransferOwnership: {
      (newOwner: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        newOwner: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        newOwner: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        newOwner: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.
     */
    renounceOwnership: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    /**
     * Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.
     */
    transferOwnership: {
      (newOwner: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        newOwner: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        newOwner: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        newOwner: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Used by a manager to initialize or increase the available distributions for multiple ERC20 tokens after a Syndicate has been closed.
     * @param amounts The amounts to be added to the available distributions of each ERC20 token indexed in `distributionERC20Addresses`. This array must have the same length as `distributionERC20Addresses`.
     * @param distributionERC20Addresses The ERC20 contract addresses of the distributions. Distributions can be set for any ERC20 token, including the deposit token.
     * @param syndicateAddress The address of the Syndicate
     */
    managerSetDistributions: {
      (
        syndicateAddress: string,
        distributionERC20Addresses: string[],
        amounts: (number | BN | string)[],
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        distributionERC20Addresses: string[],
        amounts: (number | BN | string)[],
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        syndicateAddress: string,
        distributionERC20Addresses: string[],
        amounts: (number | BN | string)[],
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        distributionERC20Addresses: string[],
        amounts: (number | BN | string)[],
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Used by a manager to modify the claimed distribution amount for a given member addressThis function can only be called if the Syndicate is modifiable. The modifiable boolean is set by the manager on creation and cannot be changed after the Syndicate is created.Claimed distributions can only be raised. If we allowed a manager to lower a member's claimed distributions, the manager's token allowance and token balance may not be enough to cover all future distributions.Claimed distributions cannot exceed the member's eligible distributions as calculated from their deposit. If we allowed a manager to raise a member's claimed distributions above their eligible distributions, we would have to adjust `distributionTotal` accordingly and this would result in every other member being eligible for an additional distribution, which the manager may not have a sufficient allowance/balance to cover.This function can only be called after distributions are   enabled. Before distributions are enabled, there is no reason to call this function since there are no distributions available to claim.
     * @param amounts The amounts to increase the claimed distribution of the corresponding index in memberAddresses. All paramter arrays must match exactly in length.
     * @param distributionERC20Addresses The ERC20 contract addresses of the distribution.
     * @param memberAddresses The addresses of the members whose info is being set.
     * @param syndicateAddress The address of the Syndicate
     */
    managerSetDistributionsClaimedForMembers: {
      (
        syndicateAddress: string,
        distributionERC20Addresses: string[],
        memberAddresses: string[],
        amounts: (number | BN | string)[],
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        distributionERC20Addresses: string[],
        memberAddresses: string[],
        amounts: (number | BN | string)[],
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        syndicateAddress: string,
        distributionERC20Addresses: string[],
        memberAddresses: string[],
        amounts: (number | BN | string)[],
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        distributionERC20Addresses: string[],
        memberAddresses: string[],
        amounts: (number | BN | string)[],
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Distribution claims are processed before any fees that an ERC20 token may assess. The amount that all users receive may be lower if an ERC20 token takes a fee upon transfers.
     * The member is identified via `msg.sender`. This function must be called from the address associated with the member's deposit.This function may only be called after the Syndicate is closed by the manager, though the Syndicate may be closed for some time before a distribution is set (e.g. after funds have been raised but while they are being used for investments)
     * @param amounts The amounts (in token types specified by `distributionERC20Addresses`) to be claimed
     * @param distributionERC20Addresses The token types to be transferred from the Syndicate to the member. Members may only claim distributions from ERC20 contract addresses that the manager has set for distribution.
     * @param syndicateAddress The Syndicate that a member will claim distributions from
     */
    memberClaimDistributions: {
      (
        syndicateAddress: string,
        distributionERC20Addresses: string[],
        amounts: (number | BN | string)[],
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        distributionERC20Addresses: string[],
        amounts: (number | BN | string)[],
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        syndicateAddress: string,
        distributionERC20Addresses: string[],
        amounts: (number | BN | string)[],
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        distributionERC20Addresses: string[],
        amounts: (number | BN | string)[],
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Get a Syndicate's total distributions for a given ERC20
     * @param distributionERC20Address The ERC20 address of the token whose distributions are being queried
     * @param syndicateAddress The address of the Syndicate
     */
    getDistributionTotal(
      syndicateAddress: string,
      distributionERC20Address: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    /**
     * Get a member's claimed distributions for a given ERC20
     * @param distributionERC20Address The ERC20 address of the token whose distributions are being queried
     * @param memberAddress The address of the member whose info is being queried
     * @param syndicateAddress The address of the Syndicate
     */
    getDistributionClaimedMember(
      syndicateAddress: string,
      distributionERC20Address: string,
      memberAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    /**
     * Get a member's unclaimed distribution for a given ERC20
     * @param distributionERC20Address The ERC20 address of the token whose distributions are being queried
     * @param memberAddress The address of the member whose info is being queried
     * @param syndicateAddress The address of the Syndicate
     */
    getDistributionUnclaimedMember(
      syndicateAddress: string,
      distributionERC20Address: string,
      memberAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    /**
     * Get a Syndicate's total claimed distributions for a given ERC20
     * @param distributionERC20Address The ERC20 address of the token whose distributions are being queried
     * @param syndicateAddress The address of the Syndicate
     */
    getDistributionClaimedTotal(
      syndicateAddress: string,
      distributionERC20Address: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    /**
     * HIGH RISK: If this calculation is incorrect, a user could withdraw more or less than they are entitled to.
     * Calculates the maximum value in distribution tokens that a member can withdraw based on their percent ownership of the Syndicate, the total amount of a particular token available for distribution, and the amount of that distribution token that the member has already claimed.
     * @param depositMember Member's deposit to the Syndicate at the moment that it was closed by the manager
     * @param depositTotal Total deposits (from anyone) to the Syndicate
     * @param distributionClaimedMember Value in distributions that user has withdrawn from the fund already.  Make sure this matches the token type of `distributionTotal`.
     * @param distributionTotal Total distributions available from the fund, claimed or not.  Make sure this matches the token type of `distributionClaimedMember`.
     */
    calculateEligibleDistribution(
      depositMember: number | BN | string,
      depositTotal: number | BN | string,
      distributionClaimedMember: number | BN | string,
      distributionTotal: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    /**
     * Calculates the amount of a distribution that goes to the members, Syndicate Protocol, and the syndicate manager.
     * @param amount Total amount to be withdrawn, including fees.
     * @param managerDistributionShareBasisPoints Share to the syndicate manager in basis points (i.e. as a fraction divided by 10000)
     * @param syndicateDistributionShareBasisPoints Distribution share to Syndicate Protocol in basis points (i.e. as a fraction divided by 10000)
     */
    calculateDistributionShares(
      amount: number | BN | string,
      syndicateDistributionShareBasisPoints: number | BN | string,
      managerDistributionShareBasisPoints: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: BN; 1: BN; 2: BN }>;
  };

  getPastEvents(event: string): Promise<EventData[]>;
  getPastEvents(
    event: string,
    options: PastEventOptions,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
  getPastEvents(event: string, options: PastEventOptions): Promise<EventData[]>;
  getPastEvents(
    event: string,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
}
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface ISyndicateClosedEndFundStoreGettersV0Contract
  extends Truffle.Contract<ISyndicateClosedEndFundStoreGettersV0Instance> {
  "new"(
    meta?: Truffle.TransactionDetails
  ): Promise<ISyndicateClosedEndFundStoreGettersV0Instance>;
}

type AllEvents = never;

export interface ISyndicateClosedEndFundStoreGettersV0Instance
  extends Truffle.ContractInstance {
  managerCurrent: {
    (syndicateAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    sendTransaction(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  managerSyndicate: {
    (managerAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      managerAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    sendTransaction(
      managerAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      managerAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  managerPending: {
    (syndicateAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    sendTransaction(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  managerFeeAddress: {
    (syndicateAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    sendTransaction(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  managerManagementFeeBasisPoints: {
    (syndicateAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;
    sendTransaction(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  managerDistributionShareBasisPoints: {
    (syndicateAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;
    sendTransaction(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  syndicateDistributionShareBasisPoints: {
    (syndicateAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;
    sendTransaction(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  numMembersMax: {
    (syndicateAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;
    sendTransaction(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  numMembersCurrent: {
    (syndicateAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;
    sendTransaction(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  depositERC20Address: {
    (syndicateAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    sendTransaction(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  depositMemberMin: {
    (syndicateAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;
    sendTransaction(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  depositMemberMax: {
    (syndicateAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;
    sendTransaction(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  depositTotalMax: {
    (syndicateAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;
    sendTransaction(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  depositTotal: {
    (syndicateAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;
    sendTransaction(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  depositMember: {
    (
      syndicateAddress: string,
      memberAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      syndicateAddress: string,
      memberAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;
    sendTransaction(
      syndicateAddress: string,
      memberAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      memberAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  distributionERC20Addresses: {
    (
      syndicateAddress: string,
      distributionERC20Address: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      syndicateAddress: string,
      distributionERC20Address: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;
    sendTransaction(
      syndicateAddress: string,
      distributionERC20Address: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      distributionERC20Address: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  distributionTotal: {
    (
      syndicateAddress: string,
      distributionERC20Address: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      syndicateAddress: string,
      distributionERC20Address: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;
    sendTransaction(
      syndicateAddress: string,
      distributionERC20Address: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      distributionERC20Address: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  distributionClaimedTotal: {
    (
      syndicateAddress: string,
      distributionERC20Address: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      syndicateAddress: string,
      distributionERC20Address: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;
    sendTransaction(
      syndicateAddress: string,
      distributionERC20Address: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      distributionERC20Address: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  distributionClaimedMember: {
    (
      syndicateAddress: string,
      distributionERC20Address: string,
      memberAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      syndicateAddress: string,
      distributionERC20Address: string,
      memberAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;
    sendTransaction(
      syndicateAddress: string,
      distributionERC20Address: string,
      memberAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      distributionERC20Address: string,
      memberAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  dateCreated: {
    (syndicateAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;
    sendTransaction(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  dateClose: {
    (syndicateAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;
    sendTransaction(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  open: {
    (syndicateAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;
    sendTransaction(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  distributing: {
    (syndicateAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;
    sendTransaction(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  modifiable: {
    (syndicateAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;
    sendTransaction(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  allowlistEnabled: {
    (syndicateAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;
    sendTransaction(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  allowlist: {
    (
      syndicateAddress: string,
      memberAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      syndicateAddress: string,
      memberAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;
    sendTransaction(
      syndicateAddress: string,
      memberAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      memberAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  transferable: {
    (syndicateAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;
    sendTransaction(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  metadata: {
    (
      syndicateAddress: string,
      key: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      syndicateAddress: string,
      key: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    sendTransaction(
      syndicateAddress: string,
      key: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      key: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  notCloseable: {
    (syndicateAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;
    sendTransaction(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  methods: {
    managerCurrent: {
      (
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      sendTransaction(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    managerSyndicate: {
      (managerAddress: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        managerAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      sendTransaction(
        managerAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        managerAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    managerPending: {
      (
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      sendTransaction(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    managerFeeAddress: {
      (
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      sendTransaction(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    managerManagementFeeBasisPoints: {
      (
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<BN>;
      sendTransaction(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    managerDistributionShareBasisPoints: {
      (
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<BN>;
      sendTransaction(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    syndicateDistributionShareBasisPoints: {
      (
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<BN>;
      sendTransaction(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    numMembersMax: {
      (
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<BN>;
      sendTransaction(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    numMembersCurrent: {
      (
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<BN>;
      sendTransaction(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    depositERC20Address: {
      (
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      sendTransaction(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    depositMemberMin: {
      (
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<BN>;
      sendTransaction(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    depositMemberMax: {
      (
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<BN>;
      sendTransaction(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    depositTotalMax: {
      (
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<BN>;
      sendTransaction(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    depositTotal: {
      (
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<BN>;
      sendTransaction(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    depositMember: {
      (
        syndicateAddress: string,
        memberAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        memberAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<BN>;
      sendTransaction(
        syndicateAddress: string,
        memberAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        memberAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    distributionERC20Addresses: {
      (
        syndicateAddress: string,
        distributionERC20Address: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        distributionERC20Address: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<boolean>;
      sendTransaction(
        syndicateAddress: string,
        distributionERC20Address: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        distributionERC20Address: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    distributionTotal: {
      (
        syndicateAddress: string,
        distributionERC20Address: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        distributionERC20Address: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<BN>;
      sendTransaction(
        syndicateAddress: string,
        distributionERC20Address: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        distributionERC20Address: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    distributionClaimedTotal: {
      (
        syndicateAddress: string,
        distributionERC20Address: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        distributionERC20Address: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<BN>;
      sendTransaction(
        syndicateAddress: string,
        distributionERC20Address: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        distributionERC20Address: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    distributionClaimedMember: {
      (
        syndicateAddress: string,
        distributionERC20Address: string,
        memberAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        distributionERC20Address: string,
        memberAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<BN>;
      sendTransaction(
        syndicateAddress: string,
        distributionERC20Address: string,
        memberAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        distributionERC20Address: string,
        memberAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    dateCreated: {
      (
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<BN>;
      sendTransaction(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    dateClose: {
      (
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<BN>;
      sendTransaction(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    open: {
      (
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<boolean>;
      sendTransaction(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    distributing: {
      (
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<boolean>;
      sendTransaction(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    modifiable: {
      (
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<boolean>;
      sendTransaction(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    allowlistEnabled: {
      (
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<boolean>;
      sendTransaction(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    allowlist: {
      (
        syndicateAddress: string,
        memberAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        memberAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<boolean>;
      sendTransaction(
        syndicateAddress: string,
        memberAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        memberAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    transferable: {
      (
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<boolean>;
      sendTransaction(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    metadata: {
      (
        syndicateAddress: string,
        key: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        key: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      sendTransaction(
        syndicateAddress: string,
        key: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        key: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    notCloseable: {
      (
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<boolean>;
      sendTransaction(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };
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
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from 'bn.js';
import { EventData, PastEventOptions } from 'web3-eth-contract';

export interface SynTokenContract extends Truffle.Contract<SynTokenInstance> {
  'new'(meta?: Truffle.TransactionDetails): Promise<SynTokenInstance>;
}

export interface MaxMembersSet {
  name: 'MaxMembersSet';
  args: {
    amount: BN;
    0: BN;
  };
}

export interface MemberJoined {
  name: 'MemberJoined';
  args: {
    account: string;
    0: string;
  };
}

export interface MemberLeft {
  name: 'MemberLeft';
  args: {
    account: string;
    0: string;
  };
}

export interface MemberTransferPermissionSet {
  name: 'MemberTransferPermissionSet';
  args: {
    memberTransferPermission: BN;
    0: BN;
  };
}

export interface MetadataUpdated {
  name: 'MetadataUpdated';
  args: {
    metadataKeyValues: string[][];
    0: string[][];
  };
}

export interface MintCurrencySet {
  name: 'MintCurrencySet';
  args: {
    mintCurrencyAddress_: string;
    0: string;
  };
}

export interface MintDurationSet {
  name: 'MintDurationSet';
  args: {
    mintStartTime: BN;
    mintEndTime: BN;
    0: BN;
    1: BN;
  };
}

export interface MintEnabledSet {
  name: 'MintEnabledSet';
  args: {
    mintEnabled: boolean;
    0: boolean;
  };
}

export interface MintPriceSet {
  name: 'MintPriceSet';
  args: {
    mintPrice: BN;
    0: BN;
  };
}

export interface MintProceedsRecipientSet {
  name: 'MintProceedsRecipientSet';
  args: {
    mintProceedsRecipient: string;
    0: string;
  };
}

export interface OwnershipTransferred {
  name: 'OwnershipTransferred';
  args: {
    previousOwner: string;
    newOwner: string;
    0: string;
    1: string;
  };
}

export interface SynContractMetadataUpdated {
  name: 'SynContractMetadataUpdated';
  args: {
    metadataKeyValues: string[][];
    0: string[][];
  };
}

export interface TokenCapSet {
  name: 'TokenCapSet';
  args: {
    tokenCap: BN;
    0: BN;
  };
}

type AllEvents =
  | MaxMembersSet
  | MemberJoined
  | MemberLeft
  | MemberTransferPermissionSet
  | MetadataUpdated
  | MintCurrencySet
  | MintDurationSet
  | MintEnabledSet
  | MintPriceSet
  | MintProceedsRecipientSet
  | OwnershipTransferred
  | SynContractMetadataUpdated
  | TokenCapSet;

export interface SynTokenInstance extends Truffle.ContractInstance {
  balanceOf(arg0: string, txDetails?: Truffle.TransactionDetails): Promise<BN>;

  contractMetadata(
    arg0: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  daoCanTransfer: {
    (enabled_: boolean, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      enabled_: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      enabled_: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      enabled_: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  daoSetMaxMembers: {
    (
      newMax: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      newMax: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      newMax: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      newMax: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  daoSetMemberTransferPermission: {
    (
      memberTransferPermission_: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      memberTransferPermission_: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      memberTransferPermission_: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      memberTransferPermission_: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  daoSetMintCurrency: {
    (
      mintCurrencyAddress_: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      mintCurrencyAddress_: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      mintCurrencyAddress_: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      mintCurrencyAddress_: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  daoSetMintDuration: {
    (
      mintStartTime_: number | BN | string,
      mintEndTime_: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      mintStartTime_: number | BN | string,
      mintEndTime_: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      mintStartTime_: number | BN | string,
      mintEndTime_: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      mintStartTime_: number | BN | string,
      mintEndTime_: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  daoSetMintEnabled: {
    (mintEnabled_: boolean, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      mintEnabled_: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      mintEnabled_: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      mintEnabled_: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  daoSetMintPrice: {
    (
      mintPrice_: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      mintPrice_: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      mintPrice_: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      mintPrice_: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  daoSetMintProceedsRecipient: {
    (
      mintProceedsRecipient_: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      mintProceedsRecipient_: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      mintProceedsRecipient_: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      mintProceedsRecipient_: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  daoSetRagekick: {
    (enabled_: boolean, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      enabled_: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      enabled_: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      enabled_: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  daoSetTokenCap: {
    (
      tokenCap_: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      tokenCap_: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      tokenCap_: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      tokenCap_: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  daoTransfersEnabled(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

  getContractMetadata(
    metadataKey: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  getMetadata(
    metadataKey: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  memberCount(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  memberTransferPermission(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  metadata(
    arg0: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  mintCurrency(txDetails?: Truffle.TransactionDetails): Promise<string>;

  mintEnabled(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

  mintEndTime(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  mintPrice(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  mintProceedsRecipient(
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  mintStartTime(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  owner(txDetails?: Truffle.TransactionDetails): Promise<string>;

  ragekickEnabled(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

  renounceOwnership: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  setContractMetadata: {
    (
      metadataKeyValues: string[][],
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      metadataKeyValues: string[][],
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      metadataKeyValues: string[][],
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      metadataKeyValues: string[][],
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  setMetadata: {
    (
      metadataKeyValues: string[][],
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      metadataKeyValues: string[][],
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      metadataKeyValues: string[][],
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      metadataKeyValues: string[][],
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  tokenCap(txDetails?: Truffle.TransactionDetails): Promise<BN>;

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

  methods: {
    balanceOf(
      arg0: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    contractMetadata(
      arg0: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    daoCanTransfer: {
      (enabled_: boolean, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        enabled_: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        enabled_: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        enabled_: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    daoSetMaxMembers: {
      (
        newMax: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        newMax: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        newMax: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        newMax: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    daoSetMemberTransferPermission: {
      (
        memberTransferPermission_: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        memberTransferPermission_: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        memberTransferPermission_: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        memberTransferPermission_: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    daoSetMintCurrency: {
      (
        mintCurrencyAddress_: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        mintCurrencyAddress_: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        mintCurrencyAddress_: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        mintCurrencyAddress_: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    daoSetMintDuration: {
      (
        mintStartTime_: number | BN | string,
        mintEndTime_: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        mintStartTime_: number | BN | string,
        mintEndTime_: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        mintStartTime_: number | BN | string,
        mintEndTime_: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        mintStartTime_: number | BN | string,
        mintEndTime_: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    daoSetMintEnabled: {
      (mintEnabled_: boolean, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        mintEnabled_: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        mintEnabled_: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        mintEnabled_: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    daoSetMintPrice: {
      (
        mintPrice_: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        mintPrice_: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        mintPrice_: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        mintPrice_: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    daoSetMintProceedsRecipient: {
      (
        mintProceedsRecipient_: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        mintProceedsRecipient_: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        mintProceedsRecipient_: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        mintProceedsRecipient_: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    daoSetRagekick: {
      (enabled_: boolean, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        enabled_: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        enabled_: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        enabled_: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    daoSetTokenCap: {
      (
        tokenCap_: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        tokenCap_: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        tokenCap_: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        tokenCap_: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    daoTransfersEnabled(
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    getContractMetadata(
      metadataKey: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    getMetadata(
      metadataKey: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    memberCount(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    memberTransferPermission(
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    metadata(
      arg0: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    mintCurrency(txDetails?: Truffle.TransactionDetails): Promise<string>;

    mintEnabled(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

    mintEndTime(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    mintPrice(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    mintProceedsRecipient(
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    mintStartTime(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    owner(txDetails?: Truffle.TransactionDetails): Promise<string>;

    ragekickEnabled(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

    renounceOwnership: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    setContractMetadata: {
      (
        metadataKeyValues: string[][],
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        metadataKeyValues: string[][],
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        metadataKeyValues: string[][],
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        metadataKeyValues: string[][],
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    setMetadata: {
      (
        metadataKeyValues: string[][],
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        metadataKeyValues: string[][],
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        metadataKeyValues: string[][],
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        metadataKeyValues: string[][],
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    tokenCap(txDetails?: Truffle.TransactionDetails): Promise<BN>;

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

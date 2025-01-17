/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from 'bn.js';
import { EventData, PastEventOptions } from 'web3-eth-contract';

export interface SynERC721Contract extends Truffle.Contract<SynERC721Instance> {
  'new'(
    name_: string,
    symbol_: string,
    factoryAddress_: string,
    meta?: Truffle.TransactionDetails
  ): Promise<SynERC721Instance>;
}

export interface Approval {
  name: 'Approval';
  args: {
    owner: string;
    approved: string;
    tokenId: BN;
    0: string;
    1: string;
    2: BN;
  };
}

export interface ApprovalForAll {
  name: 'ApprovalForAll';
  args: {
    owner: string;
    operator: string;
    approved: boolean;
    0: string;
    1: string;
    2: boolean;
  };
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

export interface SynERC721DaoMultiMint {
  name: 'SynERC721DaoMultiMint';
  args: {
    amountToMint: BN;
    reduceAmountIfTokenCapExceeded: boolean;
    0: BN;
    1: boolean;
  };
}

export interface SynERC721DaoMultiMintAndTransfer {
  name: 'SynERC721DaoMultiMintAndTransfer';
  args: {
    addressList: string[];
    amountToMintByAddress: BN[];
    reduceAmountIfTokenCapExceeded: boolean;
    0: string[];
    1: BN[];
    2: boolean;
  };
}

export interface SynERC721MultiMint {
  name: 'SynERC721MultiMint';
  args: {
    amountToMint: BN;
    reduceAmountIfTokenCapExceeded: boolean;
    0: BN;
    1: boolean;
  };
}

export interface SynTokenERC721MetadataUpdated {
  name: 'SynTokenERC721MetadataUpdated';
  args: {
    tokenId: BN;
    metadataKeyValues: string[][];
    0: BN;
    1: string[][];
  };
}

export interface TokenCapSet {
  name: 'TokenCapSet';
  args: {
    tokenCap: BN;
    0: BN;
  };
}

export interface Transfer {
  name: 'Transfer';
  args: {
    from: string;
    to: string;
    tokenId: BN;
    0: string;
    1: string;
    2: BN;
  };
}

type AllEvents =
  | Approval
  | ApprovalForAll
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
  | SynERC721DaoMultiMint
  | SynERC721DaoMultiMintAndTransfer
  | SynERC721MultiMint
  | SynTokenERC721MetadataUpdated
  | TokenCapSet
  | Transfer;

export interface SynERC721Instance extends Truffle.ContractInstance {
  approve: {
    (
      to: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      to: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      to: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      to: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  balanceOf(
    account: string,
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

  daoMultiMint: {
    (
      amountToMint: number | BN | string,
      reduceAmountIfTokenCapExceeded: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      amountToMint: number | BN | string,
      reduceAmountIfTokenCapExceeded: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: BN; 1: BN }>;
    sendTransaction(
      amountToMint: number | BN | string,
      reduceAmountIfTokenCapExceeded: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      amountToMint: number | BN | string,
      reduceAmountIfTokenCapExceeded: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  daoMultiMintAndTransfer: {
    (
      addressList: string[],
      amountToMintByAddress: (number | BN | string)[],
      reduceAmountIfTokenCapExceeded: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      addressList: string[],
      amountToMintByAddress: (number | BN | string)[],
      reduceAmountIfTokenCapExceeded: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: BN; 1: BN }>;
    sendTransaction(
      addressList: string[],
      amountToMintByAddress: (number | BN | string)[],
      reduceAmountIfTokenCapExceeded: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      addressList: string[],
      amountToMintByAddress: (number | BN | string)[],
      reduceAmountIfTokenCapExceeded: boolean,
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

  getApproved(
    tokenId: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  getContractMetadata(
    metadataKey: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  getMetadata(
    metadataKey: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  getTokenMetadata(
    tokenId_: number | BN | string,
    metadataKey: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  isApprovedForAll(
    owner: string,
    operator: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  lastTokenIdMinted(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  memberCount(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  memberTransferPermission(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  metadata(
    arg0: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  mint: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<BN>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  mintCurrency(txDetails?: Truffle.TransactionDetails): Promise<string>;

  mintEnabled(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

  mintEndTime(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  mintPrice(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  mintProceedsRecipient(
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  mintStartTime(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  multiMint: {
    (
      amountToMint: number | BN | string,
      reduceAmountIfTokenCapExceeded: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      amountToMint: number | BN | string,
      reduceAmountIfTokenCapExceeded: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: BN; 1: BN }>;
    sendTransaction(
      amountToMint: number | BN | string,
      reduceAmountIfTokenCapExceeded: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      amountToMint: number | BN | string,
      reduceAmountIfTokenCapExceeded: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  name(txDetails?: Truffle.TransactionDetails): Promise<string>;

  owner(txDetails?: Truffle.TransactionDetails): Promise<string>;

  ownerOf(
    tokenId: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  ragekickEnabled(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

  renounceOwnership: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  setApprovalForAll: {
    (
      operator: string,
      approved: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      operator: string,
      approved: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      operator: string,
      approved: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      operator: string,
      approved: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
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

  setTokenMetadata: {
    (
      tokenId_: number | BN | string,
      metadataKeyValues: string[][],
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      tokenId_: number | BN | string,
      metadataKeyValues: string[][],
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      tokenId_: number | BN | string,
      metadataKeyValues: string[][],
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      tokenId_: number | BN | string,
      metadataKeyValues: string[][],
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  supportsInterface(
    interfaceId: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  symbol(txDetails?: Truffle.TransactionDetails): Promise<string>;

  tokenByIndex(
    index: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  tokenCap(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  tokenMetadata(
    arg0: number | BN | string,
    arg1: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  tokenOfOwnerByIndex(
    owner: string,
    index: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  tokenURI(
    tokenId: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  totalSupply(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  transferFrom: {
    (
      from: string,
      to: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      from: string,
      to: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      from: string,
      to: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      from: string,
      to: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

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
    approve: {
      (
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    balanceOf(
      account: string,
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

    daoMultiMint: {
      (
        amountToMint: number | BN | string,
        reduceAmountIfTokenCapExceeded: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        amountToMint: number | BN | string,
        reduceAmountIfTokenCapExceeded: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<{ 0: BN; 1: BN }>;
      sendTransaction(
        amountToMint: number | BN | string,
        reduceAmountIfTokenCapExceeded: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        amountToMint: number | BN | string,
        reduceAmountIfTokenCapExceeded: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    daoMultiMintAndTransfer: {
      (
        addressList: string[],
        amountToMintByAddress: (number | BN | string)[],
        reduceAmountIfTokenCapExceeded: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        addressList: string[],
        amountToMintByAddress: (number | BN | string)[],
        reduceAmountIfTokenCapExceeded: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<{ 0: BN; 1: BN }>;
      sendTransaction(
        addressList: string[],
        amountToMintByAddress: (number | BN | string)[],
        reduceAmountIfTokenCapExceeded: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        addressList: string[],
        amountToMintByAddress: (number | BN | string)[],
        reduceAmountIfTokenCapExceeded: boolean,
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

    getApproved(
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    getContractMetadata(
      metadataKey: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    getMetadata(
      metadataKey: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    getTokenMetadata(
      tokenId_: number | BN | string,
      metadataKey: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    isApprovedForAll(
      owner: string,
      operator: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    lastTokenIdMinted(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    memberCount(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    memberTransferPermission(
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    metadata(
      arg0: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    mint: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<BN>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    mintCurrency(txDetails?: Truffle.TransactionDetails): Promise<string>;

    mintEnabled(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

    mintEndTime(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    mintPrice(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    mintProceedsRecipient(
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    mintStartTime(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    multiMint: {
      (
        amountToMint: number | BN | string,
        reduceAmountIfTokenCapExceeded: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        amountToMint: number | BN | string,
        reduceAmountIfTokenCapExceeded: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<{ 0: BN; 1: BN }>;
      sendTransaction(
        amountToMint: number | BN | string,
        reduceAmountIfTokenCapExceeded: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        amountToMint: number | BN | string,
        reduceAmountIfTokenCapExceeded: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    name(txDetails?: Truffle.TransactionDetails): Promise<string>;

    owner(txDetails?: Truffle.TransactionDetails): Promise<string>;

    ownerOf(
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    ragekickEnabled(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

    renounceOwnership: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    setApprovalForAll: {
      (
        operator: string,
        approved: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        operator: string,
        approved: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        operator: string,
        approved: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        operator: string,
        approved: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
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

    setTokenMetadata: {
      (
        tokenId_: number | BN | string,
        metadataKeyValues: string[][],
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        tokenId_: number | BN | string,
        metadataKeyValues: string[][],
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        tokenId_: number | BN | string,
        metadataKeyValues: string[][],
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        tokenId_: number | BN | string,
        metadataKeyValues: string[][],
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    supportsInterface(
      interfaceId: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    symbol(txDetails?: Truffle.TransactionDetails): Promise<string>;

    tokenByIndex(
      index: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    tokenCap(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    tokenMetadata(
      arg0: number | BN | string,
      arg1: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    tokenOfOwnerByIndex(
      owner: string,
      index: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    tokenURI(
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    totalSupply(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    transferFrom: {
      (
        from: string,
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        from: string,
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        from: string,
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        from: string,
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

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

    'safeTransferFrom(address,address,uint256)': {
      (
        from: string,
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        from: string,
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        from: string,
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        from: string,
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    'safeTransferFrom(address,address,uint256,bytes)': {
      (
        from: string,
        to: string,
        tokenId: number | BN | string,
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        from: string,
        to: string,
        tokenId: number | BN | string,
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        from: string,
        to: string,
        tokenId: number | BN | string,
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        from: string,
        to: string,
        tokenId: number | BN | string,
        _data: string,
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

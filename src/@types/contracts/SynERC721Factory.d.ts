/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface SynERC721FactoryContract
  extends Truffle.Contract<SynERC721FactoryInstance> {
  "new"(meta?: Truffle.TransactionDetails): Promise<SynERC721FactoryInstance>;
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

export interface Paused {
  name: "Paused";
  args: {
    account: string;
    0: string;
  };
}

export interface SynERC721Created {
  name: "SynERC721Created";
  args: {
    owner: string;
    tokenAddress: string;
    name: string;
    symbol: string;
    0: string;
    1: string;
    2: string;
    3: string;
  };
}

export interface SyndicateTreasuryAddressUpdated {
  name: "SyndicateTreasuryAddressUpdated";
  args: {
    syndicateTreasuryAddress: string;
    0: string;
  };
}

export interface Unpaused {
  name: "Unpaused";
  args: {
    account: string;
    0: string;
  };
}

type AllEvents =
  | OwnershipTransferred
  | Paused
  | SynERC721Created
  | SyndicateTreasuryAddressUpdated
  | Unpaused;

export interface SynERC721FactoryInstance extends Truffle.ContractInstance {
  createERC721: {
    (
      owner_: string,
      name_: string,
      symbol_: string,
      mintCurrencyAddress_: string,
      mintPrice_: number | BN | string,
      mintProceedsRecipient_: string,
      tokenCap_: number | BN | string,
      mintStartTime_: number | BN | string,
      mintEndTime_: number | BN | string,
      mintEnabled_: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      owner_: string,
      name_: string,
      symbol_: string,
      mintCurrencyAddress_: string,
      mintPrice_: number | BN | string,
      mintProceedsRecipient_: string,
      tokenCap_: number | BN | string,
      mintStartTime_: number | BN | string,
      mintEndTime_: number | BN | string,
      mintEnabled_: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    sendTransaction(
      owner_: string,
      name_: string,
      symbol_: string,
      mintCurrencyAddress_: string,
      mintPrice_: number | BN | string,
      mintProceedsRecipient_: string,
      tokenCap_: number | BN | string,
      mintStartTime_: number | BN | string,
      mintEndTime_: number | BN | string,
      mintEnabled_: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      owner_: string,
      name_: string,
      symbol_: string,
      mintCurrencyAddress_: string,
      mintPrice_: number | BN | string,
      mintProceedsRecipient_: string,
      tokenCap_: number | BN | string,
      mintStartTime_: number | BN | string,
      mintEndTime_: number | BN | string,
      mintEnabled_: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  createdBy(
    arg0: string,
    arg1: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  createdCount(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  creatorOf(
    arg0: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  getSyndicateTreasuryAddress(
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  owner(txDetails?: Truffle.TransactionDetails): Promise<string>;

  pause: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  paused(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

  renounceOwnership: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  setFee: {
    (
      tokenCreationFee_: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      tokenCreationFee_: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      tokenCreationFee_: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      tokenCreationFee_: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  setSyndicateTreasuryAddress: {
    (
      syndicateTreasuryAddress_: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      syndicateTreasuryAddress_: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      syndicateTreasuryAddress_: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      syndicateTreasuryAddress_: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  tokenAddresses(
    arg0: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  tokenCreationFee(txDetails?: Truffle.TransactionDetails): Promise<BN>;

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

  unpause: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  methods: {
    createERC721: {
      (
        owner_: string,
        name_: string,
        symbol_: string,
        mintCurrencyAddress_: string,
        mintPrice_: number | BN | string,
        mintProceedsRecipient_: string,
        tokenCap_: number | BN | string,
        mintStartTime_: number | BN | string,
        mintEndTime_: number | BN | string,
        mintEnabled_: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        owner_: string,
        name_: string,
        symbol_: string,
        mintCurrencyAddress_: string,
        mintPrice_: number | BN | string,
        mintProceedsRecipient_: string,
        tokenCap_: number | BN | string,
        mintStartTime_: number | BN | string,
        mintEndTime_: number | BN | string,
        mintEnabled_: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      sendTransaction(
        owner_: string,
        name_: string,
        symbol_: string,
        mintCurrencyAddress_: string,
        mintPrice_: number | BN | string,
        mintProceedsRecipient_: string,
        tokenCap_: number | BN | string,
        mintStartTime_: number | BN | string,
        mintEndTime_: number | BN | string,
        mintEnabled_: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        owner_: string,
        name_: string,
        symbol_: string,
        mintCurrencyAddress_: string,
        mintPrice_: number | BN | string,
        mintProceedsRecipient_: string,
        tokenCap_: number | BN | string,
        mintStartTime_: number | BN | string,
        mintEndTime_: number | BN | string,
        mintEnabled_: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    createdBy(
      arg0: string,
      arg1: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    createdCount(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    creatorOf(
      arg0: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    getSyndicateTreasuryAddress(
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    owner(txDetails?: Truffle.TransactionDetails): Promise<string>;

    pause: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    paused(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

    renounceOwnership: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    setFee: {
      (
        tokenCreationFee_: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        tokenCreationFee_: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        tokenCreationFee_: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        tokenCreationFee_: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    setSyndicateTreasuryAddress: {
      (
        syndicateTreasuryAddress_: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        syndicateTreasuryAddress_: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        syndicateTreasuryAddress_: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        syndicateTreasuryAddress_: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    tokenAddresses(
      arg0: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    tokenCreationFee(txDetails?: Truffle.TransactionDetails): Promise<BN>;

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

    unpause: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
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

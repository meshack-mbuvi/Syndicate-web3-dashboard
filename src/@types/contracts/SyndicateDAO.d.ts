/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from 'bn.js';
import { EventData, PastEventOptions } from 'web3-eth-contract';

export interface SyndicateDAOContract
  extends Truffle.Contract<SyndicateDAOInstance> {
  'new'(meta?: Truffle.TransactionDetails): Promise<SyndicateDAOInstance>;
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

export interface Paused {
  name: 'Paused';
  args: {
    account: string;
    0: string;
  };
}

export interface Unpaused {
  name: 'Unpaused';
  args: {
    account: string;
    0: string;
  };
}

type AllEvents = OwnershipTransferred | Paused | Unpaused;

export interface SyndicateDAOInstance extends Truffle.ContractInstance {
  createERC20: {
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

  setSynERC20Factory: {
    (a: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(a: string, txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(
      a: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      a: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  setSynERC721Factory: {
    (a: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(a: string, txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(
      a: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      a: string,
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

  unpause: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  methods: {
    createERC20: {
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

    setSynERC20Factory: {
      (a: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(a: string, txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(
        a: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        a: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    setSynERC721Factory: {
      (a: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(a: string, txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(
        a: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        a: string,
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

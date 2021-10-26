/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface UserContract extends Truffle.Contract<UserInstance> {
  "new"(
    _synERC20: string,
    meta?: Truffle.TransactionDetails
  ): Promise<UserInstance>;
}

type AllEvents = never;

export interface UserInstance extends Truffle.ContractInstance {
  balanceOf(
    account: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

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

  daoConfigureMint: {
    (
      mintCurrencyAddress: string,
      mintPrice_: number | BN | string,
      mintProceedsRecipient_: string,
      tokenCap_: number | BN | string,
      mintStartTime_: number | BN | string,
      mintEndTime_: number | BN | string,
      mintEnabled_: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      mintCurrencyAddress: string,
      mintPrice_: number | BN | string,
      mintProceedsRecipient_: string,
      tokenCap_: number | BN | string,
      mintStartTime_: number | BN | string,
      mintEndTime_: number | BN | string,
      mintEnabled_: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      mintCurrencyAddress: string,
      mintPrice_: number | BN | string,
      mintProceedsRecipient_: string,
      tokenCap_: number | BN | string,
      mintStartTime_: number | BN | string,
      mintEndTime_: number | BN | string,
      mintEnabled_: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      mintCurrencyAddress: string,
      mintPrice_: number | BN | string,
      mintProceedsRecipient_: string,
      tokenCap_: number | BN | string,
      mintStartTime_: number | BN | string,
      mintEndTime_: number | BN | string,
      mintEnabled_: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  daoMint: {
    (
      amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  daoRagekick: {
    (
      account: string,
      amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      account: string,
      amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      account: string,
      amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      account: string,
      amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  daoSetMaxMembers: {
    (
      count: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      count: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      count: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      count: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  daoTransfer: {
    (
      sender: string,
      recipient: string,
      amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      sender: string,
      recipient: string,
      amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      sender: string,
      recipient: string,
      amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      sender: string,
      recipient: string,
      amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  getContractMetadata(
    metadataKey: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

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

  methods: {
    balanceOf(
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

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

    daoConfigureMint: {
      (
        mintCurrencyAddress: string,
        mintPrice_: number | BN | string,
        mintProceedsRecipient_: string,
        tokenCap_: number | BN | string,
        mintStartTime_: number | BN | string,
        mintEndTime_: number | BN | string,
        mintEnabled_: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        mintCurrencyAddress: string,
        mintPrice_: number | BN | string,
        mintProceedsRecipient_: string,
        tokenCap_: number | BN | string,
        mintStartTime_: number | BN | string,
        mintEndTime_: number | BN | string,
        mintEnabled_: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        mintCurrencyAddress: string,
        mintPrice_: number | BN | string,
        mintProceedsRecipient_: string,
        tokenCap_: number | BN | string,
        mintStartTime_: number | BN | string,
        mintEndTime_: number | BN | string,
        mintEnabled_: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        mintCurrencyAddress: string,
        mintPrice_: number | BN | string,
        mintProceedsRecipient_: string,
        tokenCap_: number | BN | string,
        mintStartTime_: number | BN | string,
        mintEndTime_: number | BN | string,
        mintEnabled_: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    daoMint: {
      (
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    daoRagekick: {
      (
        account: string,
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        account: string,
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        account: string,
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        account: string,
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    daoSetMaxMembers: {
      (
        count: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        count: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        count: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        count: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    daoTransfer: {
      (
        sender: string,
        recipient: string,
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        sender: string,
        recipient: string,
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        sender: string,
        recipient: string,
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        sender: string,
        recipient: string,
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    getContractMetadata(
      metadataKey: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

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

    "mint(uint256,uint256)": {
      (
        amount: number | BN | string,
        minimumTokens: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        amount: number | BN | string,
        minimumTokens: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        amount: number | BN | string,
        minimumTokens: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        amount: number | BN | string,
        minimumTokens: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    "mint(uint256)": {
      (
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        amount: number | BN | string,
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

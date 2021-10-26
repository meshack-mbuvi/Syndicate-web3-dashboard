/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface SynERC721FactoryContract
  extends Truffle.Contract<SynERC721FactoryInstance> {
  "new"(meta?: Truffle.TransactionDetails): Promise<SynERC721FactoryInstance>;
}

export interface ERC721SynERC721CreatedDefault {
  name: "ERC721SynERC721CreatedDefault";
  args: {
    tokenAddress: string;
    name: string;
    symbol: string;
    0: string;
    1: string;
    2: string;
  };
}

export interface ERC721SynERC721CreatedWithParams {
  name: "ERC721SynERC721CreatedWithParams";
  args: {
    tokenAddress: string;
    name: string;
    symbol: string;
    mintCurrencyAddress: string;
    mintPrice: BN;
    mintProceedsRecipient: string;
    tokenCap: BN;
    mintStartTime: BN;
    mintEndTime: BN;
    mintEnabled: boolean;
    0: string;
    1: string;
    2: string;
    3: string;
    4: BN;
    5: string;
    6: BN;
    7: BN;
    8: BN;
    9: boolean;
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

export interface Paused {
  name: "Paused";
  args: {
    account: string;
    0: string;
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
  | ERC721SynERC721CreatedDefault
  | ERC721SynERC721CreatedWithParams
  | OwnershipTransferred
  | Paused
  | SyndicateTreasuryAddressUpdated
  | Unpaused;

export interface SynERC721FactoryInstance extends Truffle.ContractInstance {
  createdCount(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  getSyndicateTreasuryAddress(
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  membershipAddresses(
    arg0: number | BN | string,
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
    createdCount(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    getSyndicateTreasuryAddress(
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    membershipAddresses(
      arg0: number | BN | string,
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

    "createERC721(string,string)": {
      (
        name_: string,
        symbol_: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        name_: string,
        symbol_: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      sendTransaction(
        name_: string,
        symbol_: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        name_: string,
        symbol_: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    "createERC721(string,string,address,uint256,address,uint256,uint256,uint256,bool)": {
      (
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
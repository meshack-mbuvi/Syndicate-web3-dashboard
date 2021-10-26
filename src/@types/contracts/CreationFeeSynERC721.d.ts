/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface CreationFeeSynERC721Contract
  extends Truffle.Contract<CreationFeeSynERC721Instance> {
  "new"(
    meta?: Truffle.TransactionDetails
  ): Promise<CreationFeeSynERC721Instance>;
}

export interface log {
  name: "log";
  args: {
    0: string;
  };
}

export interface log_address {
  name: "log_address";
  args: {
    0: string;
  };
}

export interface log_bytes {
  name: "log_bytes";
  args: {
    0: string;
  };
}

export interface log_bytes32 {
  name: "log_bytes32";
  args: {
    0: string;
  };
}

export interface log_int {
  name: "log_int";
  args: {
    0: BN;
  };
}

export interface log_named_address {
  name: "log_named_address";
  args: {
    key: string;
    val: string;
    0: string;
    1: string;
  };
}

export interface log_named_bytes {
  name: "log_named_bytes";
  args: {
    key: string;
    val: string;
    0: string;
    1: string;
  };
}

export interface log_named_bytes32 {
  name: "log_named_bytes32";
  args: {
    key: string;
    val: string;
    0: string;
    1: string;
  };
}

export interface log_named_decimal_int {
  name: "log_named_decimal_int";
  args: {
    key: string;
    val: BN;
    decimals: BN;
    0: string;
    1: BN;
    2: BN;
  };
}

export interface log_named_decimal_uint {
  name: "log_named_decimal_uint";
  args: {
    key: string;
    val: BN;
    decimals: BN;
    0: string;
    1: BN;
    2: BN;
  };
}

export interface log_named_int {
  name: "log_named_int";
  args: {
    key: string;
    val: BN;
    0: string;
    1: BN;
  };
}

export interface log_named_string {
  name: "log_named_string";
  args: {
    key: string;
    val: string;
    0: string;
    1: string;
  };
}

export interface log_named_uint {
  name: "log_named_uint";
  args: {
    key: string;
    val: BN;
    0: string;
    1: BN;
  };
}

export interface log_string {
  name: "log_string";
  args: {
    0: string;
  };
}

export interface log_uint {
  name: "log_uint";
  args: {
    0: BN;
  };
}

export interface logs {
  name: "logs";
  args: {
    0: string;
  };
}

type AllEvents =
  | log
  | log_address
  | log_bytes
  | log_bytes32
  | log_int
  | log_named_address
  | log_named_bytes
  | log_named_bytes32
  | log_named_decimal_int
  | log_named_decimal_uint
  | log_named_int
  | log_named_string
  | log_named_uint
  | log_string
  | log_uint
  | logs;

export interface CreationFeeSynERC721Instance extends Truffle.ContractInstance {
  IS_TEST(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

  failed(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

  setUp: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  testDefault: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  testLessThenFee: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  testMoreThenFee: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  testNoFee: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  methods: {
    IS_TEST(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

    failed(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

    setUp: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    testDefault: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    testLessThenFee: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    testMoreThenFee: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    testNoFee: {
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

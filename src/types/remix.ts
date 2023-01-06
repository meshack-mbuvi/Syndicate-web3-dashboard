export interface Tx {
  from: string;
  to: string;
  data: string;
  gas: string;
}

export interface FuncInput {
  name: string;
  type: string;
  indexed?: boolean;
}

export interface FuncABI {
  name: string;
  type: string;
  inputs: FuncInput[];
  stateMutability: string;
  anonymous?: boolean;
  outputs?: any[];
  payable?: boolean;
  constant?: any;
}

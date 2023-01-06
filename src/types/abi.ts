export interface ContractDetails {
  contractAddress: string;
  chainId: number;
  abi?: string | any[];
  compilerVersion?: string;
  contractName?: string;
  sourceCode?: string;
}

export interface SourceCodeDetails {
  SourceCode: string;
  ABI: string;
  ContractName: string;
  CompilerVersion: string;
  OptimizationUsed: string;
  Runs: string;
  ConstructorArguments: string;
  EVMVersion: string;
  Library: string;
  LicenseType: string;
  Proxy: string;
  Implementation: string;
  SwarmSource: string;
}

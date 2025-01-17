import { IActiveNetwork } from '@/state/wallet/types';
import { Dispatch, SetStateAction } from 'react';
import NativeTokenPriceMerkleMintModule_ABI from 'src/contracts/NativeTokenPriceMerkleMintModule.json';
import { ContractBase } from './ContractBase';

export class NativeTokenPriceMerkleMintModule extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(
      address,
      web3,
      activeNetwork,
      NativeTokenPriceMerkleMintModule_ABI as AbiItem[]
    );
  }

  public async mint(
    account: string,
    price: string,
    collective: string,
    merkleProof: string[],
    amount: string,
    onTxConfirm: (transactionHash: string) => void,
    onTxReceipt: (receipt: TransactionReceipt) => void,
    onTxFail: (err: string) => void
  ): Promise<void> {
    await this.send(
      account,
      () => this.contract.methods.mint(collective, merkleProof, amount),
      onTxConfirm,
      onTxReceipt,
      onTxFail,
      price
    );
  }

  public async getEstimateGas(
    account: string,
    price: string,
    collective: string,
    merkleProof: string[],
    amount: string,
    onResponse: Dispatch<SetStateAction<number>>
  ): Promise<void> {
    this.estimateGas(
      account,
      () => this.contract.methods.mint(collective, merkleProof, amount),
      onResponse,
      price
    );
  }

  async nativePrice(collective: string): Promise<string> {
    try {
      return this.contract.methods.nativePrice(collective).call();
    } catch (error) {
      return '';
    }
  }

  async merkleRoot(collective: string): Promise<string> {
    try {
      return this.contract.methods.merkleRoot(collective).call();
    } catch (error) {
      return '';
    }
  }
}

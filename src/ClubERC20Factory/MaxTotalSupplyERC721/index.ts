import MAX_TOTAL_SUPPLY_ERC721_ABI from '@/contracts/MaxTotalSupplyERC721.json';
import { IActiveNetwork } from '@/state/wallet/types';
import { Dispatch, SetStateAction } from 'react';
import { ContractBase } from '../ContractBase';

export class MaxTotalSupplyERC721 extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(
      address,
      web3,
      activeNetwork,
      MAX_TOTAL_SUPPLY_ERC721_ABI as AbiItem[]
    );
  }

  public setTotalSupplyRequirements(token: string, number: number): string {
    return this.web3.eth.abi.encodeFunctionCall(
      this.getAbiObject('setMixinRequirements') as AbiItem,
      [token, number] as string[]
    );
  }

  public async updateTotalSupply(
    account: string,
    token: string,
    totalSupply: number,
    onTxConfirm: (transactionHash: any) => void,
    onTxReceipt: (receipt: any) => void,
    onTxFail: (err: any) => void
  ): Promise<void> {
    await this.send(
      account,
      () => this.contract.methods.setMixinRequirements(token, totalSupply),
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  }

  public async getEstimateGas(
    account: string,
    token: string,
    totalSupply: number,
    onResponse: Dispatch<SetStateAction<number>>
  ): Promise<void> {
    this.estimateGas(
      account,
      () => this.contract.methods.setMixinRequirements(token, totalSupply),
      onResponse
    );
  }
}

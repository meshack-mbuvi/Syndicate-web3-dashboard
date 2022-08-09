import FIXED_RENDERER_ABI from '@/contracts/FixedRenderer.json';
import { IActiveNetwork } from '@/state/wallet/types';
import { ContractBase } from '../ContractBase';

export class FixedRenderer extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(address, web3, activeNetwork, FIXED_RENDERER_ABI as AbiItem[]);
  }

  // Set token URI
  public setTokenURI(token: string, uri: string): string {
    return this.web3.eth.abi.encodeFunctionCall(
      this.getAbiObject('updateTokenURI'),
      [token, uri]
    );
  }

  public async updateTokenURI(
    account: string,
    token: string,
    uri: number,
    onTxConfirm: (transactionHash) => void,
    onTxReceipt: (receipt) => void,
    onTxFail: (err) => void
  ): Promise<void> {
    await this.send(
      account,
      () => this.contract.methods.updateTokenURI(token, uri),
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  }

  public async getEstimateGas(
    account: string,
    token: string,
    uri: number,
    onResponse: (gas?: number) => void
  ): Promise<void> {
    this.estimateGas(
      account,
      () => this.contract.methods.updateTokenURI(token, uri),
      onResponse
    );
  }
}

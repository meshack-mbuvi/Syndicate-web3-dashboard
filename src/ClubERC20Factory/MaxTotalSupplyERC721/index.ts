import MAX_TOTAL_SUPPLY_ERC721_ABI from '@/contracts/MaxTotalSupplyERC721.json';
import { IActiveNetwork } from '@/state/wallet/types';
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
      // @ts-expect-error TS(2345): Argument of type 'AbiItem | undefined' is not assi... Remove this comment to see the full error message
      this.getAbiObject('setMixinRequirements'),
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
    onResponse: (gas?: number) => void
  ): Promise<void> {
    this.estimateGas(
      account,
      () => this.contract.methods.setMixinRequirements(token, totalSupply),
      onResponse
    );
  }
}

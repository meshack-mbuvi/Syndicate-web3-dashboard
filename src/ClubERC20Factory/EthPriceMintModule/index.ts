import ETH_PRICE_MINT_MODULE_ABI from '@/contracts/EthPriceMintModule.json';
import { IActiveNetwork } from '@/state/wallet/types';
import { ContractBase } from '../ContractBase';

export class EthPriceMintModule extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(address, web3, activeNetwork, ETH_PRICE_MINT_MODULE_ABI as AbiItem[]);
  }

  public setEthPrice(token: string, price: string): string {
    return this.web3.eth.abi.encodeFunctionCall(
      this.getAbiObject('updateEthPrice'),
      [token, price]
    );
  }

  public async updatePrice(
    account: string,
    token: string,
    price: string,
    onTxConfirm: (transactionHash) => void,
    onTxReceipt: (receipt) => void,
    onTxFail: (err) => void
  ): Promise<void> {
    await this.send(
      account,
      () => this.contract.methods.updateEthPrice(token, price),
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  }

  public async getEstimateGas(
    account: string,
    onResponse: (gas?: number) => void
  ): Promise<void> {
    this.estimateGas(
      account,
      () =>
        this.contract.methods.updateEthPrice(
          '0x0000000000000000000000000000000000000000',
          this.web3.utils.toWei('0.5')
        ),
      onResponse
    );
  }
}

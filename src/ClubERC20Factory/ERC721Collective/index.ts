import ERC721_COLLECTIVE_ABI from 'src/contracts/ERC721Collective.json';
import { IActiveNetwork } from '@/state/wallet/types';
import { ContractBase } from '../ContractBase';

export class ERC721Collective extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(address, web3, activeNetwork, ERC721_COLLECTIVE_ABI as AbiItem[]);
  }

  // Create Allow transfer
  public setTransferGuard(guard: string): string {
    return this.web3.eth.abi.encodeFunctionCall(
      this.getAbiObject('updateTransferGuard'),
      [guard]
    );
  }

  // Update Allow transfer
  public async updateTransferGuard(
    account: string,
    collectiveAddress: string,
    isAllowed: boolean,
    onTxConfirm: (transactionHash) => void,
    onTxReceipt: (receipt) => void,
    onTxFail: (err) => void
  ): Promise<void> {
    const contract = new this.web3.eth.Contract(
      ERC721_COLLECTIVE_ABI as AbiItem[],
      collectiveAddress
    );

    const guardToken = isAllowed
      ? this.addresses.GuardAlwaysAllow
      : this.addresses.GuardNeverAllow;

    await this.send(
      account,
      () => contract.methods.updateTransferGuard(guardToken),
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  }

  public async getEstimateGas(
    account: string,
    collectiveAddress: string,
    isAllowed: boolean,
    onResponse: (gas?: number) => void
  ): Promise<void> {
    const collectiveContract = new this.web3.eth.Contract(
      ERC721_COLLECTIVE_ABI as AbiItem[],
      collectiveAddress
    );

    const guardToken = isAllowed
      ? this.addresses.GuardAlwaysAllow
      : this.addresses.GuardNeverAllow;

    await new Promise(() => {
      collectiveContract.methods.updateTransferGuard(guardToken).estimateGas(
        {
          from: account
        },
        (_error, gasAmount) => {
          if (gasAmount) onResponse(gasAmount);
        }
      );
    });
  }

  public async name(collectiveAddress: string): Promise<string> {
    const collectiveContract = new this.web3.eth.Contract(
      ERC721_COLLECTIVE_ABI as AbiItem[],
      collectiveAddress
    );
    try {
      return collectiveContract.methods.name().call();
    } catch (error) {
      return '';
    }
  }
}

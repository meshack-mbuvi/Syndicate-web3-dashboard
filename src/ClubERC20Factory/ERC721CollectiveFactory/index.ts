import ERC721_Collective_Factory_ABI from 'src/contracts/ERC721CollectiveFactory.json';
import { IActiveNetwork } from '@/state/wallet/types';
import { estimateGas } from '../shared/getGasEstimate';
import { getGnosisTxnInfo } from '../shared/gnosisTransactionInfo';

export class ERC721CollectiveFactory {
  web3;
  address;
  activeNetwork;
  erc721CollectiveFactory;

  // initialize new instance of ERC721CollectiveFactory
  constructor(
    erc721CollectiveFactoryAddress: string,
    web3: Web3,
    activeNetwork: IActiveNetwork
  ) {
    this.web3 = web3;
    this.activeNetwork = activeNetwork;
    this.address = erc721CollectiveFactoryAddress;
    this.init();
  }

  init(): void {
    try {
      this.erc721CollectiveFactory = new this.web3.eth.Contract(
        ERC721_Collective_Factory_ABI,
        this.address
      );
    } catch (error) {
      this.erc721CollectiveFactory = null;
    }
  }

  /**
   *
   * @param account address
   * @param collectiveName Name of token
   * @param collectiveSymbol Symbol of token
   * @param salt random salt for deterministic token creation
   * @param contractAddresses `setupContracts` array of contracts to setup
   * @param encodedFunctions array of bytes for setup contract calls
   * @param onTxConfirm
   * @param onTxReceipt
   * @param onTxFail
   */
  public async createERC721Collective(
    account: string,
    collectiveName: string,
    collectiveSymbol: string,
    salt: number,
    contractAddresses: string[],
    encodedFunctions: string[],
    onTxConfirm: (transactionHash) => void,
    onTxReceipt: (receipt) => void,
    onTxFail: (err) => void
  ): Promise<void> {
    let gnosisTxHash;
    const gasEstimate = await estimateGas(this.web3);

    await new Promise((resolve, reject) => {
      this.erc721CollectiveFactory.methods
        .create(
          collectiveName,
          collectiveSymbol,
          salt,
          contractAddresses,
          encodedFunctions
        )
        .send({ from: account, gasPrice: gasEstimate })
        .on('transactionHash', (transactionHash) => {
          onTxConfirm(transactionHash);
          if (
            this.web3._provider.wc?._peerMeta.name === 'Gnosis Safe Multisig'
          ) {
            gnosisTxHash = transactionHash;
            resolve(transactionHash);
            onTxConfirm('');
          }
        })
        .on('receipt', (receipt) => {
          onTxReceipt(receipt);
          resolve(receipt);
        })
        .on('error', (err) => {
          onTxFail(err);
          reject(err);
        });
    });

    if (gnosisTxHash) {
      const receipt: any = await getGnosisTxnInfo(
        gnosisTxHash,
        this.activeNetwork
      );
      onTxConfirm(receipt.transactionHash);
      if (receipt.isSuccessful) {
        onTxReceipt(receipt);
      } else {
        onTxFail('Transaction failed');
      }
    }
  }

  /**
   * Predict collective token address for given salt
   * @param account address
   * @param salt Salt for determinisitic clone
   * @returns token Address of token created with salt
   */
  public async predictAddress(account: string, salt: number): Promise<string> {
    return this.erc721CollectiveFactory.methods
      .predictAddress(salt)
      .call({ from: account });
  }

  public async getEstimateGas(
    account: string,
    onResponse: (gas?: number) => void
  ): Promise<void> {
    const collectiveName = 'Alpha Beta Punks';
    const collectiveSymbol = 'ABP';
    const salt = this.web3.utils.randomHex(32);
    const contractAddresses = [];
    const encodedFunctions = [];

    await new Promise(() => {
      this.erc721CollectiveFactory.methods
        .create(
          collectiveName,
          collectiveSymbol,
          salt,
          contractAddresses,
          encodedFunctions
        )
        .estimateGas(
          {
            from: account
          },
          (_error, gasAmount) => {
            if (gasAmount) onResponse(gasAmount);
          }
        );
    });
  }
}

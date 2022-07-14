import ERC721_Collective_Factory_ABI from 'src/contracts/ERC721CollectiveFactory.json';
import { IActiveNetwork } from '@/state/wallet/types';
import { estimateGas } from '../shared/getGasEstimate';
import { getGnosisTxnInfo } from '../shared/gnosisTransactionInfo';
import { EncodeCalls } from './encodeCalls';

export class ERC721CollectiveFactory extends EncodeCalls {
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
    super(web3);
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
    const salt =
      '0x02271e58cc5c822122e55c712498a56de338e73d3747e71d8d0c79e896f8e080';
    const contractAddresses = [
      '0x723541996f751ea24608e9de75488746a067d61b',
      '0x50ab2de08f81522fffe1156af22374d37222e14f',
      '0x487e27ae8b6f68719eb64d46b5fe81bb04e28c46',
      '0xe868fa053925fe8bce31fc7d5272c4b4aa82477b',
      '0xe868fa053925fe8bce31fc7d5272c4b4aa82477b',
      '0x89583ad6aba72c7c6de70ee9a290884abc4000c3',
      '0x6c4f220416751503e81e38deee9899082a803275'
    ];
    const encodedFunctions = [
      '0x185deab8000000000000000000000000ff8012d695cb421ed4cea306f348541064069853000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000646e55cd',
      '0x941a112c000000000000000000000000ff8012d695cb421ed4cea306f3485410640698530000000000000000000000000000000000000000000000000000000000002710',
      '0x941a112c000000000000000000000000ff8012d695cb421ed4cea306f3485410640698530000000000000000000000000000000000000000000000000000000000000003',
      '0x32ec2295000000000000000000000000ff8012d695cb421ed4cea306f34854106406985300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000003000000000000000000000000723541996f751ea24608e9de75488746a067d61b000000000000000000000000487e27ae8b6f68719eb64d46b5fe81bb04e28c4600000000000000000000000050ab2de08f81522fffe1156af22374d37222e14f',
      '0xe31b8f3b000000000000000000000000ff8012d695cb421ed4cea306f34854106406985300000000000000000000000089583ad6aba72c7c6de70ee9a290884abc4000c30000000000000000000000000000000000000000000000000000000000000001',
      '0x2f24b6f8000000000000000000000000ff8012d695cb421ed4cea306f34854106406985300000000000000000000000000000000000000000000000006f05b59d3b20000',
      '0xf6a4b4d7000000000000000000000000ff8012d695cb421ed4cea306f3485410640698530000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000b697066733a2f2f68617368000000000000000000000000000000000000000000'
    ];

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

import DISTRIBUTION_ETH_ABI from 'src/contracts/DistributionModuleEth.json';
import CLUB_ERC20_FACTORY_NATIVE_ABI from 'src/contracts/ClubERC20FactoryEth.json';
import { getGnosisTxnInfo } from '../shared/gnosisTransactionInfo';
import { estimateGas } from '../shared/getGasEstimate';

export class ClubERC20FactoryNative {
  web3;
  address;
  clubERC20FactoryEth;
  distributionETH;
  clubERC20FactoryNative;
  activeNetwork;

  // initialize new instance of clubERC20FactoryNativeAddress
  constructor(clubERC20FactoryNativeAddress: string, web3: any, activeNetwork) {
    this.web3 = web3;
    this.activeNetwork = activeNetwork;
    this.address = clubERC20FactoryNativeAddress;
    this.init();
  }

  init(): void {
    try {
      this.clubERC20FactoryNative = new this.web3.eth.Contract(
        CLUB_ERC20_FACTORY_NATIVE_ABI,
        this.address
      );
      this.distributionETH = new this.web3.eth.Contract(
        DISTRIBUTION_ETH_ABI,
        this.address
      );
    } catch (error) {
      this.clubERC20FactoryEth = null;
      this.distributionETH = null;
      this.clubERC20FactoryNative = null;
    }
  }

  /**
   * This method creates a new ERC20 token/syndicate.
   * The assumption made here is that all validation has been taken care of
   * prior to calling this function.
   *
   * @param account
   * @param clubTokenName
   * @param tokenSymbol
   * @param startTime
   * @param endTime
   * @param tokenCap
   * @param maxMembers
   * @param onTxConfirm
   * @param onTxReceipt
   */
  public async createERC20(
    account: string,
    clubTokenName: string,
    tokenSymbol: string,
    startTime: number,
    endTime: number,
    tokenCap: string,
    maxMembers: number,
    onTxConfirm: (transactionHash?) => void,
    onTxReceipt: (receipt?) => void
  ): Promise<void> {
    let gnosisTxHash;

    if (!this.clubERC20FactoryNative) {
      await this.init();
    }

    const gasEstimate = await estimateGas(this.web3);

    await new Promise((resolve, reject) => {
      this.clubERC20FactoryNative.methods
        .createWithMintParams(
          clubTokenName, // name of club token
          tokenSymbol, // symbol
          startTime, // 1635156220, // mint start
          endTime, // 1637834620, // mint end - close date
          maxMembers,
          tokenCap, // BigInt(5000 * 10 ** 18), // token CAP
          '0x0000000000000000000000000000000000000000',
          0
        )
        .send({ from: account, gasPrice: gasEstimate })
        .on('transactionHash', (transactionHash) => {
          if (
            this.web3._provider.wc?._peerMeta.name === 'Gnosis Safe Multisig'
          ) {
            gnosisTxHash = transactionHash;
            resolve(transactionHash);
            onTxConfirm('');
          } else {
            onTxConfirm(transactionHash);
          }
        })
        .on('receipt', (receipt) => {
          onTxReceipt(receipt);
          resolve(receipt);
        })
        .on('error', (error) => {
          reject(error);
        });
    });

    // fallback for gnosisSafe <> walletConnect
    if (gnosisTxHash) {
      const receipt: any = await getGnosisTxnInfo(
        gnosisTxHash,
        this.activeNetwork
      );
      onTxConfirm(receipt.transactionHash);

      const createEvents = await this.clubERC20FactoryNative.getPastEvents(
        'ClubERC20Created',
        {
          filter: { transactionHash: receipt.transactionHash },
          fromBlock: receipt.blockNumber,
          toBlock: receipt.blockNumber
        }
      );

      if (receipt.isSuccessful) {
        onTxReceipt({
          ...receipt,
          events: { ClubERC20Created: createEvents[0] }
        });
      } else {
        throw 'Transaction Failed';
      }
    }
  }

  /**
   * gets gas estimate for distributing ETH
   * @param account string
   * @param onResponse called on success
   *
   * multiMemberDistribute arguments are hardcoded to estimate an example.
   *
   */
  public async getEstimateGasDistributeETH(
    account: string,
    onResponse: (gas?: number) => void
  ): Promise<void> {
    // dummy data, update later
    const address = '0x5aff668d0c7c5c2df387a45b72520d14cced7dfb';
    const members = [
      '0x110bc6e5fe887beebb260028d6c95e42a2b5269c',
      '0x7ce087be0a01efd0f09ab8fd7b6e9ca34a3af39b',
      '0xb2d4a447f20d39e0cf01ce673473111e2a030696',
      '0xcfb137afd464196e1ddf45dda6b7117d697c17e0'
    ];
    const batchIdentifier = 'batch123';

    await new Promise(() => {
      this.distributionETH.methods
        .multiMemberDistribute(address, members, batchIdentifier)
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

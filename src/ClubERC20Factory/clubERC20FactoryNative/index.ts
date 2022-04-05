import CLUB_ERC20_FACTORY_NATIVE_ABI from 'src/contracts/ClubERC20FactoryEth.json';
import { getGnosisTxnInfo } from '../shared/gnosisTransactionInfo';
import { estimateGas } from '../shared/getGasEstimate';

export class ClubERC20FactoryNative {
  web3;
  address;
  clubERC20FactoryNative;

  // initialize new instance of clubERC20FactoryNativeAddress
  constructor(clubERC20FactoryNativeAddress: string, web3: any) {
    this.web3 = web3;
    this.address = clubERC20FactoryNativeAddress;
    this.init();
  }

  init(): void {
    try {
      this.clubERC20FactoryNative = new this.web3.eth.Contract(
        CLUB_ERC20_FACTORY_NATIVE_ABI,
        this.address
      );
    } catch (error) {
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
      const receipt: any = await getGnosisTxnInfo(gnosisTxHash);
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
}

import CLUB_ERC20_FACTORY_ETH_ABI from 'src/contracts/ClubERC20FactoryEth.json';
import { getGnosisTxnInfo } from '../shared/gnosisTransactionInfo';

export class ClubERC20FactoryEth {
  web3;
  address;
  clubERC20FactoryEth;

  // initialize new instance of clubERC20FactoryEthAddress
  constructor(clubERC20FactoryEthAddress: string, web3: any) {
    this.web3 = web3;
    this.address = clubERC20FactoryEthAddress;
    this.init();
  }

  init(): void {
    try {
      this.clubERC20FactoryEth = new this.web3.eth.Contract(
        CLUB_ERC20_FACTORY_ETH_ABI,
        this.address
      );
    } catch (error) {
      this.clubERC20FactoryEth = null;
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

    if (!this.clubERC20FactoryEth) {
      await this.init();
    }

    await new Promise((resolve, reject) => {
      this.clubERC20FactoryEth.methods
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
        .send({ from: account })
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

      const createEvents = await this.clubERC20FactoryEth.getPastEvents(
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

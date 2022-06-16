import { isDev } from '@/utils/environment';
import CLUB_ERC20_FACTORY_ABI from 'src/contracts/ERC20ClubFactoryDepositToken.json';
import DISTRIBUTION_ERC20_ABI from 'src/contracts/DistributionModuleERC20.json';
import { getGnosisTxnInfo } from '../shared/gnosisTransactionInfo';
import { estimateGas } from '../shared/getGasEstimate';

export class ClubERC20Factory {
  web3;
  address;
  clubERC20Factory;
  distributionERC20;
  activeNetwork;

  // initialize new instance of clubERC20FactoryAddress
  constructor(clubERC20FactoryAddress: string, web3: any, activeNetwork) {
    this.web3 = web3;
    this.activeNetwork = activeNetwork;
    this.address = clubERC20FactoryAddress;
    this.init();
  }

  init(): void {
    try {
      this.clubERC20Factory = new this.web3.eth.Contract(
        CLUB_ERC20_FACTORY_ABI,
        this.address
      );
      this.distributionERC20 = new this.web3.eth.Contract(
        DISTRIBUTION_ERC20_ABI,
        this.address
      );
    } catch (error) {
      this.clubERC20Factory = null;
      this.distributionERC20 = null;
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
   * @param usdcAddress
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
    usdcAddress: string,
    startTime: number,
    endTime: number,
    tokenCap: string,
    maxMembers: number,
    onTxConfirm: (transactionHash?) => void,
    onTxReceipt: (receipt?) => void
  ): Promise<void> {
    let gnosisTxHash;

    if (!this.clubERC20Factory) {
      await this.init();
    }
    const gasEstimate = await estimateGas(this.web3);

    await new Promise((resolve, reject) => {
      this.clubERC20Factory.methods
        .createWithMintParams(
          clubTokenName, // name of club token
          tokenSymbol, // symbol
          startTime, // 1635156220, // mint start
          endTime, // 1637834620, // mint end - close date
          maxMembers,
          tokenCap, // BigInt(5000 * 10 ** 18), // token CAP
          '0x0000000000000000000000000000000000000000',
          0,
          usdcAddress // USDC
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

      const createEvents = await this.clubERC20Factory.getPastEvents(
        'ERC20ClubCreated',
        {
          filter: { transactionHash: receipt.transactionHash },
          fromBlock: receipt.blockNumber,
          toBlock: receipt.blockNumber
        }
      );

      if (receipt.isSuccessful) {
        onTxReceipt({
          ...receipt,
          events: { ERC20ClubCreated: createEvents[0] }
        });
      } else {
        throw 'Transaction Failed';
      }
    }
  }

  /**
   * gets gas estimate
   * @param account string
   * @param onResponse called on success
   *
   * createWithMintParams arguments are hardcoded because;
   * 1. The gasEstimate function will always return same value, it doesn't matter whether you mint 50 or 5million.
   * 2. The gas estimate feature is at the first step of create flow, therefore, we can't use data from redux because it's empty.
   */
  public async getEstimateGas(
    account: string,
    onResponse: (gas?: number) => void
  ): Promise<void> {
    const clubTokenName = 'Alpha DAO';
    const tokenSymbol = 'ALDA';
    const startTime = parseInt((new Date().getTime() / 1000).toString());
    const endTime = 1688849940;
    const maxMembers = 99;
    const tokenCap = BigInt(5000 * 10 ** 18);
    const usdcAddress = isDev
      ? '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926'
      : '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

    await new Promise(() => {
      this.clubERC20Factory.methods
        .createWithMintParams(
          clubTokenName,
          tokenSymbol,
          startTime,
          endTime,
          maxMembers,
          tokenCap,
          '0x0000000000000000000000000000000000000000',
          0,
          usdcAddress
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

  /**
   * gets gas estimate for distributing ERC20 Tokens
   * @param account string
   * @param onResponse called on success
   *
   * multiMemberDistribute arguments are hardcoded to estimate an example.
   *
   */
  public async getEstimateGasDistributeERC20(
    account: string,
    onResponse: (gas?: number) => void
  ): Promise<void> {
    const address = '0x5aff668d0c7c5c2df387a45b72520d14cced7dfb';
    // using USDC
    const distributionERC20Address = isDev
      ? '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926'
      : '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
    const totalDistributionAmount = 10000;
    const members = [
      '0x110bc6e5fe887beebb260028d6c95e42a2b5269c',
      '0x7ce087be0a01efd0f09ab8fd7b6e9ca34a3af39b',
      '0xb2d4a447f20d39e0cf01ce673473111e2a030696',
      '0xcfb137afd464196e1ddf45dda6b7117d697c17e0'
    ];
    const batchIdentifier = 'batch123';

    await new Promise(() => {
      this.distributionERC20.methods
        .multiMemberDistribute(
          address,
          distributionERC20Address,
          totalDistributionAmount,
          members,
          batchIdentifier
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

import { IActiveNetwork, IWeb3 } from '@/state/wallet/types';
import { Dispatch, SetStateAction } from 'react';
import DISTRIBUTION_ERC20_ABI from 'src/contracts/DistributionModuleERC20.json';
import CLUB_ERC20_FACTORY_ABI from 'src/contracts/ERC20ClubFactoryDepositToken.json';
import { Contract } from 'web3-eth-contract';
import { estimateGas } from '../shared/getGasEstimate';
import { getGnosisTxnInfo } from '../shared/gnosisTransactionInfo';

export class ClubERC20Factory {
  web3;
  address;
  clubERC20Factory: Contract | null;
  distributionERC20: Contract | null;
  activeNetwork: IActiveNetwork;

  // initialize new instance of clubERC20FactoryAddress
  constructor(
    clubERC20FactoryAddress: string,
    web3: IWeb3,
    activeNetwork: IActiveNetwork
  ) {
    this.clubERC20Factory = null;
    this.distributionERC20 = null;
    this.web3 = web3;
    this.activeNetwork = activeNetwork;
    this.address = clubERC20FactoryAddress;
    this.init();
  }

  init(): void {
    try {
      this.clubERC20Factory = new this.web3.eth.Contract(
        CLUB_ERC20_FACTORY_ABI as AbiItem[],
        this.address
      );
      this.distributionERC20 = new this.web3.eth.Contract(
        DISTRIBUTION_ERC20_ABI as AbiItem[],
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
    onTxConfirm: (transactionHash?: any) => void,
    onTxReceipt: (receipt?: any) => void
  ): Promise<void> {
    let gnosisTxHash;

    if (!this.clubERC20Factory) {
      await this.init();
    }
    const gasEstimate = await estimateGas(this.web3);

    await new Promise((resolve, reject) => {
      this.clubERC20Factory?.methods
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
        .on('transactionHash', (transactionHash: any) => {
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
        .on('receipt', (receipt: any) => {
          onTxReceipt(receipt);
          resolve(receipt);
        })
        .on('error', (error: any) => {
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

      const createEvents = await this.clubERC20Factory?.getPastEvents(
        'ERC20ClubCreated',
        {
          filter: { transactionHash: receipt.transactionHash },
          fromBlock: receipt.blockNumber,
          toBlock: receipt.blockNumber
        }
      );

      if (receipt.isSuccessful && createEvents) {
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
    onResponse: Dispatch<SetStateAction<number>>
  ): Promise<void> {
    const clubTokenName = 'Alpha DAO';
    const tokenSymbol = 'ALDA';
    const startTime = parseInt((new Date().getTime() / 1000).toString());
    const endTime = 1688849940;
    const maxMembers = 99;
    const tokenCap = BigInt(5000 * 10 ** 18);
    const usdcAddress = {
      1: '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926',
      4: '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926',
      137: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
    };

    await new Promise(() => {
      this.clubERC20Factory?.methods
        .createWithMintParams(
          clubTokenName,
          tokenSymbol,
          startTime,
          endTime,
          maxMembers,
          tokenCap,
          '0x0000000000000000000000000000000000000000',
          0,
          usdcAddress[this.activeNetwork.chainId as keyof typeof usdcAddress]
        )
        .estimateGas(
          {
            from: account
          },
          (_error: any, gasAmount: any) => {
            if (gasAmount) onResponse(gasAmount);
          }
        );
    });
  }
}

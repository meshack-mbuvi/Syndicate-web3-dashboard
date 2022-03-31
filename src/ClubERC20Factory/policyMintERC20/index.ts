import MintPolicyABI from 'src/contracts/PolicyMintERC20.json';
import { getGnosisTxnInfo } from '../shared/gnosisTransactionInfo';

export class MintPolicyContract {
  web3;
  // This will be used to call other functions. eg mint
  mintPolicyContract;
  address;

  constructor(mintPolicyAddress: string, web3: Web3) {
    this.web3 = web3;
    this.mintPolicyContract = new this.web3.eth.Contract(
      MintPolicyABI,
      mintPolicyAddress
    );
    this.address = mintPolicyAddress;
  }

  init(): void {
    try {
      this.mintPolicyContract = new this.web3.eth.Contract(
        MintPolicyABI,
        this.address
      );
    } catch (error) {
      this.mintPolicyContract = null;
    }
  }

  /**
   * Returns a number of mint parameters for the clubERC20.
   * These include mint timelines, clubERC20 supply, maxMemberCount, and other deposit requirements.
   * @returns
   */
  async getSyndicateValues(address: string): Promise<{
    endTime;
    maxMemberCount;
    maxTotalSupply;
    requiredToken;
    requiredTokenMinBalance;
    startTime;
  }> {
    return this.mintPolicyContract.methods.configOf(address).call();
  }

  async isModuleAllowed(
    clubAddress: string,
    moduleAddress: string
  ): Promise<boolean> {
    return this.mintPolicyContract.methods
      .allowedModules(clubAddress, moduleAddress)
      .call();
  }

  /**
   * This method modifies an existing ERC20 syndicate.
   * The assumption made here is that all validation has been taken care of
   * prior to calling this function.
   *
   * @param wallet
   * @param club
   * @param startTime
   * @param endTime
   * @param maxMemberCount
   * @param maxTotalSupply
   * @param onTxConfirm
   * @param onTxReceipt
   *
   */
  public async modifyERC20(
    wallet: string,
    club: string,
    startTime: number,
    endTime: number,
    maxMemberCount: number,
    maxTotalSupply: number,
    onTxConfirm: (transactionHash?) => void,
    onTxReceipt: (receipt?) => void
  ): Promise<void> {
    let gnosisTxHash;

    if (!this.mintPolicyContract) {
      await this.init();
    }

    await new Promise((resolve, reject) => {
      this.mintPolicyContract.methods
        .updateConfig(club, [
          startTime,
          endTime,
          maxMemberCount,
          maxTotalSupply,
          '0x0000000000000000000000000000000000000000',
          0
        ])
        .send({ from: wallet })
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

      const createEvents = await this.mintPolicyContract.getPastEvents(
        'configUpdated',
        {
          filter: { transactionHash: receipt.transactionHash },
          fromBlock: receipt.blockNumber,
          toBlock: receipt.blockNumber
        }
      );

      if (receipt.isSuccessful) {
        onTxReceipt({
          ...receipt,
          events: { ConfigUpdated: createEvents[0] }
        });
      } else {
        throw 'Transaction Failed';
      }
    }
  }
}

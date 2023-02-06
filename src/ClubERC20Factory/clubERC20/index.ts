import ClubERC20 from 'src/contracts/ERC20Club.json';
import { getGnosisTxnInfo } from '../shared/gnosisTransactionInfo';
import { estimateGas } from '../shared/getGasEstimate';
import { ethers } from 'ethers';

export class ClubERC20Contract {
  web3;
  address;
  activeNetwork;

  // This will be used to call other functions.
  clubERC20Contract: any;

  // initialize an erc20 contract instance
  constructor(clubERC20ContractAddress: string, web3: any, activeNetwork: any) {
    this.web3 = web3;
    this.activeNetwork = activeNetwork;
    this.address = clubERC20ContractAddress;
    this.init();
  }

  async init(): Promise<void> {
    if (!ClubERC20) {
      return;
    }
    try {
      this.clubERC20Contract = new this.web3.eth.Contract(
        ClubERC20,
        this.address
      );
    } catch (error) {
      this.clubERC20Contract = null;
    }
  }

  async name(): Promise<string> {
    try {
      return this.clubERC20Contract.methods.name().call();
    } catch (error) {
      return '';
    }
  }

  async symbol(): Promise<string> {
    try {
      return this.clubERC20Contract.methods.symbol().call();
    } catch (error) {
      return '';
    }
  }

  async owner(): Promise<string> {
    try {
      return this.clubERC20Contract.methods.owner().call();
    } catch (error) {
      return '';
    }
  }

  async decimals(): Promise<string> {
    try {
      return this.clubERC20Contract.methods.decimals().call();
    } catch (error) {
      return '';
    }
  }

  async totalSupply(): Promise<string> {
    try {
      return this.clubERC20Contract.methods.totalSupply().call();
    } catch (error) {
      return '';
    }
  }

  // This can be used to close deposits
  async endMint(): Promise<string> {
    try {
      return this.clubERC20Contract.methods.endMint().call();
    } catch (error) {
      return '';
    }
  }

  async memberCount(): Promise<string | number> {
    try {
      return this.clubERC20Contract.methods.memberCount().call();
    } catch (error) {
      return 0;
    }
  }

  async allowance(owner: string, spender: string): Promise<string> {
    try {
      return this.clubERC20Contract.methods.allowance(owner, spender).call();
    } catch (error) {
      return '0';
    }
  }

  async setUnlimitedAllowance(
    owner: string,
    spender: string,
    onTxConfirm: (transactionHash?: any) => void,
    onTxReceipt: (receipt?: any) => void,
    onTxFail: (error?: any) => void,
    setTransactionHash: (txHas: any) => void
  ): Promise<void> {
    let gnosisTxHash;
    const gasEstimate = await estimateGas(this.web3);
    await new Promise((resolve, reject) => {
      this.clubERC20Contract.methods
        .increaseAllowance(spender, ethers.constants.MaxUint256.sub(1))
        .send({ from: owner, gasPrice: gasEstimate })
        .on('transactionHash', (transactionHash: any) => {
          onTxConfirm(transactionHash);

          // Stop waiting if we are connected to gnosis safe via walletConnect
          if (
            this.web3._provider.wc?._peerMeta.name === 'Gnosis Safe Multisig'
          ) {
            setTransactionHash('');
            gnosisTxHash = transactionHash;
            resolve(transactionHash);
          } else {
            console.log(transactionHash, 'txHash');
            setTransactionHash(transactionHash);
          }
        })
        .on('receipt', (receipt: any) => {
          console.log(receipt, 'receipt');
          onTxReceipt(receipt);
          resolve(receipt);
        })
        .on('error', (error: any) => {
          onTxFail(error);
          reject(error);
        });
    });

    // fallback for gnosisSafe <> walletConnect
    if (gnosisTxHash) {
      const receipt: any = await getGnosisTxnInfo(
        gnosisTxHash,
        this.activeNetwork
      );
      setTransactionHash(receipt.transactionHash);
      if (receipt.isSuccessful) {
        onTxReceipt(receipt);
      } else {
        onTxFail('Transaction failed');
      }
    }
  }

  async balanceOf(account: string): Promise<string> {
    if (!account) return '0';
    try {
      return this.clubERC20Contract.methods
        .balanceOf(account.toString())
        .call({ from: account });
    } catch (error) {
      return '0';
    }
  }

  async mintTo(
    recipientAddress: string,
    amount: string,
    ownerAddress: string,
    onTxConfirm: (transactionHash?: any) => void,
    onTxReceipt: (receipt?: any) => void,
    onTxFail: (error?: any) => void,
    setTransactionHash: (txHas: any) => void
  ): Promise<void> {
    let gnosisTxHash;
    const gasEstimate = await estimateGas(this.web3);

    await new Promise((resolve, reject) => {
      this.clubERC20Contract.methods
        .mintTo(recipientAddress, amount)
        .send({ from: ownerAddress, gasPrice: gasEstimate })
        .on('transactionHash', (transactionHash: any) => {
          onTxConfirm(transactionHash);

          // Stop waiting if we are connected to gnosis safe via walletConnect
          if (
            this.web3._provider.wc?._peerMeta.name === 'Gnosis Safe Multisig'
          ) {
            setTransactionHash('');
            gnosisTxHash = transactionHash;
            resolve(transactionHash);
          } else {
            setTransactionHash(transactionHash);
          }
        })
        .on('receipt', (receipt: any) => {
          onTxReceipt(receipt);
          resolve(receipt);
        })
        .on('error', (error: any) => {
          onTxFail(error);
          reject(error);
        });
    });

    // fallback for gnosisSafe <> walletConnect
    if (gnosisTxHash) {
      const receipt: any = await getGnosisTxnInfo(
        gnosisTxHash,
        this.activeNetwork
      );
      setTransactionHash(receipt.transactionHash);
      if (receipt.isSuccessful) {
        onTxReceipt(receipt);
      } else {
        onTxFail('Transaction failed');
      }
    }
  }

  async controllerRedeem(
    memberAddress: string,
    amount: string,
    ownerAddress: string,
    onTxConfirm: (transactionHash?: any) => void,
    onTxReceipt: (receipt?: any) => void,
    onTxFail: (error?: any) => void,
    setTransactionHash: (txHas: any) => void
  ): Promise<void> {
    let gnosisTxHash;
    const gasEstimate = await estimateGas(this.web3);

    await new Promise((resolve, reject) => {
      this.clubERC20Contract.methods
        .controllerRedeem(memberAddress, amount)
        .send({ from: ownerAddress, gasPrice: gasEstimate })
        .on('transactionHash', (transactionHash: any) => {
          onTxConfirm(transactionHash);

          // Stop waiting if we are connected to gnosis safe via walletConnect
          if (
            this.web3._provider.wc?._peerMeta.name === 'Gnosis Safe Multisig'
          ) {
            setTransactionHash('');
            gnosisTxHash = transactionHash;
            resolve(transactionHash);
          } else {
            setTransactionHash(transactionHash);
          }
        })
        .on('receipt', (receipt: any) => {
          onTxReceipt(receipt);
          resolve(receipt);
        })
        .on('error', (error: any) => {
          onTxFail(error);
          reject(error);
        });
    });

    // fallback for gnosisSafe <> walletConnect
    if (gnosisTxHash) {
      const receipt: any = await getGnosisTxnInfo(
        gnosisTxHash,
        this.activeNetwork
      );
      setTransactionHash(receipt.transactionHash);
      if (receipt.isSuccessful) {
        onTxReceipt(receipt);
      } else {
        onTxFail('Transaction failed');
      }
    }
  }
}

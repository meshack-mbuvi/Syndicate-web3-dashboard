import DepositExchangeMintModule_ABI from 'src/contracts/DepositExchangeTokenMintModule.json';
import { getGnosisTxnInfo } from '../shared/gnosisTransactionInfo';

export class DepositExchangeMintModule {
  contract;
  isGnosisSafe: boolean;
  activeNetwork;

  constructor(contractAddress: string, web3, activeNetwork) {
    this.activeNetwork = activeNetwork;
    this.contract = new web3.eth.Contract(
      DepositExchangeMintModule_ABI,
      contractAddress
    );

    this.isGnosisSafe =
      web3._provider.wc?._peerMeta.name === 'Gnosis Safe Multisig';
  }

  mint = async (
    address: string,
    depositAmount: string,
    account: string,
    onTxConfirm: (transactionHash?) => void,
    onTxReceipt: (receipt?) => void,
    onTxFail: (error?) => void,
    setTransactionHash: (transactionHash: string) => void
  ): Promise<string> => {
    return new Promise((resolve, reject) =>
      this.contract.methods
        .mint(address, depositAmount)
        .send({ from: account })
        .on('receipt', onTxReceipt)
        .on('error', onTxFail)
        .on('transactionHash', async (transactionHash: string) => {
          onTxConfirm(transactionHash);

          if (!this.isGnosisSafe) {
            setTransactionHash(transactionHash);
          } else {
            setTransactionHash('');

            // Stop waiting if we are connected to gnosis safe via walletConnect
            const receipt = await getGnosisTxnInfo(
              transactionHash,
              this.activeNetwork
            );

            if (!(receipt as { isSuccessful: boolean }).isSuccessful) {
              return reject('Receipt failed');
            }

            onTxReceipt(receipt);
          }
        })
    );
  };
}

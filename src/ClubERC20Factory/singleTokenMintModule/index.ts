import SingleTokenMintModule_ABI from "src/contracts/SingleTokenMintModule.json";
import { getGnosisTxnInfo } from "../shared/gnosisTransactionInfo";

export class SingleTokenMintModuleContract {
  web3;
  address;

  // This will be used to call other functions. eg mint
  SingleTokenMintModuleContract;

  // initialize a contract instance
  constructor(SingleTokenMintModuleContractAddress: string, web3) {
    this.web3 = web3;
    this.address = SingleTokenMintModuleContractAddress;
    this.init();
  }

  async init(): Promise<void> {
    if (!SingleTokenMintModule_ABI) {
      return;
    }
    try {
      this.SingleTokenMintModuleContract = new this.web3.eth.Contract(
        SingleTokenMintModule_ABI,
        this.address,
      );
    } catch (error) {
      this.SingleTokenMintModuleContract = null;
    }
  }

  async depositToken(clubAddress): Promise<string> {
    try {
      return this.SingleTokenMintModuleContract.methods
        .depositToken(clubAddress)
        .call();
    } catch (error) {
      return "";
    }
  }

  /**
   * When a member makes a deposit, we mint tokens equivalent to the deposit/
   * mint amount and then transfer the tokens to the caller address.
   *
   * Note: All validation should be handled before calling this method.
   *
   * @param amount
   * @param clubAddress
   * @param ownerAddress
   * @param onTxConfirm
   * @param onTxReceipt
   */
  async deposit(
    amount: string,
    clubAddress: string,
    ownerAddress: string,
    onTxConfirm: (transactionHash?) => void,
    onTxReceipt: (receipt?) => void,
    onTxFail: (error?) => void,
    setTransactionHash,
  ): Promise<void> {
    if (!this.SingleTokenMintModuleContract) {
      this.init();
    }

    let gnosisTxHash;

    await new Promise((resolve, reject) => {
      this.SingleTokenMintModuleContract.methods
        .mint(clubAddress, amount)
        .send({ from: ownerAddress })
        .on("transactionHash", (transactionHash) => {
          onTxConfirm(transactionHash);

          // Stop waiting if we are connected to gnosis safe via walletConnect
          if (
            this.web3._provider.wc?._peerMeta.name === "Gnosis Safe Multisig"
          ) {
            setTransactionHash("");
            gnosisTxHash = transactionHash;
            resolve(transactionHash);
          }

          setTransactionHash(transactionHash);
        })
        .on("receipt", (receipt) => {
          onTxReceipt(receipt);
          resolve(receipt);
        })
        .on("error", (error) => {
          onTxFail(error);
          reject(error);
        });
    });

    // fallback for gnosisSafe <> walletConnect
    if (gnosisTxHash) {
      const receipt: any = await getGnosisTxnInfo(gnosisTxHash);
      setTransactionHash(receipt.transactionHash);
    }
  }
}

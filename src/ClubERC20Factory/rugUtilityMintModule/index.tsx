import rugUtilityMintModule_ABI from "src/contracts/RugUtilityMintModule.json";
import { getGnosisTxnInfo } from "../shared/gnosisTransactionInfo";
export class RugUtilityMintModuleContract {
  isGnosisSafe: boolean;
  contract;

  // initialize a contract instance
  constructor(contractAddress: string, web3: any) {
    this.contract = new web3.eth.Contract(
      rugUtilityMintModule_ABI,
      contractAddress,
    );
    this.isGnosisSafe =
      web3._provider.wc?._peerMeta.name === "Gnosis Safe Multisig";
  }

  redeem = async (
    forAddress: string,
    tokenID: number,
    value: string,
    onTxConfirm: (transactionHash?) => void,
    onTxReceipt: (receipt?) => void,
    onTxFail: (error?) => void,
    setTransactionHash,
  ): Promise<string> =>
    new Promise((resolve, reject) =>
      this.contract.methods
        .redeem(tokenID)
        .send({ from: forAddress, value })
        .on("receipt", onTxReceipt)
        .on("error", onTxFail)
        .on("transactionHash", async (transactionHash: string) => {
          onTxConfirm(transactionHash);
          if (!this.isGnosisSafe) {
            setTransactionHash(transactionHash);
          } else {
            setTransactionHash("");
            // Stop waiting if we are connected to gnosis safe via walletConnect
            const receipt = await getGnosisTxnInfo(transactionHash);
            if (!(receipt as { isSuccessful: boolean }).isSuccessful) {
              return reject("Receipt failed");
            }

            onTxReceipt(receipt);
          }
        }),
    );

  redeemMany = async (
    forAddress: string,
    tokenIDs: [],
    value: string,
    onTxConfirm: (transactionHash?) => void,
    onTxReceipt: (receipt?) => void,
    onTxFail: (error?) => void,
    setTransactionHash,
  ): Promise<string> =>
    new Promise((resolve, reject) =>
      this.contract.methods
        .redeemMany(tokenIDs)
        .send({ from: forAddress, value })
        .on("receipt", onTxReceipt)
        .on("error", onTxFail)
        .on("transactionHash", async (transactionHash: string) => {
          onTxConfirm(transactionHash);
          if (!this.isGnosisSafe) {
            setTransactionHash(transactionHash);
          } else {
            setTransactionHash("");
            // Stop waiting if we are connected to gnosis safe via walletConnect
            const receipt = await getGnosisTxnInfo(transactionHash);
            if (!(receipt as { isSuccessful: boolean }).isSuccessful) {
              return reject("Receipt failed");
            }

            onTxReceipt(receipt);
          }
        }),
    );

  async ethPrice(): Promise<string> {
    try {
      return this.contract.methods.ethPrice().call();
    } catch (error) {
      return "";
    }
  }
  async redemptionToken(): Promise<string> {
    try {
      return this.contract.methods.redemptionToken().call();
    } catch (error) {
      return "";
    }
  }
  async membership(): Promise<string> {
    try {
      return this.contract.methods.membership().call();
    } catch (error) {
      return "";
    }
  }
  async tokenRedeemed(tokenID): Promise<boolean> {
    try {
      return this.contract.methods.tokenRedeemed(tokenID).call();
    } catch (error) {
      return false;
    }
  }

  getPastEvents = async (distEvent: string, filter = {}): Promise<[]> => {
    if (!distEvent.trim()) return;
    try {
      const events = await this.contract.getPastEvents(distEvent, {
        filter,
        fromBlock: "earliest",
        toBlock: "latest",
      });

      return events;
    } catch (error) {
      console.log({ error });
      return [];
    }
  };
}

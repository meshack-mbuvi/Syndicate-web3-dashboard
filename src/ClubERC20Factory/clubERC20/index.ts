import ClubERC20 from "src/contracts/ClubERC20.json";
import { getGnosisTxnInfo } from "../shared/gnosisTransactionInfo";

export class ClubERC20Contract {
  web3;
  address;

  // This will be used to call other functions.
  clubERC20Contract;

  // initialize an erc20 contract instance
  constructor(clubERC20ContractAddress: string, web3) {
    this.web3 = web3;
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
        this.address,
      );
    } catch (error) {
      this.clubERC20Contract = null;
    }
  }

  async name(): Promise<string> {
    try {
      return this.clubERC20Contract.methods.name().call();
    } catch (error) {
      return "";
    }
  }

  async symbol(): Promise<string> {
    try {
      return this.clubERC20Contract.methods.symbol().call();
    } catch (error) {
      return "";
    }
  }

  async owner(): Promise<string> {
    try {
      return this.clubERC20Contract.methods.owner().call();
    } catch (error) {
      return "";
    }
  }

  async decimals(): Promise<string> {
    try {
      return this.clubERC20Contract.methods.decimals().call();
    } catch (error) {
      return "";
    }
  }

  async totalSupply(): Promise<string> {
    try {
      return this.clubERC20Contract.methods.totalSupply().call();
    } catch (error) {
      return "";
    }
  }

  // This can be used to close deposits
  async endMint(): Promise<string> {
    try {
      return this.clubERC20Contract.methods.endMint().call();
    } catch (error) {
      return "";
    }
  }

  async memberCount(): Promise<string | number> {
    try {
      return this.clubERC20Contract.methods.memberCount().call();
    } catch (error) {
      return 0;
    }
  }

  async balanceOf(account: string): Promise<string | number> {
    if (!account) return "0";
    try {
      return this.clubERC20Contract.methods
        .balanceOf(account.toString())
        .call({ from: account });
    } catch (error) {
      return 0;
    }
  }

  async mintTo(
    recipientAddress: string,
    amount: string,
    ownerAddress: string,
    onTxConfirm: (transactionHash?) => void,
    onTxReceipt: (receipt?) => void,
    onTxFail: (error?) => void,
    setTransactionHash: (txHas) => void,
  ): Promise<void> {
    let gnosisTxHash;

    await new Promise((resolve, reject) => {
      this.clubERC20Contract.methods
        .mintTo(recipientAddress, amount)
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
          } else {
            setTransactionHash(transactionHash);
          }
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
      if (receipt.isSuccessful) {
        onTxReceipt(receipt);
      } else {
        onTxFail("Transaction failed");
      }
    }
  }
}

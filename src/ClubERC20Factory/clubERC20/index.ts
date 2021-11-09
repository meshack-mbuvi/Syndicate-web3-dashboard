import ClubERC20 from "src/contracts/ClubERC20.json";
import { getGnosisTxnInfo } from "../shared/gnosisTransactionInfo";

export class ClubERC20Contract {
  web3;
  address;

  // This will be used to call other functions. eg mint
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

  async depositToken(): Promise<string> {
    try {
      return this.clubERC20Contract.methods.depositToken().call();
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
    try {
      return this.clubERC20Contract.methods
        .balanceOf(account.toString())
        .call({ from: account });
    } catch (error) {
      return 0;
    }
  }

  /**
   * When a member makes a deposit, we mint tokens equivalent to the deposit/
   * mint amount and then transfer the tokens to the caller address.
   *
   * Note: All validation should be handled before calling this method.
   *
   * @param amount
   * @param ownerAddress
   * @param onTxConfirm
   * @param onTxReceipt
   */
  async deposit(
    amount: string,
    ownerAddress: string,
    onTxConfirm: (transactionHash?) => void,
    onTxReceipt: (receipt?) => void,
    onTxFail: (error?) => void,
    setTransactionHash,
  ): Promise<void> {
    if (!this.clubERC20Contract) {
      this.init();
    }

    let gnosisTxHash;

    await new Promise((resolve, reject) => {
      this.clubERC20Contract.methods
        .deposit(amount)
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
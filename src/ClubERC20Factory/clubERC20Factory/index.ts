import CLUB_ERC20_FACTORY_ABI from "src/contracts/ClubERC20Factory.json";
import { getGnosisTxnInfo } from "../shared/gnosisTransactionInfo";

export class ClubERC20Factory {
  web3;
  address;
  clubERC20Factory;

  // initialize new instance of lubERC20FactoryAddress
  constructor(clubERC20FactoryAddress: string, web3: any) {
    this.web3 = web3;
    this.address = clubERC20FactoryAddress;
    this.init();
  }

  init(): void {
    try {
      this.clubERC20Factory = new this.web3.eth.Contract(
        CLUB_ERC20_FACTORY_ABI,
        this.address,
      );
    } catch (error) {
      this.clubERC20Factory = null;
    }
  }

  /**
   * This method creates a new ERC20 token/syndicate.
   * The assumption made here is that all validation has been taken care of
   * prior to calling this function.
   *
   * @param ownerAddress
   * @param clubTokenName
   * @param tokenSymbol
   * @param usdcAddress
   * @param mintPrice
   * @param tokenCap
   * @param mintStart
   * @param mintEnd
   * @param mintEnabled
   * @param onTxConfirm
   * @param onTxReceipt
   */
  public async createERC20(
    ownerAddress: string,
    clubTokenName: string,
    tokenSymbol: string,
    usdcAddress: string,
    mintPrice = 1,
    tokenCap: string,
    mintStart: number,
    mintEnd: number,
    mintEnabled: boolean,
    onTxConfirm: (transactionHash?) => void,
    onTxReceipt: (receipt?) => void,
  ): Promise<void> {
    let gnosisTxHash;

    if (!this.clubERC20Factory) {
      await this.init();
    }

    await new Promise((resolve, reject) => {
      this.clubERC20Factory.methods
        .createERC20(
          ownerAddress, // owner
          clubTokenName, // name of club token
          tokenSymbol, // symbol
          usdcAddress, // USDC
          mintPrice, // mint price
          "0x81B384B2883a2ee25F8AE02eED5b3e879b20a0b4", // recepient
          tokenCap, //BigInt(5000 * 10 ** 18), // token CAP
          mintStart, //1635156220, // mint start
          mintEnd, //1637834620, // mint end - close date
          mintEnabled, // mint enabled
        )
        .send({ from: ownerAddress })
        .on("transactionHash", (transactionHash) => {
          onTxConfirm(transactionHash);
          if (
            this.web3._provider.wc?._peerMeta.name === "Gnosis Safe Multisig"
          ) {
            gnosisTxHash = transactionHash;
            resolve(transactionHash);
          }
        })
        .on("receipt", (receipt) => {
          onTxReceipt(receipt);
          resolve(receipt);
        })
        .on("error", (error) => {
          reject(error);
        });
    });

    // fallback for gnosisSafe <> walletConnect
    if (gnosisTxHash) {
      await getGnosisTxnInfo(gnosisTxHash);
    }
  }
}

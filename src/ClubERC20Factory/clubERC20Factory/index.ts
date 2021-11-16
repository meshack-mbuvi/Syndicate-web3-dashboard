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
    onTxReceipt: (receipt?) => void,
  ): Promise<void> {
    let gnosisTxHash;

    if (!this.clubERC20Factory) {
      await this.init();
    }

    await new Promise((resolve, reject) => {
      this.clubERC20Factory.methods
        .createWithMintParams(
          clubTokenName, // name of club token
          tokenSymbol, // symbol
          startTime, // 1635156220, // mint start
          endTime, // 1637834620, // mint end - close date
          maxMembers,
          tokenCap, // BigInt(5000 * 10 ** 18), // token CAP
          "0x0000000000000000000000000000000000000000",
          0,
          usdcAddress, // USDC
        )
        .send({ from: account })
        .on("transactionHash", (transactionHash) => {
          if (
            this.web3._provider.wc?._peerMeta.name === "Gnosis Safe Multisig"
          ) {
            gnosisTxHash = transactionHash;
            resolve(transactionHash);
            onTxConfirm("");
          } else {
            onTxConfirm(transactionHash);
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
      const receipt: any = await getGnosisTxnInfo(gnosisTxHash);
      onTxConfirm(receipt.transactionHash);

      const createEvents = await this.clubERC20Factory.getPastEvents(
        "ClubERC20Created",
        {
          filter: { transactionHash: receipt.transactionHash },
          fromBlock: receipt.blockNumber,
          toBlock: receipt.blockNumber,
        },
      );

      if (receipt.isSuccessful) {
        onTxReceipt({
          ...receipt,
          events: { ClubERC20Created: createEvents[0] },
        });
      } else {
        throw "Transaction Failed";
      }
    }
  }
}

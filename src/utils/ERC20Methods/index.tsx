const Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

const ERC20ABI = require("src/utils/abi/erc20");

type String = string | string[];

// Class used to get immutable details about a given ERC20 token.
export class ERC20TokenDetails {
  tokenContractABI: {} = ERC20ABI;
  tokenContractAddress: String = "";
  tokenContract: any = {};

  constructor(tokenContractAddress: String) {
    this.tokenContractAddress = tokenContractAddress;
    this.tokenContract = new web3.eth.Contract(
      this.tokenContractABI,
      this.tokenContractAddress
    );
  }

  // get the number of decimal places for the current token
  getTokenDecimals = () => {
    if (this.tokenContract) {
      const result = this.tokenContract.methods
        .decimals()
        .call()
        .then((result) => result)
        .catch(() => 18);
      return result;
    }
  };

  // get the symbol for the current token e.g. DAI, USDC, etc.
  getTokenSymbol = async () => {
    const result = await this.tokenContract?.methods.symbol().call();
    return web3.utils.hexToAscii(result);
  };
}

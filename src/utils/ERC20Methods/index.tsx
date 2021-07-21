const Web3 = require("web3");
const web3 = new Web3(
  Web3.givenProvider || `${process.env.NEXT_PUBLIC_INFURA_ENDPOINT}`,
);
const abi = require("human-standard-token-abi");

type StringOrStringArr = string | string[];

// Class used to get immutable details about a given ERC20 token.
export class ERC20TokenDetails {
  tokenContractAddress: StringOrStringArr = "";
  tokenContract: any = {};

  constructor(tokenContractAddress: StringOrStringArr) {
    this.tokenContractAddress = tokenContractAddress;
    this.tokenContract = new web3.eth.Contract(abi, this.tokenContractAddress);
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
    return result;
  };
}

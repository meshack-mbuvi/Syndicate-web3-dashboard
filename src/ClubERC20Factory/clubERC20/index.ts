import ClubERC20 from "src/contracts/ClubERC20.json";

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
    try {
      return this.clubERC20Contract.methods
        .balanceOf(account.toString())
        .call({ from: account });
    } catch (error) {
      return 0;
    }
  }

}

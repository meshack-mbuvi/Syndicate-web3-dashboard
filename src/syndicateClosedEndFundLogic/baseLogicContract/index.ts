import SyndicateCoordinatorInstanceABI from "src/contracts/SyndicateIntegrationsCoordinatorLogicV0.json";

const SyndicateCoordinatorInstanceAddress =
  process.env
    .NEXT_PUBLIC_SYNDICATE_INTEGRATION_COORDINATOR_CONTRACT_LOGIC_ADDRESS;

/**
 * BaseLogicContract class handles initilization of other logic contracts.
 * The new architecture has contract called IntergrationCoordinatorContract
 * which handles addition and removal of syndicate logic contracts.
 * To get an instance of any deployed logic contract, this coordinator contract
 * should be called with the name of the contract to be instantiated.
 * More information on how this is handled can be found in the
 * initializeLogicContract method.
 */
export class BaseLogicContract {
  logicContractInstance: any;
  _address: string;
  contractName: string;
  web3: any;
  contractABI: object;

  /**
   *
   * @param contractName
   * @param web3
   * @param contractABI
   */
  constructor(
    contractName: string,
    contractAddress: string,
    web3,
    contractABI,
  ) {
    this.web3 = web3;
    this.contractABI = contractABI;
    this.contractName = contractName;
    this._address = contractAddress;
    this.initializeLogicContract();
  }

  /**
   * This method gets a contractAddress for the deployed contract name,
   * and then initializes a new logic contract.
   */
  async initializeLogicContract() {
    try {
      const contractAddress = this._address;

      // ----------------
      // The intergrations coordinator is currently not deployed / not in use,
      // this will be used when it's added back
      // ----------------

      // if (!this._address) {
      //   contractAddress = await this.getContractAddress(this.contractName);
      // }

      this.logicContractInstance = new this.web3.eth.Contract(
        this.contractABI,
        contractAddress,
      );
    } catch {
      this.logicContractInstance = null;
    }
  }

  /**
   * Retrieve contractAddress for the provided logicContractName
   *
   * Process of getting contract address involves retrieving the hash for the
   * logic contract and then using the returned hash, we can get a specific
   * logic contract address from syndicate coordinator contract.
   *
   * @param {string} logicContractName
   * @returns {string} contractAddress
   */
  getContractAddress = async (logicContractName: string): Promise<string> => {
    const syndicateCoordinatorInstance = new this.web3.eth.Contract(
      SyndicateCoordinatorInstanceABI.abi,
      SyndicateCoordinatorInstanceAddress,
    );
    const getterContractHash = await syndicateCoordinatorInstance.methods
      .hash(logicContractName)
      .call();
    const contractAddress = await syndicateCoordinatorInstance.methods
      .getAddress(getterContractHash)
      .call();

    this._address = contractAddress;

    return contractAddress;
  };
}

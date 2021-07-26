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
    web3,
    contractABI,
  ) {
    this.web3 = web3;
    this.contractABI = contractABI;
    this.contractName = contractName;
    this.initializeLogicContract();
  }

  /**
   * This method gets a contractAddress for the deployed contract name,
   * and then initializes a new logic contract.
   */
  async initializeLogicContract() {
    try {

      let contractAddress = this._address;

      if (!this._address) {
        contractAddress = await this.getContractAddress(this.contractName);
      }

      this.logicContractInstance = new this.web3.eth.Contract(
        this.contractABI,
        contractAddress,
      );
    } catch (error) {
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
    const [contractAddress] = await syndicateCoordinatorInstance.methods
      .getAddresses([logicContractName])
      .call();

    this._address = contractAddress;

    return contractAddress;
  };
}

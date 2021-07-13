import { SyndicateDepositLogic } from "./depositsLogic";
import { SyndicateDistributionLogic } from "./distributionLogic";
import { SyndicateGetterLogic } from "./getterLogic";
import { SyndicateManagerLogic } from "./managerLogic";
import { SyndicateAllowlistLogic } from "./allowlistLogic";

const Web3 = require("web3");

// ----------
// Contract names are currently not in use but will be added back in future.
// ----------

// contract names
const getterLogicContractName =
  process.env.NEXT_PUBLIC_GETTER_LOGIC_CONTRACT_NAME;
const managerLogicContractName =
  process.env.NEXT_PUBLIC_MANAGER_LOGIC_CONTRACT_NAME;

const distributionLogicContractName =
  process.env.NEXT_PUBLIC_DISTRIBUTION_LOGIC_CONTRACT_NAME;

const depositLogicContractName =
  process.env.NEXT_PUBLIC_DEPOSIT_LOGIC_CONTRACT_NAME;

const allowlistLogicContractName =
  process.env.NEXT_PUBLIC_ALLOWLIST_LOGIC_CONTRACT_NAME;

// -----------
// Contract addresses replace the contract names for now.
// -----------

// contract Addresses
const getterLogicContractAddress =
  process.env.NEXT_PUBLIC_GETTER_LOGIC_CONTRACT_ADDRESS;
const managerLogicContractAddress =
  process.env.NEXT_PUBLIC_MANAGER_LOGIC_CONTRACT_ADDRESS;

const distributionLogicContractAddress =
  process.env.NEXT_PUBLIC_DISTRIBUTION_LOGIC_CONTRACT_ADDRESS;

const depositLogicContractAddress =
  process.env.NEXT_PUBLIC_DEPOSIT_LOGIC_CONTRACT_ADDRESS;

const allowlistLogicContractAddress =
  process.env.NEXT_PUBLIC_ALLOWLIST_LOGIC_CONTRACT_ADDRESS;

// Initialize Web3
const web3 = new Web3(
  Web3.givenProvider || `${process.env.NEXT_PUBLIC_INFURA_ENDPOINT}`,
);

export const getSyndicateContracts = async () => {
  // Retrieve contract from cache.
  // if not contracts from cache or cache expired then continue
  // with initialization.
  // initialize contracts here
  const ManagerLogicContract = new SyndicateManagerLogic(
    managerLogicContractName,
    managerLogicContractAddress,
    web3,
  );

  const GetterLogicContract = new SyndicateGetterLogic(
    getterLogicContractName,
    getterLogicContractAddress,
    web3,
  );

  const DistributionLogicContract = new SyndicateDistributionLogic(
    distributionLogicContractName,
    distributionLogicContractAddress,
    web3,
  );

  const DepositLogicContract = new SyndicateDepositLogic(
    depositLogicContractName,
    depositLogicContractAddress,
    web3,
  );

  const AllowlistLogicContract = new SyndicateAllowlistLogic(
    allowlistLogicContractName,
    allowlistLogicContractAddress,
    web3,
  );

  // return all initialized contracts
  return {
    // add more contracts here
    ManagerLogicContract,
    GetterLogicContract,
    DistributionLogicContract,
    DepositLogicContract,
    AllowlistLogicContract,
  };
};

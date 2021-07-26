import { SyndicateDepositLogic } from "./depositsLogic";
import { SyndicateDistributionLogic } from "./distributionLogic";
import { SyndicateGetterLogic } from "./getterLogic";
import { SyndicateManagerLogic } from "./managerLogic";
import { SyndicateAllowlistLogic } from "./allowlistLogic";

const Web3 = require("web3");

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
    web3,
  );

  const GetterLogicContract = new SyndicateGetterLogic(
    getterLogicContractName,
    web3,
  );

  const DistributionLogicContract = new SyndicateDistributionLogic(
    distributionLogicContractName,
    web3,
  );

  const DepositLogicContract = new SyndicateDepositLogic(
    depositLogicContractName,
    web3,
  );

  const AllowlistLogicContract = new SyndicateAllowlistLogic(
    allowlistLogicContractName,
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

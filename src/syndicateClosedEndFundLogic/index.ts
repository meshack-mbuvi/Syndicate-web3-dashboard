import { SyndicateAllowlistLogic } from "./allowlistLogic";
import { SyndicateDepositLogic } from "./depositsLogic";
import { SyndicateDepositTransferLogic } from "./depositTransferLogic";
import { SyndicateDistributionLogic } from "./distributionLogic";
import { SyndicateGetterLogic } from "./getterLogic";
import { SyndicateManagerLogic } from "./managerLogic";

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

const depositTransferLogicContractName =
  process.env.NEXT_PUBLIC_DEPOSIT_TRANSFER_LOGIC_CONTRACT_NAME;

export const getSyndicateContracts = async (web3: any) => {
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

  const DepositTransferLogicContract = new SyndicateDepositTransferLogic(
    depositTransferLogicContractName,
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
    DepositTransferLogicContract,
  };
};

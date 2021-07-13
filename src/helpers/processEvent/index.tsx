import { formatDate } from "@/utils";

/**
 * This function retrieves data from createdSyndicate event which is emitted when
 * a new syndicate is created.
 * @param param0
 * @returns
 */
export const processCreatedSyndicateEvent = ({ returnValues }) => {
  let {
    syndicateAddress,
    depositERC20ContractAddress,
    minDepositLP,
    maxDepositLP,
    maxDepositTotal,
    maxLPs,
    closeDate,
    syndicateDistributionShareBasisPoints,
    managerManagementFeeBasisPoints,
    managerDistributionShareBasisPoints,
    allowlistEnabled,
    modifiable,
    creationDate,
  } = returnValues;

  // The value stored in syndicate during creation is in seconds, hence the need
  // to multiply by 1000 to convert to milliseconds and then initialize a
  // date object
  closeDate = formatDate(new Date(parseInt(closeDate) * 1000));
  creationDate = formatDate(new Date(parseInt(creationDate) * 1000));

  return {
    syndicateAddress,
    depositERC20ContractAddress,
    minDepositLP,
    maxDepositLP,
    maxDepositTotal,
    maxLPs,
    closeDate,
    syndicateDistributionShareBasisPoints,
    managerManagementFeeBasisPoints,
    managerDistributionShareBasisPoints,
    allowlistEnabled,
    modifiable,
    activities: 0,
    createdDate: creationDate,
    currentManager: syndicateAddress,
  };
};

export const handleSubmitReturnDeposits = async (
  syndicateContracts,
  syndicateAddress: string,
  memberAddresses: string[],
  account: string,
  handleShowWalletConfirmationModal: (status: boolean) => void,
  handleSubmitting: (status: boolean) => void,
  handleReceipt: () => void,
): Promise<void> => {
  await syndicateContracts.DepositLogicContract.managerRejectDepositForMembers(
    syndicateAddress,
    memberAddresses,
    account,
    handleShowWalletConfirmationModal,
    handleSubmitting,
    handleReceipt,
  );
};

export const handleSubmitBlockMemberAddress = async (
  syndicateContracts,
  syndicateAddress: string,
  memberAddresses: string[],
  account: string,
  handleShowWalletConfirmationModal: (status: boolean) => void,
  handleSubmitting: (status: boolean) => void,
  handleReceipt: () => void,
): Promise<void> => {
  await syndicateContracts.AllowlistLogicContract.managerBlockAddresses(
    syndicateAddress,
    memberAddresses,
    account,
    handleShowWalletConfirmationModal,
    handleSubmitting,
    handleReceipt,
  );
};

export const handleSubmitModifyingMemberDeposits = async (
  syndicateContracts,
  syndicateAddress: string,
  memberAddresses: string[],
  memberAmounts: string[],
  account: string,
  handleShowWalletConfirmationModal: (status: boolean) => void,
  handleSubmitting: (status: boolean) => void,
  handleReceipt: () => void,
): Promise<void> => {
  await syndicateContracts.DepositLogicContract.managerSetDepositForMembers(
    syndicateAddress,
    memberAddresses,
    memberAmounts,
    account,
    handleShowWalletConfirmationModal,
    handleSubmitting,
    handleReceipt,
  );
};

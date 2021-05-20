// we can add constants to this file to make our
// components look cleaner.

// constants for the invest/deposit page.
const depositTitleText = "Deposit Into Syndicate";
const depositMoreTitleText = "Deposit More Into Syndicate";
const depositStatusApprovedText = "Allowlist disabled: You’re pre-approved.";
const depositStatusNotApprovedText =
  "Allowlist enabled: You will need to be approved.";
const depositStatusAllowApprovedText = "Allowlist enabled: You're approved.";
const depositDisclaimerText =
  "All deposits are final and can only be changed by Syndicate leads.";
const depositLPAccreditedText =
  "By depositing tokens, you attest you are accredited to join this syndicate. After depositing, contact the syndicate leads to confirm receipt and withdraw timing.";
const withdrawalTitleText = "Withdraw My Distributions.";
const withdrawalDisclaimerText = "Remember, all withdraws are final.";
const noSyndicateText =
  "No syndicate with given address. Please check the address provided.";
const depositsAndWithdrawalsUnavailableText =
  "Deposits and withdraws are not currently available";
const depositsUnavailableTitleText = "Deposits";
const depositsUnavailableText = "Syndicate closed. Deposits unavailable.";
const depositsUnavailableMaxLPsZeroText =
  "Deposits are unavailable at the moment. Please contact the syndicate leads.";
const depositsAndWithdrawalsUnavailableTitleText = "Deposits & Withdraws";
const loaderWithdrawalHeaderText =
  "Please wait while the withdrawal transaction completes...";
const loaderDepositHeaderText =
  "Please wait while the deposit transaction completes...";
const loaderApprovalHeaderText =
  "Please wait while the approval transaction completes...";
const loaderGeneralHeaderText =
  "Please wait while the transaction completes...";
export const loaderSubtext =
  "This could take anywhere from seconds to hours depending on the gas fees you set for the transaction.";
const increaseDepositAllowanceErrorMessage =
  "By increasing the deposit amount, you must approve the additional amount before depositing";
const depositBannerText =
  "By invitation only. Do not publicly market this deposit page. Only share directly with people and organizations who have been qualified.";
const amountConversionErrorText = "Error converting amount. Please try again.";
const actionFailedError =
  "An error occurred while completing the transaction. Please try again.";
const connectWalletMessageTitle = "Wallet Not Connected";
const connectWalletMessage = "Connect your wallet to view syndicate actions.";
const connectWalletDepositMessage =
  "Connect your wallet to deposit into this syndicate.";
const connectWalletWithdrawMessage =
  "Connect your wallet to withdraw from this syndicate.";

// deposit success texts
const depositSuccessTitleText = "You just made a deposit.";
const depositSuccessSubtext = "Deposit transaction was successful.";
const depositSuccessButtonText = "Deposit more";

// approval success texts
const approvalSuccessTitleText = "Allowance approved.";
const approvalSuccessSubtext = "Allowance approval transaction successful.";
const approvalSuccessButtonText = "Make a deposit";

// retry or dismiss text
const retryButtonText = "Retry";
const dismissButtonText = "Dismiss";

// syndicate details section
const syndicateDetailsFooterText =
  "Syndicate v1 was security audited by Quanstamp March 2021.";
const syndicateDetailsLinkText = "View the audit report here.";

export const syndicateDetailsConstants = {
  syndicateDetailsFooterText,
  syndicateDetailsLinkText,
};

// texts on the home page
const primaryHeaderText = "Join the Revolution.";
const secondaryHeaderText = "Crypto investing protocol and social network";
const homeFooterText =
  "Syndicate received a spot check from Consensys Diligence but has not been fully audited. Please use at your own risk while our full audit proceeds in May.";
const homeButtonText = "Use Syndicate";

// texts on the manager view screen
// Pre-approval of depositor addresses
const approveAddressesWarning =
  "WARNING: The more addresses added, the higher the gas cost, as this function uses an array and loop to add addresses to the smart contract. We recommend minimizing the number of addresses being added if possible.";
const approveAddressesHeadingText =
  "Pre-approve addresses that can deposit to this syndicate. These addresses will be added to this syndicate’s pre-approved list.";
const textAreaTitle = "Pre-Approve Depositor List";
const approvedAddressesLabel = "Approve Address";
const separateWithCommas = "(separate with commas)";
const buttonText = "Confirm";

// metamask error texts
const metamaskRejectByUserMessage = "request was rejected.";
const metamaskInvalidParamsMessage = "Invalid parameters provided.";
const metamaskInternalErrorMessage = "Internal server error.";
const metamaskUnknownErrorMessage = "An unknown error occured on our end.";
const metamaskErrorMessageTitleText = "Transaction rejected.";
const metamaskTryAgainText = "Please try again.";
const metamaskInvalidAddressMessage = "Invalid address provided.";

export const metamaskConstants = {
  metamaskRejectByUserMessage,
  metamaskInvalidParamsMessage,
  metamaskInternalErrorMessage,
  metamaskUnknownErrorMessage,
  metamaskTryAgainText,
  metamaskErrorMessageTitleText,
  metamaskInvalidAddressMessage,
};

const walletPendingConfirmPendingTitleText = "Confirmation pending.";
const walletPendingConfirmPendingMessage =
  "Please confirm the transaction from your wallet.";

export const depositorAddressToolTip =
  "Address the depositor used to send funds to the manager.";

export const walletConfirmConstants = {
  walletPendingConfirmPendingTitleText,
  walletPendingConfirmPendingMessage,
};

// amount error messages on the deposit page
const amountLessThanMinDepositErrorMessage =
  "Amount cannot be less than the minimum deposit of";
const amountMoreThanMaxDepositErrorMessage =
  "Amount cannot be more than the maximum allowed deposit of";
const maxTotalDepositsExceededErrorMessage =
  "You cannot deposit this amount. The maximum syndicate deposit of";
const maxTotalLPDepositsExceededErrorMessage =
  "You cannot deposit this amount. Your maximum allowed deposit of";
const amountExceededText = "will be exceeded";

// invest/deposit page
export const constants = {
  depositTitleText,
  depositMoreTitleText,
  depositStatusApprovedText,
  depositStatusNotApprovedText,
  depositDisclaimerText,
  depositLPAccreditedText,
  withdrawalTitleText,
  withdrawalDisclaimerText,
  noSyndicateText,
  depositsAndWithdrawalsUnavailableText,
  depositsAndWithdrawalsUnavailableTitleText,
  loaderWithdrawalHeaderText,
  loaderDepositHeaderText,
  loaderApprovalHeaderText,
  increaseDepositAllowanceErrorMessage,
  loaderGeneralHeaderText,
  loaderSubtext,
  depositBannerText,
  amountConversionErrorText,
  actionFailedError,
  depositStatusAllowApprovedText,
  depositsUnavailableText,
  depositsUnavailableTitleText,
  connectWalletMessageTitle,
  connectWalletMessage,
  connectWalletWithdrawMessage,
  connectWalletDepositMessage,
  depositsUnavailableMaxLPsZeroText,
  depositSuccessTitleText,
  depositSuccessSubtext,
  depositSuccessButtonText,
  approvalSuccessTitleText,
  approvalSuccessSubtext,
  approvalSuccessButtonText,
  retryButtonText,
  dismissButtonText,
  amountLessThanMinDepositErrorMessage,
  amountMoreThanMaxDepositErrorMessage,
  maxTotalDepositsExceededErrorMessage,
  maxTotalLPDepositsExceededErrorMessage,
  amountExceededText,
};

// Tooltips
export const closeDateToolTip =
  "This is the date on which the syndicate will automatically close.";
export const syndicateAddressToolTip =
  "This is the address of the connected wallet account. It will be the manager of the newly created syndicate";
export const depositTokenToolTip =
  "This is the address of the ERC20 to be used for deposits and withdrawals. (eg. DAI or USDC). Stablecoins are strongly recommended, especially for funds that are open for an extended period of time. (Otherwise one contributor might contribute one unit when a token is $100, and another contributor might contribute one unit when a token is $200, and they would have the same percentage ownership because they have both contributed one unit of a token. Stablecoins prevent this because the value is consistent.) ";

export const minimumDepositToolTip =
  "This is the minimum amount a user can deposit into the syndicate.";

export const maximumDepositToolTip =
  "The maximum amount a user can deposit into the syndicate.";
export const totalMaximumDepositToolTip =
  "Total funds to be raised for this syndicate.";
export const maxLpsToolTip =
  "Maximum number of users(LP) who can deposit into this syndicate.";

export const expectedAnnualOperatingFeesToolTip =
  "This is a flat fee that will be paid to the manager annually. A standard structure would be a 2% management fee.";

export const profitShareToSyndicateLeadToolTip =
  "This is the manager's share of the profits from the syndicate investment. A standard structure would be 20%.";

export const profitShareToSyndicateProtocolToolTip =
  "This is the profit share in % that will be sent to Syndicate Treasury. A minimum profit share of 0.5% is required.";

export const allowListEnabledToolTip =
  "This should be checked if the Syndicate ONLY allows deposits from allowed addresses, or unchecked if any(accredited) LP can deposit";

export const modifiableToolTip =
  "This should be checked if a manager can modify a Syndicate's deposit and distribution amounts or unchecked if deposit and distribution cannot be modified by the manager. This choice is permanent-- once set here during creation, it cannot be changed.";
export const myDepositsToolTip =
  "Total deposits this wallet account has already made to the syndicate";

export const myPercentageOfThisSyndicateToolTip =
  "Percentage ownership the connected wallet has in this syndicate";

export const myDistributionsToDateToolTip =
  "All accumulated distributions this wallet address has been awarded to date.";

export const myWithDrawalsToDateTooltip =
  "All accumulated amounts the connected wallet account has withdrawn from this syndicate.";

export const withdrawalsToDepositPercentageToolTip =
  "Ratio of total withdrawals to deposits the connected wallet has made to the syndicate";

export const createdDateToolTip =
  "This is the date this syndicate was created/launched.";
export const totalDepositsToolTip = "Total deposits made to this syndicate";
export const totalDistributionsToolTip =
  "Total distributions set on this syndicate.";
export const totalClaimedDistributions =
  "Total distributions withdrawn from this syndicate.";
export const distributionTokenToolTip =
  "This is the address which can fund depositors accounts. Withdrawals will be made from this address so ensure this account has enough funds to cater for the distributions set.";

export const distributionAmountToolTip =
  "This is the amount of token to be distributed back to depositors.";

export const SyndicateInBetaBannerText =
  "Syndicate is currently in private beta. We take security seriously, but bugs may still exist.";

export const AgreeToOurTermsOfServiceText =
  "Please agree to our terms of service to continue.";

// syndicate actions page
const noSyndicateTitleText = "No Syndicate DAO found at that address.";
const noSyndicateMessageText =
  "Check for more details on Etherscan to see if your transaction is pending or failed.";
const syndicateAddressInvalidTitleText = "Invalid syndicate address";
const syndicateAddressInvalidMessageText =
  "Check to ensure you have the correct address.";
const backLinkText = "< Back To My Syndicates";

export const MAX_INTEGER = BigInt(2 ** 256) - BigInt(1);

const nonModifiableSyndicateErrorText =
  "This syndicate is not modifable. This means you cannot modify the syndicate details.";
const enableDistributionToModifySyndicateText =
  "Distributions must be set before modifying syndicate details.";

export const syndicateActionConstants = {
  noSyndicateTitleText,
  noSyndicateMessageText,
  syndicateAddressInvalidMessageText,
  syndicateAddressInvalidTitleText,
  backLinkText,
  nonModifiableSyndicateErrorText,
  enableDistributionToModifySyndicateText,
};

export const SyndicateCannotBeReopenedOnceClosedText =
  "Once a syndicate is closed, it cannot be re-opened.";

// home page
export const homePageConstants = {
  primaryHeaderText,
  secondaryHeaderText,
  homeFooterText,
  homeButtonText,
};

// manager view

//approval of addresses
export const managerApproveAddressesConstants = {
  approveAddressesWarning,
  approveAddressesHeadingText,
  textAreaTitle,
  approvedAddressesLabel,
  separateWithCommas,
  buttonText,
};

// contract transaction state constants
export const pendingState =
  "Creating your syndicate, please wait for the transaction to complete";

export const confirmWalletText = "Waiting for confirmation";
export const confirmCreateSyndicateSubText =
  " Please confirm this transaction on your wallet.";
export const confirmCloseSyndicateText =
  "Confirm the transaction in your wallet to close your syndicate to deposits.";
export const irreversibleActionText = "This action is irreversible.";
export const rejectTransactionText =
  "If this was a mistake, reject the transaction.";
export const confirmingTransaction = "Confirming Transaction";
export const waitTransactionTobeConfirmedText =
  "Please wait while the wallet transaction is confirmed.";

export const web3InstantiationErrorText =
  "Sorry! We are unable to connect to network where the contract is deployed. Please ensure you have access to stable network and retry the connection.";

export const confirmModifySyndicateCapTableText =
  "Confirm you want to alter deposits for the member address.";
export const confirmPreApproveAddressesText =
  "Confirm the transaction on your wallet if you want to approve new depositors.";
export const preApproveMoreAddress =
  "You can pre-approve more member addresses at any time whilst the syndicate is open.";

// we can add constants to this file to make our
// components look cleaner.

// constants for the invest/deposit page.
const depositTitleText = "Deposit Into Syndicate";
const depositMoreTitleText = "Deposit More Into Syndicate";
const allowListDisabledApprovedText =
  "Allowlist disabled: You’re pre-approved.";
const allowListDisabledNotApprovedText =
  "Allowlist disabled: You will need to be approved.";
const allowListEnabledNotApprovedText = "You must be pre-approved to deposit.";
const allowListEnabledApprovedText = "Allowlist enabled: You're approved.";
const depositDisclaimerText =
  "All deposits are final and can only be changed by Syndicate leads.";
const depositMemberAccreditedText =
  "By depositing tokens, you attest you are accredited to join this syndicate. After depositing, contact the syndicate leads to confirm receipt and withdraw timing.";
const withdrawalTitleText = "Withdraw My Distributions.";
const withdrawalDepositTitleText = "Withdraw My Deposit";
const withdrawalDisclaimerText = "Remember, all withdraws are final.";
const noSyndicateText =
  "No syndicate with given address. Please check the address provided.";
const depositsAndWithdrawalsUnavailableTitleText = "Deposits & Withdraws";
const depositsAndWithdrawalsUnavailableText =
  "Deposits and withdraws are not currently available";
const depositsUnavailableTitleText = "Deposits";
const depositsUnavailableText = "Syndicate closed. Deposits unavailable.";
const depositsUnavailableMaxMembersZeroText =
  "Deposits are unavailable at the moment. Please contact the syndicate leads.";
const withdrawalsUnavailableTitleText = "Withdrawal Failed";
const withdrawalAllowanceInsufficientText =
  "This syndicate has an insufficient allowance set to withdraw this amount. We have notified the syndicate manager. Please try again later.";
const withdrawalAmountLessThanMinDepositErrorText =
  "You can either withdraw your entire deposits or an amount less than your deposits but such that your remaining deposits will be more than the set minimum";

const loaderWithdrawalHeaderText =
  "Please wait while the withdrawal transaction completes...";
const loaderDepositHeaderText =
  "Please wait while the deposit transaction completes...";
const loaderApprovalHeaderText =
  "Please wait while the approval transaction completes...";
const loaderDistributionHeaderText =
  "Please wait while the distribution transaction completes...";
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
const maxMemberDepositsTitleText = "Maximum Deposit Reached.";
const maxMemberDepositsText =
  "You have reached your maximum allowed deposit for this syndicate.";
const nonMemberWithdrawalTitleText = "Not a Member.";
const nonMemberWithdrawalText =
  "The connected account does not own any stakes in this syndicate. Please switch to a different account.";
const amountGreaterThanMemberDistributionsText =
  "Withdrawal amount cannot be greater than available distributions.";
const withdrawalAmountGreaterThanMemberDeposits =
  "Withdrawal amount cannot be greater than member deposit";
const readOnlySyndicateText =
  "In order to have full capabilities, please install Metamask or use an Ethereum supported browser";
const readOnlySyndicateTitle = "This page is Read Only.";

// deposit success texts
const depositSuccessTitleText = "You just made a deposit.";
const depositSuccessSubtext = "Deposit transaction was successful.";
const depositSuccessButtonText = "Deposit more";
const depositSuccessBackButtonText = "Back";

// withdraw success texts
const withdrawalSuccessTitleText = "You just made a withdrawal.";
const withdrawalSuccessSubtext = "Withdrawal transaction was successful.";
const withdrawalSuccessButtonText = "Withdraw more";
const withdrawalSuccessBackButtonText = "Back";

// approval success texts
const approvalSuccessTitleText = "Allowance approved.";
const approvalSuccessSubtext = "Allowance approval transaction successful.";
const approvalSuccessButtonText = "Make a deposit";

// retry or dismiss text
const retryButtonText = "Retry";
const dismissButtonText = "Dismiss";

// syndicate details section
const syndicateDetailsFooterText =
  "Syndicate is currently in private beta and is open only to accredited investors. No materials on the Syndicate site should be construed as a solicitation or advice to buy any security.";
const syndicateDetailsSecurityFooterText =
  "We take security seriously. Syndicate has received multiple security audits and is formally verified but bugs may still exist.";
const syndicateDetailsLinkText = "View the audit report here.";
const syndicateModifiableText = "This syndicate is modifiable";

export const syndicateDetailsConstants = {
  syndicateDetailsFooterText,
  syndicateDetailsSecurityFooterText,
  syndicateDetailsLinkText,
  syndicateModifiableText,
};

// texts on the home page
const primaryHeaderText = "Join the Revolution.";
const secondaryHeaderText = "Crypto investing protocol and social network";
const homeFooterText =
  "Syndicate has received multiple security audits and is formally verified.";
const homeButtonText = "Use Syndicate";

// texts on the manager view screen
// Pre-approval of depositor addresses
const approveAddressesWarning =
  "WARNING: The more addresses added, the higher the gas cost, as this function uses an array and loop to add addresses to the smart contract. We recommend minimizing the number of addresses being added if possible.";
const approveAddressesHeadingText =
  "Pre-approve addresses that can deposit to this syndicate. These addresses will be added to this syndicate’s pre-approved list.";
const textAreaTitle = "Pre-Approve Depositor List";
const allowlistTextAreaLabel = "Wallet addresses to be added to the allowlist";
const allowlistBulktext =
  "We recommend bulk adding wallet addresses to avoid repeated blockchain transactions and gas costs.";
const approvedAddressesLabel = "Approve Address";
export const buttonText = "Confirm";

// public-facing social profile
const socialProfileDescription =
  "Help others understand this syndicate by requesting a public-facing social profile. We’ll help you create it.";
const socialProfileButtonText = "Request";

// social profile badge text
const genesisBadgeTitle = "Genesis";
const genesisBadgeDescription = "Among the first";

export const genesisBadgeConstants = {
  genesisBadgeTitle,
  genesisBadgeDescription,
};

// metamask error texts
const metamaskRejectByUserMessage = "request was rejected.";
const metamaskInvalidParamsMessage = "Invalid parameters provided.";
const metamaskInternalErrorMessage = "Internal server error.";
const metamaskUnknownErrorMessage = "An error occured.";
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

export const memberAddressToolTip =
  "The address the depositor used to send funds to the manager.";

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
const maxTotalMemberDepositsExceededErrorMessage =
  "You cannot deposit this amount. Your maximum allowed deposit of";
const amountExceededText = "will be exceeded";

// invest/deposit page
export const constants = {
  depositTitleText,
  depositMoreTitleText,
  allowListDisabledApprovedText,
  allowListDisabledNotApprovedText,
  allowListEnabledApprovedText,
  depositDisclaimerText,
  depositMemberAccreditedText,
  withdrawalTitleText,
  withdrawalDepositTitleText,
  withdrawalDisclaimerText,
  noSyndicateText,
  depositsAndWithdrawalsUnavailableText,
  depositsAndWithdrawalsUnavailableTitleText,
  loaderWithdrawalHeaderText,
  loaderDepositHeaderText,
  loaderApprovalHeaderText,
  loaderDistributionHeaderText,
  increaseDepositAllowanceErrorMessage,
  loaderGeneralHeaderText,
  loaderSubtext,
  depositBannerText,
  amountConversionErrorText,
  actionFailedError,
  allowListEnabledNotApprovedText,
  depositsUnavailableText,
  depositsUnavailableTitleText,
  connectWalletMessageTitle,
  connectWalletMessage,
  connectWalletWithdrawMessage,
  connectWalletDepositMessage,
  depositsUnavailableMaxMembersZeroText,
  depositSuccessTitleText,
  depositSuccessSubtext,
  depositSuccessButtonText,
  depositSuccessBackButtonText,
  approvalSuccessTitleText,
  approvalSuccessSubtext,
  approvalSuccessButtonText,
  retryButtonText,
  dismissButtonText,
  amountLessThanMinDepositErrorMessage,
  amountMoreThanMaxDepositErrorMessage,
  maxTotalDepositsExceededErrorMessage,
  maxTotalMemberDepositsExceededErrorMessage,
  amountExceededText,
  maxMemberDepositsTitleText,
  maxMemberDepositsText,
  nonMemberWithdrawalTitleText,
  nonMemberWithdrawalText,
  amountGreaterThanMemberDistributionsText,
  withdrawalSuccessTitleText,
  withdrawalSuccessSubtext,
  withdrawalSuccessButtonText,
  withdrawalSuccessBackButtonText,
  readOnlySyndicateText,
  readOnlySyndicateTitle,
  withdrawalAmountGreaterThanMemberDeposits,
  withdrawalsUnavailableTitleText,
  withdrawalAllowanceInsufficientText,
  withdrawalAmountLessThanMinDepositErrorText,
};

// Tooltips
export const closeDateToolTip =
  "This is the date on which the syndicate will automatically close.";

export const distributionShareToSyndicateLeadToolTip =
  "This is the distribution share in % that will be sent to the manager on all distributions. A standard structure would be 20%.";

export const distributionShareToSyndicateProtocolToolTip =
  "This is the distribution share in % that will be sent to Syndicate Treasury on all distributions. A minimum distribution share of 0.5% is required.";

export const myDepositsToolTip =
  "Total deposits this wallet account has already made to the syndicate";

export const myPercentageOfThisSyndicateToolTip =
  "Percentage ownership the member has in this syndicate";

export const myDistributionsToDateToolTip =
  "All accumulated distributions the member has been awarded to date.";

export const myWithDrawalsToDateTooltip =
  "All accumulated amounts the member has withdrawn from this syndicate.";

export const withdrawalsToDepositPercentageToolTip =
  "Percentage of total withdrawals to total distributions the member has received to date.";

export const createdDateToolTip =
  "This is the date this syndicate was created/launched.";

export const SyndicateInBetaBannerText =
  "Syndicate is currently in private beta. We take security seriously, but bugs may still exist.";

// syndicate actions page
const noSyndicateTitleText = "No Syndicate DAO found at that address.";
const noSyndicateMessageText =
  "Check for more details on Etherscan to see if your transaction is pending or failed.";
const syndicateAddressInvalidTitleText = "Invalid syndicate address";
const syndicateAddressInvalidMessageText =
  "Check to ensure you have the correct address.";
const backLinkText = "Back To My Syndicates";
const notSyndicateYetTitleText = "isn't a syndicate yet";
const notSyndicateYetMessageText =
  "This URL isn't currently associated with a syndicate. Invite someone to create a syndicate by copying the link below.";
const notSyndicateForManagerYetMessageText =
  "This URL and the address you are connected with aren't associated with a syndicate yet.";
const creatingSyndicateForManagerTitle =
  "Your syndicate is being created, it will be ready soon";
const creatingSyndicateTitle =
  "This syndicate is being created, it will be ready soon";
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
  notSyndicateYetTitleText,
  notSyndicateYetMessageText,
  creatingSyndicateForManagerTitle,
  creatingSyndicateTitle,
  notSyndicateForManagerYetMessageText,
  nonModifiableSyndicateErrorText,
  enableDistributionToModifySyndicateText,
};

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
  allowlistTextAreaLabel,
  allowlistBulktext,
  approvedAddressesLabel,
};

// request social profile texts
export const requestSocialProfileConstats = {
  socialProfileDescription,
  socialProfileButtonText,
};

// contract transaction state constants
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
  "Please confirm the transaction in your wallet.";
// modify member distributions constants
const currentDistributionClaimedAmountTooltip =
  "Current amount of distributions claimed by the member address";
const newDistributionClaimedAmountTooltip =
  "New amount of distributions claimed by the member address";

const confirmModifyMemberDistributionsText =
  "Confirm that you want to modify member claimed distributions.";

export const ModifyMemberDistributionsConstants = {
  currentDistributionClaimedAmountTooltip,
  newDistributionClaimedAmountTooltip,
  confirmModifyMemberDistributionsText,
};

const currentDepositAmountTooltip =
  "Current amount of funds contributed by this member to the syndicate";
const newDepositAmountTooltip =
  "Amount amount of funds contributed by this member to the syndicate";

// modify syndicate cap table contants
export const ModifySyndicateCapTableConstants = {
  currentDepositAmountTooltip,
  newDepositAmountTooltip,
};

// indicate that only one syndicate can be created per account
export const oneSyndicatePerAccountText =
  "Only one syndicate can be created per wallet address. To create another syndicate, please switch to a different wallet address.";

export const confirmSetManagerFeeAddressText =
  "Please confirm you want to set the address provided as your fee recipient address";

export const welcomeToSydicate = "Welcome to Syndicate";
export const syndicateBeta =
  "Syndicate is currently in private beta. Connect an approved wallet or join the waitlist to get access.";
export const openToInvestors = "Syndicate is only open to accredited investors";
export const joinWaitlist = "Join waitlist";

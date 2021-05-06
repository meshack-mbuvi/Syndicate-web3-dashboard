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
  "By depositing tokens, you attest you are accredited below to join this syndicate. After depositing, contact the syndicate leads to confirm receipt and withdraw timing.";
const withdrawalTitleText = "Withdraw My Distributions.";
const withdrawalDisclaimerText = "Remember, all withdraws are final.";
const noSyndicateText =
  "No syndicate with given address. Please check the address provided.";
const depositsAndWithdrawalsUnavailableText =
  "Deposits and withdraws are not currently available";
const depositsUnavailableTitleText = "Deposits";
const depositsUnavailableText = "Syndicate closed. Deposits unavailable.";
const depositsAndWithdrawalsUnavailableTitleText = "Deposits & Withdraws";
const loaderWithdrawalHeaderText =
  "Please wait while the withdrawal transaction completes...";
const loaderDepositHeaderText =
  "Please wait while the deposit transaction completes...";
const loaderApprovalHeaderText =
  "Please wait while the approval transaction completes...";
const loaderGeneralHeaderText =
  "Please wait while the transaction completes...";
const loaderSubtext =
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
const textAreaTitle = "Pre-Approved Depositor List";
const approvedAddressesLabel = "Approved Address:";
const separateWithCommas = "(separate with commas)";
const buttonText = "Confirm";

// exports

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

export const AgreeToOurTermsOfService =
  "Please agree to our terms of service to continue.";
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

// we can add constants to this file to make our
// components look cleaner.

// constants for the invest/deposit page.
const depositTitleText = "Deposit Into Syndicate";
const depositMoreTitleText = "Deposit More Into Syndicate";
const depositStatusApprovedText = "Whitelist enabled: You’re pre-approved.";
const depositStatusNotApprovedText =
  "Whitelist disabled: You will need to be approved.";
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
const depositsAndWithdrawalsUnavailableTitleText = "Deposits & Withdraws";

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
  approvedAddressesLabel,
  separateWithCommas,
  buttonText,
};

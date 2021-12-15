// we can add constants to this file to make our
// components look cleaner.

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

// Tooltips
export const SyndicateInBetaBannerText = "BETA";

// syndicate actions page
const noTokenTitleText = "No club found at that address.";
const noTokenMessageText =
  "Check for more details on Etherscan to see if your transaction is pending or failed.";
const syndicateAddressInvalidTitleText = "Invalid syndicate address";
const syndicateAddressInvalidMessageText =
  "Check to ensure you have the correct address.";
const backLinkText = "Back To My Investments Clubs";
const notSyndicateYetTitleText = "isn't a club yet";
const invalidTokenAddress = "is not a valid Ethereum address";
const notSyndicateYetMessageText =
  "This URL isn't currently associated with a syndicate. Invite someone to create a syndicate by copying the link below.";
const notSyndicateForManagerYetMessageText =
  "This URL and the address you are connected with aren't associated with a syndicate yet.";
const creatingSyndicateForManagerTitle =
  "Your syndicate is being created, it will be ready soon";
const creatingSyndicateTitle =
  "This syndicate is being created, it will be ready soon";

const nonModifiableSyndicateErrorText =
  "This syndicate is not modifable. This means you cannot modify the syndicate details.";
const enableDistributionToModifySyndicateText =
  "Distributions must be set before modifying syndicate details.";

export const syndicateActionConstants = {
  noTokenTitleText,
  noTokenMessageText,
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
  invalidTokenAddress,
};

// contract transaction state constants
export const confirmWalletText = "Waiting for confirmation";
export const web3InstantiationErrorText =
  "Sorry! We are unable to connect to network where the contract is deployed. Please ensure you have access to stable network and retry the connection.";

// indicate that only one syndicate can be created per account
export const oneSyndicatePerAccountText =
  "Only one syndicate can be created per wallet address. To create another syndicate, please switch to a different wallet address.";

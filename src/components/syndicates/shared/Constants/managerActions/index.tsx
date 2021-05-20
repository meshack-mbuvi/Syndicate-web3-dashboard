// constants for the manager screens.

const depositAllowanceInsufficientText =
  "The current total maximum deposit does not have the sufficient allowance set. The allowance must reflect the total maximum deposit amount in order for members to be able to withdraw their deposits while the syndicate is open.";
const distributionAllowanceInsufficientText =
  "The current distribution does not have sufficient allowances set for its tokens. The allowances must reflect the distribution amounts of each token in order for members to be able to withdraw the entirety of what they’re entitled to.";
const distributionAmountLabel = "Distribution Amount:";
const depositAmountLabel = "Total Maximum Deposits:";
const setDistributionsTitleText = "Choose Distribution Tokens";
const distributionDetailsTitleText = "Distribution Details";
const setDistributionsSubText =
  " IMPORTANT: In Syndicate Protocol v1, assets are NOT managed in the protocol for additional safety and will still appear in your syndicate’s wallet. Members will be able to withdraw distributions from the syndicate’s wallet via ERC20 allowances.";
const managerChooseDistributionTokenText =
  "Choose tokens and specify the amount to distribute from this syndicate back to members, making them available for withdrawal.";
const syndicateMustBeClosedText =
  "Syndicate must be closed before distributions are set.";
const insufficientDistributionsAllowanceBadgeText =
  "This syndicate does not have the necessary allowance set for members to withdraw their distributions. Please set the allowance so that it reflects the total distributions available.";
const insufficientDepositsAllowanceBadgeText =
  "This syndicate does not have the necessary allowance set for members to withdraw their deposits. Please set the allowance so that it reflects the max. total deposit amount.";
const syndicateClosedBadgeText = "Syndicate closed with no distribution set.";
const insufficientBalanceErrorText =
  "Please ensure you have sufficient balance to distribute the full amount.";
const successfulDistributionTitleText = "Distributions set.";
const successfulDistributionText = "Distribution transaction was successful.";

// tooltip texts
const managerSyndicateAddressTooltipText =
  "This is the wallet address of the manager account. Allowance will be set on this account so that members can withdraw their entitled distributions.";
const sufficientDepositsAllowanceTooltipText =
  "This syndicate has the necessary allowance set for members to withdraw their deposits.";
const sufficientDistributionsAllowanceTooltipText =
  "This syndicate has the necessary allowance set for members to withdraw their distributions.";

export const managerActionTexts = {
  depositAllowanceInsufficientText,
  distributionAllowanceInsufficientText,
  distributionAmountLabel,
  depositAmountLabel,
  managerSyndicateAddressTooltipText,
  setDistributionsSubText,
  setDistributionsTitleText,
  managerChooseDistributionTokenText,
  syndicateMustBeClosedText,
  distributionDetailsTitleText,
  insufficientDistributionsAllowanceBadgeText,
  insufficientDepositsAllowanceBadgeText,
  syndicateClosedBadgeText,
  sufficientDepositsAllowanceTooltipText,
  sufficientDistributionsAllowanceTooltipText,
  insufficientBalanceErrorText,
  successfulDistributionText,
  successfulDistributionTitleText,
};

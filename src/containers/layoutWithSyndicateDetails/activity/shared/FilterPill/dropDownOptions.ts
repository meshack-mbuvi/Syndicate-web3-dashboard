// activity table dropdown options
export const activityDropDownOptions = [
  {
    text: 'Everything',
    // null value means all transactions based off legacyTransactions query
    value: null,
    icon: '/images/activity/everything.svg'
  },
  {
    text: 'Uncategorized',
    value: 'UNCATEGORIZED',
    icon: '/images/activity/question.svg'
  },
  {
    text: 'Deposit',
    value: 'DEPOSIT',
    icon: '/images/activity/deposit-transaction.svg'
  },
  {
    text: 'Distribution',
    value: 'MEMBER_DISTRIBUTED',
    icon: '/images/activity/distribution.svg'
  },
  {
    text: 'Investment',
    value: 'INVESTMENT',
    icon: '/images/activity/investment-transaction.svg'
  },
  {
    text: 'Investment token',
    value: 'INVESTMENT_TOKEN',
    icon: '/images/activity/investment-tokens.svg'
  },
  {
    text: 'Expense',
    value: 'EXPENSE',
    icon: '/images/activity/expense-transaction.svg'
  },
  {
    text: 'Other',
    value: 'OTHER',
    icon: '/images/activity/other-transaction.svg'
  }
];

// assets section dropdown options
export const assetsDropDownOptions = [
  {
    text: 'Everything',
    value: 'everything',
    icon: '/images/everything.svg'
  },
  {
    text: 'Tokens',
    value: 'tokens',
    icon: '/images/token.svg'
  },
  {
    text: 'Off-chain investments',
    value: 'investments',
    icon: '/images/investments-title-icon.svg'
  },
  {
    text: 'NFTs',
    value: 'nfts',
    icon: '/images/collectibles.svg'
  }
];

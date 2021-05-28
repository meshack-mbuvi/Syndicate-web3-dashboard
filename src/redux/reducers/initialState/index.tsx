/**
 * This holds the application state.
 *
 * web3 = new Web3(Web3.givenProvider || `${process.env.NEXT_PUBLIC_INFURA_ENDPOINT}`)
 * web3contractInstance = new web3.eth.Contract(Syndicate.abi,contractAddress);
 * All the properties of the web3 object are set during wallet connection
 */
export const initialState = {
  web3: {
    library: null,
    status: "disconnected",
    showConnectionModal: false,
    isErrorModalOpen: false,
    error: null,
    address: null,
    web3: null,
    web3contractInstance: null,
  },
  syndicates: [],
  syndicate: null,
  syndicateFound: true,
  syndicateAddressIsValid: true,
  loading: false,
  submitting: false,
  showWalletModal: false,
  syndicateInvestments: [],
  syndicateAction: {
    withdraw: false,
    deposit: false,
    managerView: false,
    generalView: false,
  },
  syndicateDetails: {
    totalDepositors: 0,
    totalDeposits: 0,
    totalWithdrawn: 0.0,
    profitSharedToSyndicateProtocol: 0,
    profitSharedToSyndicateLead: 0,
    totalOperatingFees: 0,
  },
  syndicateLPDetails: {
    myDeposits: 0,
    myPercentageOfThisSyndicate: 0,
    myDistributionsToDate: 0,
    myAddressAllowed: false,
    myWithdrawalsToDate: 0,
    withdrawalsToDepositPercentage: 0,
  },
  syndicateDetailsLoading: false,
  syndicateLPDetailsLoading: false,
  syndicateContractInstance: {},
  depositTokenAllowanceDetails: [],
  distributionTokensAllowanceDetails: [],
};

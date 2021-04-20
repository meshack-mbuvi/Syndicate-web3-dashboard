/**
 * This holds the application state.
 *
 * web3 = new Web3(Web3.givenProvider || "ws://localhost:8545")
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
  loading: false,
  submitting: false,
  showWalletModal: false,
  syndicateInvestments: [],
  withdrawalMode: false,
  depositMode: true,
};

import { Syndicate } from "@/@types/syndicate";
import Web3 from "web3";

type InitialState = {
  web3: {
    status: string;
    showConnectionModal: boolean;
    isErrorModalOpen: boolean;
    error: any;
    address: any;
    web3: Web3;
    web3contractInstance: any;
    account: string;
    providerName: string;
    currentEthereumNetwork: string;
    ethereumNetwork: {
      correctEthereumNetwork: string;
      invalidEthereumNetwork: boolean;
    };
  };
  syndicates: Syndicate[];
  syndicate: Syndicate;
  syndicateFound: boolean;
  syndicateAddressIsValid: boolean;
  loading: boolean;
  submitting: boolean;
  showWalletModal: boolean;
  syndicateInvestments: any[];
  syndicateDetails: {
    totalDepositors: number;
    totalDeposits: number;
    totalWithdrawn: number;
    distributionSharedToSyndicateProtocol: number;
    distributionSharedToSyndicateLead: number;
    totalOperatingFees: number;
  };
  memberDepositDetails: {
    memberTotalDeposits: string;
    memberPercentageOfSyndicate: string;
    memberAddressAllowed: boolean;
    memberMaxDepositReached: boolean;
  };
  memberWithdrawalDetails: {
    [address: string]: {
      [tokenSymbol: string]: {
        memberDistributionsToDate: string;
        memberDistributionsWithdrawalsToDate: string;
        memberWithdrawalsToDepositPercentage: string;
      };
    };
  };
  syndicateDetailsLoading: boolean;
  syndicateMemberDetailsLoading: boolean;
  depositTokenAllowanceDetails: [];
  distributionTokensAllowanceDetails: [];
  oneSyndicatePerAccount: boolean;
  syndicateDistributionTokens: any;
  syndicateContracts: {
    ManagerLogicContract: unknown;
  };
  syndicateManageMembers: {
    syndicateMembers: [];
    loading: boolean;
  };
  manageActions: {
    modifyMemberDistribution: boolean;
    modifyCapTable: boolean;
    rejectMemberAddressOrDeposit: boolean;
    showDepositOnly: boolean;
    showAddressOnly: boolean;
    memberAddress: string;
  };
};

/**
 * This holds the application state.
 *
 * web3 = new Web3(Web3.givenProvider || `${process.env.NEXT_PUBLIC_INFURA_ENDPOINT}`)
 * web3contractInstance = new web3.eth.Contract(Syndicate.abi,contractAddress);
 * All the properties of the web3 object are set during wallet connection
 */
export const initialState: InitialState = {
  web3: {
    status: "disconnected",
    showConnectionModal: false,
    isErrorModalOpen: false,
    error: null,
    address: null,
    web3: null,
    web3contractInstance: null,
    account: "",
    providerName: "",
    currentEthereumNetwork: "",
    ethereumNetwork: {
      correctEthereumNetwork: "",
      invalidEthereumNetwork: false,
    },
  },
  syndicates: [],
  syndicate: null,
  syndicateFound: true,
  syndicateAddressIsValid: true,
  loading: false,
  submitting: false,
  showWalletModal: false,
  syndicateInvestments: [],
  syndicateDetails: {
    totalDepositors: 0,
    totalDeposits: 0,
    totalWithdrawn: 0.0,
    distributionSharedToSyndicateProtocol: 0,
    distributionSharedToSyndicateLead: 0,
    totalOperatingFees: 0,
  },
  memberDepositDetails: {
    memberTotalDeposits: "0",
    memberPercentageOfSyndicate: "0",
    memberAddressAllowed: true,
    memberMaxDepositReached: false,
  },
  memberWithdrawalDetails: {},
  syndicateDetailsLoading: false,
  syndicateMemberDetailsLoading: false,
  depositTokenAllowanceDetails: [],
  distributionTokensAllowanceDetails: [],
  oneSyndicatePerAccount: false,
  syndicateDistributionTokens: null,
  syndicateContracts: {
    ManagerLogicContract: null,
  },
  syndicateManageMembers: {
    syndicateMembers: [],
    loading: false,
  },
  manageActions: {
    modifyMemberDistribution: false,
    modifyCapTable: false,
    rejectMemberAddressOrDeposit: false,
    showDepositOnly: false,
    showAddressOnly: false,
    memberAddress: "",
  },
};

import { Syndicate } from "@/@types/syndicate";
import { TWO_WEEKS_IN_MS } from "@/utils/constants";
import ct from "countries-and-timezones";
import Web3 from "web3";

export enum SYNDICATE_CHAIN_TYPE {
  onChain = "onChain",
  offChain = "offChain",
}
const initialWeb3 = new Web3(process.env.NEXT_PUBLIC_INFURA_ENDPOINT);

type InitialState = {
  web3: {
    status: string;
    connect: boolean;
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
    syndicateMembers: {
      memberAddress: string;
      returningDeposit: boolean;
      memberDeposit: string;
      memberStake: string;
      memberAddressAllowed: boolean;
    }[];
    loading: boolean;
    confirmReturnDeposit: boolean;
    memberAddresses: string[];
    totalAmountToReturn: number;
  };
  manageActions: {
    modifyMemberDistribution: boolean;
    modifyCapTable: boolean;
    rejectMemberAddressOrDeposit: boolean;
    showDepositOnly: boolean;
    showAddressOnly: boolean;
  };
  createSyndicate: {
    syndicateOffChainData: {
      type: string;
      email: string;
      syndicateName: string;
      organization: string;
      country: string;
      syndicateTemplateTitle?: string;
      setupLegalEntity?: string;
    };
    tokenAndDepositsLimits: {
      numMembersMax: number | string;
      depositMemberMin: string;
      depositMemberMax: string;
      depositTotalMax: string;
      depositTokenDetails: {
        depositTokenAddress: string;
        depositTokenSymbol: string;
        depositTokenLogo: string;
        depositTokenName: string;
        depositTokenDecimals: number;
      };
    };
    feesAndDistribution: {
      expectedAnnualOperatingFees: number;
      profitShareToSyndicateLead: number;
      syndicateProfitSharePercent: number;
    };
    modifiable: boolean;
    transferable: boolean;
    allowlist: {
      isAllowlistEnabled: boolean;
      memberAddresses: string[];
      allowRequestToAllowlist: boolean;
    };
    closeDateAndTime: {
      selectedDate?: Date;
      selectedTimeValue?: string;
      selectedTimezone?: Record<"label" | "value" | "timezone", string>;
    };
  };
  syndicateNewMembers: {
    newSyndicateMembers: []
  },
};

// Get timezone default values on create syndicate
const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
const timezones = ct.getAllTimezones();

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
    connect: false,
    showConnectionModal: false,
    isErrorModalOpen: false,
    error: null,
    address: null,
    web3: initialWeb3,
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
    confirmReturnDeposit: false,
    memberAddresses: [],
    totalAmountToReturn: 0,
  },
  syndicateNewMembers: {
    newSyndicateMembers: []
  },
  manageActions: {
    modifyMemberDistribution: false,
    modifyCapTable: false,
    rejectMemberAddressOrDeposit: false,
    showDepositOnly: false,
    showAddressOnly: false,
  },
  createSyndicate: {
    syndicateOffChainData: {
      type: SYNDICATE_CHAIN_TYPE.onChain,
      email: "",
      syndicateName: "",
      organization: "",
      country: "United States",
      syndicateTemplateTitle: "",
      setupLegalEntity: "",
    },
    tokenAndDepositsLimits: {
      numMembersMax: "",

      depositMemberMin: "",
      depositMemberMax: "",
      depositTotalMax: "",

      depositTokenDetails: {
        depositTokenAddress: "",
        depositTokenSymbol: "",
        depositTokenLogo: "",
        depositTokenName: "",
        depositTokenDecimals: 18,
      },
    },
    feesAndDistribution: {
      // WARN: The values/percentages below need to be converted to basis points
      // before passing them to create syndicate method.
      // basis points => (2/100)* 10000=> 2 * 100 = 200 basis points
      expectedAnnualOperatingFees: 0,
      profitShareToSyndicateLead: 0,
      syndicateProfitSharePercent: 0.5,
    },
    modifiable: false,
    transferable: false,
    allowlist: {
      isAllowlistEnabled: true,
      memberAddresses: [],
      allowRequestToAllowlist: true,
    },
    closeDateAndTime: {
      selectedDate: new Date(Date.now() + TWO_WEEKS_IN_MS),
      selectedTimeValue: "12:00 AM",
      // Set timezone based on client's region
      selectedTimezone: {
        label: timezones[tz]?.name,
        value: timezones[tz]?.name,
        timezone: timezones[tz]?.utcOffsetStr,
      },
    },
  },
};

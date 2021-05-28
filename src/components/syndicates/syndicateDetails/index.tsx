import { floatedNumberWithCommas } from "@/utils/numberWithCommas";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { connect, useDispatch, useSelector } from "react-redux";
import { EtherscanLink } from "src/components/syndicates/shared/EtherscanLink";
import { setSyndicateDetails } from "src/redux/actions/syndicateDetails";
import { storeDistributionTokensDetails, storeDepositTokenAllowance } from "src/redux/actions/tokenAllowances";
// utils
import { formatAddress } from "src/utils/formatAddress";
import { TokenMappings } from "src/utils/tokenMappings";
import { BadgeCard, DetailsCard } from "../shared";
import {
  closeDateToolTip,
  createdDateToolTip,
  depositTokenToolTip,
  expectedAnnualOperatingFeesToolTip,
  profitShareToSyndicateLeadToolTip,
  profitShareToSyndicateProtocolToolTip,
  syndicateDetailsConstants,
} from "../shared/Constants";
import ERC20ABI from "src/utils/abi/rinkeby-dai";
import { checkAccountAllowance } from "src/helpers/approveAllowance";
import { getWeiAmount, onlyUnique } from "@/utils/conversions";
import { ERC20TokenDetails } from "@/utils/ERC20Methods";
import ManagerSetAllowance from "@/containers/managerActions/setAllowances";
import { getPastEvents } from "@/helpers/retrieveEvents";
import { RootState } from "@/redux/store";

const SyndicateDetails = (props: {
  syndicateDetails: any;
  lpIsManager: boolean;
  syndicate: any;
  syndicateContractInstance: any;
  web3: any;
  depositTokenAllowanceDetails: any;
  distributionTokensAllowanceDetails: any;
}) => {
  const {
    syndicateDetails,
    syndicate,
    lpIsManager,
    web3: { web3, account },
    depositTokenAllowanceDetails,
    distributionTokensAllowanceDetails,
  } = props;
  const { syndicateContractInstance } = useSelector(
    (state: RootState) => state.syndicateInstanceReducer
  );

  const dispatch = useDispatch();

  const router = useRouter();
  const [details, setDetails] = useState([
    {
      header: "Created on",
      subText: "",
      tooltip: "",
    },
    {
      header: "Close Date",
      subText: "",
      tooltip: "",
      isEditable: false,
    },
    {
      header: "Deposit/Distribution Token",
      subText: "",
      tooltip: "",
      isEditable: false,
    },
    {
      header: "Expected Annual Operating Fees",
      subText: "",
      tooltip: "",
      isEditable: false,
    },
    {
      header: "Profit Share to Syndicate Lead",
      subText: "",
      tooltip: "",
      isEditable: false,
    },
    {
      header: "Profit Share to Protocol",
      subText: "",
      tooltip: "",
      isEditable: false,
    },
  ]);

  // state to handle copying of the syndicate address to clipboard.
  const [showCopyState, setShowCopyState] = useState<boolean>(false);

  // state to handle details about the current ERC20 token
  const [depositTokenSymbol, setDepositTokenSymbol] = useState<string>("DAI");
  const [depositTokenDecimals, setDepositTokenDecimals] = useState<number>(18);
  const [depositTokenContract, setDepositTokenContract] = useState<any>("");

  // states to show general syndicate details
  const [
    syndicateCummulativeDetails,
    setSyndicateCummulativeDetails,
  ] = useState([
    {
      header: "Total Deposits",
      subText: "",
    },
  ]);

  // states to handle manager allowances
  const [
    managerDepositsAllowance,
    setManagerDepositsAllowance,
  ] = useState<number>(0);
  const [
    correctManagerDepositsAllowance,
    setCorrectManagerDepositsAllowance,
  ] = useState<boolean>(false);
  const [
    correctManagerDistributionsAllowance,
    setCorrectManagerDistributionsAllowance,
  ] = useState<boolean>(false);
  const [
    showManagerSetAllowances,
    setShowManagerSetAllowances,
  ] = useState<boolean>(false);

  // get syndicate address from the url
  const { syndicateAddress } = router.query;

  if (syndicate) {
    var {
      openToDeposits,
      distributionsEnabled,
      depositERC20ContractAddress,
      maxTotalDeposits,
    } = syndicate;
  }

  const {
    syndicateDetailsFooterText,
    syndicateDetailsLinkText,
  } = syndicateDetailsConstants;

  // get and set current token details
  useEffect(() => {
    if (depositERC20ContractAddress && web3) {
      // set up token contract
      const tokenContract = new web3.eth.Contract(
        ERC20ABI,
        depositERC20ContractAddress
      );

      setDepositTokenContract(tokenContract);

      // set token symbol
      getERC20TokenDetails(depositERC20ContractAddress);
    }
  }, [depositERC20ContractAddress, web3]);

  // get allowance set on manager's account for the current depositERC20
  const getManagerDepositTokenAllowance = async () => {
    const managerDepositTokenAllowance = await checkAccountAllowance(
      depositERC20ContractAddress,
      account,
      syndicateContractInstance._address
    );

    const managerDepositAllowance = getWeiAmount(
      managerDepositTokenAllowance,
      depositTokenDecimals,
      false
    );
    setManagerDepositsAllowance(parseFloat(managerDepositAllowance));

    // check if the allowance set by the manager is not enough to cover the total max. deposits.
    // if the current token allowance is less than the syndicate total max. deposits
    // but is greater than zero, we'll consider this insufficient allowance.
    // The manager needs to fix this by adding more deposit token allowance to enable members
    // to withdraw their deposits.
    const sufficientAllowanceSet =
      +managerDepositAllowance >= +maxTotalDeposits;

    // dispatch action to store deposit token allowance details
    dispatch(
      storeDepositTokenAllowance([
        {
          tokenAddress: depositERC20ContractAddress,
          tokenAllowance: managerDepositAllowance,
          tokenSymbol: depositTokenSymbol,
          tokenDeposits: maxTotalDeposits,
          sufficientAllowanceSet,
        },
      ])
    );
    //reset distribution details
    dispatch(storeDistributionTokensDetails([]));
  };

  // get events where distribution was set.
  // we'll fetch distributionERC20s from here and check if the manager has set the correct
  // allowance for all of them.
  const getManagerDistributionTokensAllowances = async () => {
    const addressOfSyndicate = web3.utils.toChecksumAddress(syndicateAddress);

    // get events where an LP invested in a syndicate.
    const distributionEvents = await getPastEvents(
      syndicateContractInstance,
      "setterDistribution",
      { syndicateAddress: addressOfSyndicate }
    );

    if (distributionEvents.length > 0) {
      // get all distributionERC20 tokens
      let distributionERC20s = [];
      let allowanceAndDistributionDetails = [];
      for (let i = 0; i < distributionEvents.length; i++) {
        const { distributionERC20Address } = distributionEvents[i].returnValues;
        distributionERC20s.push(distributionERC20Address);
      }
      const uniqueERC20s = distributionERC20s.filter(onlyUnique);

      // set up token contract to check manager allowance for the ERC20
      for (let i = 0; i < uniqueERC20s.length; i++) {
        const tokenAddress = uniqueERC20s[i];
        const tokenDetails = new ERC20TokenDetails(tokenAddress);
        const tokenDecimals = await tokenDetails.getTokenDecimals();

        // get token symbol
        const mappedTokenAddress = Object.keys(TokenMappings).find(
          (key) => key.toLowerCase() == tokenAddress.toLowerCase()
        );
        if (mappedTokenAddress) {
          var tokenSymbol = TokenMappings[mappedTokenAddress];
        }

        // get allowance set for token by the manager
        const managerAddress = syndicate?.currentManager;
        const tokenManagerAllowance = await checkAccountAllowance(
          tokenAddress,
          managerAddress,
          syndicateContractInstance._address
        );
        const tokenAllowance = getWeiAmount(
          tokenManagerAllowance,
          tokenDecimals,
          false
        );

        // get total distributions for the token
        const totalCurrentDistributions = await syndicateContractInstance.methods
          .getTotalDistributions(syndicateAddress, tokenAddress)
          .call()
          .then((data) => data);

        const tokenDistributions = getWeiAmount(
          totalCurrentDistributions,
          tokenDecimals,
          false
        );

        // check if allowance set is enough to cover distributions.
        const sufficientAllowanceSet = +tokenAllowance >= +tokenDistributions;

        allowanceAndDistributionDetails.push({
          tokenAddress,
          tokenAllowance,
          tokenDistributions,
          sufficientAllowanceSet,
          tokenSymbol,
        });
      }
      // dispatch token distribution details to the redux store
      dispatch(storeDistributionTokensDetails(allowanceAndDistributionDetails));

      //reset distribution token fields
      dispatch(storeDepositTokenAllowance([]));
    }
  };

  // check whether current distribution/deposit token allowances are enough to cover
  // withdrawal of distributions/deposits
  useEffect(() => {
    // update local state to indicate whether all tokens have the correct allowance set
    // check if the deposit token allowances if the syndicate is still open.
    // checks will be done only if the current member is the manager.
    if (lpIsManager) {
      if (openToDeposits && depositTokenAllowanceDetails.length > 0) {
        // indexing from 0 only because there's just one primary depositERC20 token
        if (depositTokenAllowanceDetails[0].sufficientAllowanceSet === true) {
          setCorrectManagerDepositsAllowance(true);
        } else {
          setCorrectManagerDepositsAllowance(false);
        }
      }

      // check distribution allowances if distribution has been set.
      if (distributionTokensAllowanceDetails.length) {
        // we need to loop over all values and check if there's any distribution token.
        // a syndicate can have infinite distribution tokens.
        for (let i = 0; i < distributionTokensAllowanceDetails.length; i++) {
          const { sufficientAllowanceSet } = distributionTokensAllowanceDetails[
            i
          ];
          if (!sufficientAllowanceSet) {
            setCorrectManagerDistributionsAllowance(false);
            return;
          }
          setCorrectManagerDistributionsAllowance(true);
        }
      }
    }
  }, [
    depositTokenAllowanceDetails,
    distributionTokensAllowanceDetails,
    openToDeposits,
    distributionsEnabled,
    lpIsManager,
    account,
    syndicate,
  ]);

  // assess manager deposit and distributions token allowance
  useEffect(() => {
    if (depositTokenContract && web3 && syndicateContractInstance) {
      // if the syndicate is still open to deposits, we'll check the deposit token allowance.
      // otherwise, we'll check the distributions token(s) allowance(s)
      if (openToDeposits) {
        getManagerDepositTokenAllowance();
      } else if (!openToDeposits && distributionsEnabled) {
        getManagerDistributionTokensAllowances();
      }
    }
  }, [syndicateContractInstance, syndicate]);

  // set syndicate cummulative values
  useEffect(() => {
    if (syndicate) {
      const { totalDeposits, totalDepositors } = syndicate;
      setSyndicateCummulativeDetails([
        {
          header: "Total Deposits",
          subText: `${floatedNumberWithCommas(
            totalDeposits
          )} ${depositTokenSymbol} (${totalDepositors} ${
            parseInt(totalDepositors) === 1 ? "depositor" : "depositors"
          })`,
        },
      ]);
    }
  }, [syndicate, syndicateDetails]);

  useEffect(() => {
    if (syndicate) {
      let {
        closeDate,
        createdDate,
        profitShareToSyndicateProtocol,
        profitShareToSyndicateLead,
        managerManagementFeeBasisPoints,
      } = syndicate;

      setDetails([
        {
          header: "Created on",
          subText: createdDate,
          tooltip: createdDateToolTip,
        },
        {
          header: "Close Date",
          subText: closeDate,
          tooltip: closeDateToolTip,
        },
        {
          header: "Deposit/Distribution Token",
          subText: `${depositTokenSymbol} / ${depositTokenSymbol}`,
          tooltip: depositTokenToolTip,
        },
        {
          header: "Expected Annual Operating Fees",
          subText: `${managerManagementFeeBasisPoints}%`,
          tooltip: expectedAnnualOperatingFeesToolTip,
        },
        {
          header: "Profit Share to Syndicate Lead",
          subText: `${profitShareToSyndicateLead}%`,
          tooltip: profitShareToSyndicateLeadToolTip,
        },
        {
          header: "Profit Share to Protocol",
          subText: `${profitShareToSyndicateProtocol}%`,
          tooltip: profitShareToSyndicateProtocolToolTip,
        },
      ]);
    }
  }, [syndicate, syndicateDetails]);

  /**
   * method used to get details on the current ERC20 token
   */
  const getERC20TokenDetails = async (depositERC20ContractAddress: string) => {
    // getting token symbol doesn't seem to return a valid hex value
    // using this manual mapping for the time being
    const tokenAddress = depositERC20ContractAddress;
    const mappedTokenAddress = Object.keys(TokenMappings).find(
      (key) => key.toLowerCase() == tokenAddress.toLowerCase()
    );
    if (mappedTokenAddress) {
      setDepositTokenSymbol(TokenMappings[mappedTokenAddress]);
    }

    // get token decimals
    const tokenDetails = new ERC20TokenDetails(depositERC20ContractAddress);
    const tokenDecimals = await tokenDetails.getTokenDecimals();
    setDepositTokenDecimals(tokenDecimals);
  };

  /**
   * Extracts some syndicate data and dispatches an action to set the details
   */
  useEffect(() => {
    if (syndicateContractInstance && syndicate) {
      // dispatch action to get details about the syndicate
      // These values will be used in other components that might
      // need them.
      const {
        depositERC20ContractAddress,
        profitShareToSyndicateLead,
        profitShareToSyndicateProtocol,
      } = syndicate;

      dispatch(
        setSyndicateDetails(
          syndicateContractInstance,
          depositERC20ContractAddress,
          profitShareToSyndicateLead,
          profitShareToSyndicateProtocol,
          syndicate,
          syndicateAddress
        )
      );
    }
  }, [syndicate, syndicateAddress]);

  // format an account address in the format 0x3f6q9z52…54h2kjh51h5zfa
  const formattedSyndicateAddress = formatAddress(syndicateAddress, 10, 14);

  // show message to the user when address has been copied.
  const updateAddresCopyState = () => {
    setShowCopyState(true);
    setTimeout(() => setShowCopyState(false), 1000);
  };

  // show modal for manager to set allowances for deposits/distributions
  const showManagerSetAllowancesModal = () => {
    setShowManagerSetAllowances(true);
  };
  //hide modal for setting allowances by the manager
  const hideManagerSetAllowances = () => {
    setShowManagerSetAllowances(false);
  };

  // syndicate badges.
  // display relevant badges based on the current state of the syndicate.

  //manager text to display to indicate withdrawals availability
  let managerWithdrawalText = "Withdrawals available.";
  if (
    (openToDeposits && !correctManagerDepositsAllowance) ||
    (distributionsEnabled && !correctManagerDistributionsAllowance)
  ) {
    managerWithdrawalText = "Limited withdrawals available.";
  }
  // set default syndicate state
  let syndicateBadge = (
    <BadgeCard
      {...{
        title: "Status",
        subTitle: "Closed to Deposits",
        text: "Withdrawals not available",
        syndicate,
        lpIsManager,
        openToDeposits,
        showManagerSetAllowancesModal,
        correctManagerDepositsAllowance,
        correctManagerDistributionsAllowance,
        distributionsEnabled,
        icon: (
          <span className="rounded-full bg-yellow-300 flex-shrink-0 mt-2 w-2 h-2 ml-1"></span>
        ),
      }}
    />
  );

  if (openToDeposits && !distributionsEnabled) {
    syndicateBadge = (
      <BadgeCard
        {...{
          title: "Status",
          subTitle: lpIsManager
            ? "Open and accepting deposits"
            : "Open to Deposits.",
          text: lpIsManager ? managerWithdrawalText : "Depositing available.",
          syndicate,
          lpIsManager,
          openToDeposits,
          correctManagerDepositsAllowance,
          correctManagerDistributionsAllowance,
          distributionsEnabled,
          showManagerSetAllowancesModal,
          icon: (
            <span className="rounded-full bg-yellow-300 flex-shrink-0 mt-2 w-2 h-2 ml-1"></span>
          ),
        }}
      />
    );
  } else if (distributionsEnabled) {
    syndicateBadge = (
      <BadgeCard
        {...{
          title: "Status",
          subTitle: "Operating",
          text: lpIsManager ? managerWithdrawalText : "Withdrawals available.",
          syndicate,
          lpIsManager,
          openToDeposits,
          showManagerSetAllowancesModal,
          correctManagerDistributionsAllowance,
          distributionsEnabled,
          icon: (
            <span className="rounded-full bg-green-300 flex-shrink-0 mt-2 w-2 h-2 ml-1"></span>
          ),
        }}
      />
    );
  }

  return (
    <div className="flex flex-col lg:w-3/5 w-full mr-2 lg:mr-6">
      <div className="h-fit-content p-6 md:p-10 rounded-custom bg-gray-6">
        <span className="font-bold px-2 text-gray-dim leading-4 text-sm uppercase">
          Syndicate
        </span>

        <div className="flex justif-start items-center">
          <p className="flex-shrink text-xl sm:text-2xl md:text-lg lg:text-3xl flex-wrap pl-2 break-all">
            {formattedSyndicateAddress}
          </p>
          <CopyToClipboard text={syndicateAddress}>
            <div className="flex items-center ml-4 relative w-10">
              {showCopyState ? (
                <span className="absolute text-xs -top-5">copied</span>
              ) : null}
              <img
                src="/images/copy-clipboard.png"
                className="cursor-pointer h-4"
                onClick={updateAddresCopyState}
              />
            </div>
          </CopyToClipboard>
          <p className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 md:h-16 md:w-16 ml-4 rounded-full ideo-liquidity inline"></p>
        </div>
        <div className="w-fit-content">
          <EtherscanLink contractAddress={syndicateAddress} />
        </div>
        <div className="h-fit-content flex w-full justify-start md:ml-2 mb-12">
          {syndicateBadge}
        </div>

        {/* Syndicate details 
      This component should be shown when we have details about user deposits */}
        <DetailsCard
          {...{
            title: "Details",
            sections: details,
            syndicateDetails: true,
            syndicate,
          }}
          customStyles={"pl-4 pr-2 w-full py-4 pb-8"}
          customInnerWidth="w-full"
        />
        <div className="w-full border-gray-49 border-t pt-4">
          <DetailsCard
            {...{
              title: "Deposits",
              sections: syndicateCummulativeDetails,
              syndicateDetails: true,
              infoIcon: false,
              syndicate,
            }}
            customStyles={"pl-4 pr-2 w-full py-4 pb-8"}
            customInnerWidth="w-full"
          />
        </div>
      </div>
      <div className="flex w-full block my-8 justify-center m-auto p-auto">
        <p className="text-center text-sm flex justify-center flex-wrap	font-extralight">
          <span>{syndicateDetailsFooterText}&nbsp;</span>
          <a
            className="font-normal text-blue-cyan"
            href="#"
            target="_blank"
            rel="noreferrer"
          >
            {syndicateDetailsLinkText}
          </a>
        </p>
      </div>
      <ManagerSetAllowance
        {...{
          maxTotalDeposits,
          openToDeposits,
          depositTokenContract,
          showManagerSetAllowances,
          hideManagerSetAllowances,
          managerDepositsAllowance,
          depositTokenSymbol,
          depositTokenDecimals,
          syndicateContractInstance,
          depositERC20ContractAddress,
        }}
      />
    </div>
  );
};

const mapStateToProps = ({
  web3Reducer,
  syndicateDetailsReducer,
  syndicateInstanceReducer: { syndicateContractInstance },
  tokenDetailsReducer: {
    depositTokenAllowanceDetails,
    distributionTokensAllowanceDetails,
  },
}) => {
  const { web3 } = web3Reducer;
  const { syndicateDetails, syndicateDetailsLoading } = syndicateDetailsReducer;

  return {
    web3,
    syndicateDetails,
    syndicateDetailsLoading,
    syndicateContractInstance,
    depositTokenAllowanceDetails,
    distributionTokensAllowanceDetails,
  };
};

export default connect(mapStateToProps)(SyndicateDetails);

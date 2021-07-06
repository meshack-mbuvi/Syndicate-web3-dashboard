import Footer from "@/components/navigation/footer";
import ManagerSetAllowance from "@/containers/managerActions/setAllowances";
import { RootState } from "@/redux/store";
import { getWeiAmount, isUnlimited, onlyUnique } from "@/utils/conversions";
import { ERC20TokenDetails } from "@/utils/ERC20Methods";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useDispatch, useSelector } from "react-redux";
import { EtherscanLink } from "src/components/syndicates/shared/EtherscanLink";
import { checkAccountAllowance } from "src/helpers/approveAllowance";
import { setSyndicateDetails } from "src/redux/actions/syndicateDetails";
import { setSyndicateDistributionTokens } from "src/redux/actions/syndicateMemberDetails";
import {
  storeDepositTokenAllowance,
  storeDistributionTokensDetails,
} from "src/redux/actions/tokenAllowances";
import ERC20ABI from "src/utils/abi/rinkeby-dai";
// utils
import { formatAddress } from "src/utils/formatAddress";
import { TokenMappings } from "src/utils/tokenMappings";
import { BadgeCard, DetailsCard } from "../shared";
import {
  closeDateToolTip,
  createdDateToolTip,
  depositRangeToolTip,
  depositTokenToolTip,
  expectedAnnualOperatingFeesToolTip,
  profitShareToSyndicateLeadToolTip,
  profitShareToSyndicateProtocolToolTip,
} from "../shared/Constants";

const SyndicateDetails = (props: {
  accountIsManager: boolean;
  children?: React.ReactChild;
  isChildVisible?: boolean;
}) => {
  const { accountIsManager } = props;

  const {
    syndicateMemberDetailsReducer: { syndicateDistributionTokens },
    initializeContractsReducer: { syndicateContracts },
    syndicateDetailsReducer: { syndicateDetails },
    tokenDetailsReducer: {
      depositTokenAllowanceDetails,
      distributionTokensAllowanceDetails,
    },
    web3Reducer: {
      web3: { account, web3 },
    },
    syndicatesReducer: { syndicate },
  } = useSelector((state: RootState) => state);

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
      header: "Deposit Token",
      subText: "",
      tooltip: "",
      isEditable: false,
    },
    {
      header: "Deposit Range",
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
  const [depositTokenSymbol, setDepositTokenSymbol] = useState<string>("");
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
      depositsEnabled,
      distributing,
      depositERC20Address,
      depositMaxTotal,
    } = syndicate;
  }

  // get and set current token details
  useEffect(() => {
    if (depositERC20Address && web3) {
      // set up token contract
      const tokenContract = new web3.eth.Contract(
        ERC20ABI,
        depositERC20Address,
      );

      setDepositTokenContract(tokenContract);

      // set token symbol
      getERC20TokenDetails(depositERC20Address);
    }
  }, [depositERC20Address, web3]);

  // get allowance set on manager's account for the current depositERC20
  const getManagerDepositTokenAllowance = async () => {
    const managerAddress = syndicate?.managerCurrent;
    const managerDepositTokenAllowance = await checkAccountAllowance(
      depositERC20Address,
      managerAddress,
      syndicateContracts.DepositLogicContract._address,
    );

    const managerDepositAllowance = getWeiAmount(
      managerDepositTokenAllowance,
      depositTokenDecimals,
      false,
    );

    setManagerDepositsAllowance(parseFloat(managerDepositAllowance));

    // check if the allowance set by the manager is not enough to cover the total max. deposits.
    // if the current token allowance is less than the syndicate total max. deposits
    // but is greater than zero, we'll consider this insufficient allowance.
    // The manager needs to fix this by adding more deposit token allowance to enable members
    // to withdraw their deposits.
    const sufficientAllowanceSet = +managerDepositAllowance >= +depositMaxTotal;

    // dispatch action to store deposit token allowance details
    dispatch(
      storeDepositTokenAllowance([
        {
          tokenAddress: depositERC20Address,
          tokenAllowance: managerDepositAllowance,
          tokenSymbol: depositTokenSymbol,
          tokenDeposits: depositMaxTotal,
          tokenDecimals: depositTokenDecimals,
          sufficientAllowanceSet,
        },
      ]),
    );
    //reset distribution details
    dispatch(storeDistributionTokensDetails([]));
  };

  // get events where distribution was set.
  // we'll fetch distributionERC20s from here and check if the manager has set the correct
  // allowance for all of them.
  const getManagerDistributionTokensAllowances = async () => {
    const addressOfSyndicate = web3.utils.toChecksumAddress(syndicateAddress);

    // get events where member invested in a syndicate.
    const distributionEvents = await syndicateContracts.DistributionLogicContract.getDistributionEvents(
      "managerSetterDistribution",
      { syndicateAddress: addressOfSyndicate },
    );

    if (distributionEvents.length > 0) {
      // get all distributionERC20 tokens
      let distributionERC20s = [];
      let allowanceAndDistributionDetails = [];
      let syndicateDistributionTokensArray = [];

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
          (key) => key.toLowerCase() == tokenAddress.toLowerCase(),
        );
        if (mappedTokenAddress) {
          var tokenSymbol = TokenMappings[mappedTokenAddress];
        }

        // get allowance set for token by the manager
        const managerAddress = syndicate?.managerCurrent;

        const tokenManagerAllowance = await checkAccountAllowance(
          tokenAddress,
          managerAddress,
          syndicateContracts.DistributionLogicContract._address,
        );
        console.log({ tokenManagerAllowance });

        const tokenAllowance = getWeiAmount(
          tokenManagerAllowance,
          tokenDecimals,
          false,
        );

        // get total distributions for the token
        const totalCurrentDistributions = await syndicateContracts.DistributionLogicContract.getDistributionTotal(
          syndicateAddress,
          tokenAddress,
        );

        const tokenDistributions = getWeiAmount(
          totalCurrentDistributions,
          tokenDecimals,
          false,
        );

        // check if allowance set is enough to cover distributions.
        const sufficientAllowanceSet = +tokenAllowance >= +tokenDistributions;

        allowanceAndDistributionDetails.push({
          tokenAddress,
          tokenAllowance,
          tokenDistributions,
          sufficientAllowanceSet,
          tokenSymbol,
          tokenDecimals,
        });

        syndicateDistributionTokensArray.push({
          tokenAddress,
          tokenSymbol,
          tokenDecimals,
          tokenDistributions,
          selected: false,
        });
      }

      // dispatch token distribution details to the redux store
      dispatch(storeDistributionTokensDetails(allowanceAndDistributionDetails));

      // store distribution token details for the withdrawals page.
      // checking if we already have the value set in the redux store
      // this avoids a scenario where token selected states are reset when
      // the parent component is refreshed.
      if (syndicateDistributionTokens) {
        for (let i = 0; i < syndicateDistributionTokensArray.length; i++) {
          let currentToken = syndicateDistributionTokensArray[i];
          for (let j = 0; j < syndicateDistributionTokens.length; j++) {
            let currentStoredToken = syndicateDistributionTokens[j];
            if (
              currentToken.tokenAddress === currentStoredToken.tokenAddress &&
              currentStoredToken.selected
            ) {
              syndicateDistributionTokensArray[i].selected = true;
            }
          }
        }
      }

      dispatch(
        setSyndicateDistributionTokens(syndicateDistributionTokensArray),
      );

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
    if (accountIsManager) {
      if (depositsEnabled && depositTokenAllowanceDetails.length > 0) {
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
    depositsEnabled,
    distributing,
    accountIsManager,
    account,
    syndicate,
  ]);

  // assess manager deposit and distributions token allowance
  useEffect(() => {
    if (web3 && syndicateContracts) {
      // if the syndicate is still open to deposits, we'll check the deposit token allowance.
      // otherwise, we'll check the distributions token(s) allowance(s)
      if (depositsEnabled) {
        getManagerDepositTokenAllowance();
      } else if (!depositsEnabled && syndicate?.distributing) {
        getManagerDistributionTokensAllowances();
      }
    }
  }, [
    syndicateContracts,
    syndicate,
    depositTokenSymbol,
    depositTokenDecimals,
  ]);

  // set syndicate cummulative values
  useEffect(() => {
    if (syndicate) {
      const { depositTotal, numMembersCurrent } = syndicate;
      setSyndicateCummulativeDetails([
        {
          header: "Total Deposits",
          subText: `${floatedNumberWithCommas(
            depositTotal,
          )} ${depositTokenSymbol} (${numMembersCurrent} ${
            parseInt(numMembersCurrent) === 1 ? "depositor" : "depositors"
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
        depositMaxMember,
        depositMinMember,
      } = syndicate;

      const valueIsUnlimited = isUnlimited(depositMaxMember);

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
          header: "Deposit Token",
          subText: `${depositTokenSymbol}`,
          tooltip: depositTokenToolTip,
        },
        {
          header: "Deposit Range",
          subText: `${floatedNumberWithCommas(depositMinMember)} - ${
            valueIsUnlimited
              ? "Unlimited"
              : floatedNumberWithCommas(depositMaxMember)
          } ${depositTokenSymbol}`,
          tooltip: depositRangeToolTip,
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
  const getERC20TokenDetails = async (depositERC20Address: string) => {
    // getting token symbol doesn't seem to return a valid hex value
    // using this manual mapping for the time being
    const tokenAddress = depositERC20Address;
    const mappedTokenAddress = Object.keys(TokenMappings).find(
      (key) =>
        web3.utils.toChecksumAddress(key) ===
        web3.utils.toChecksumAddress(tokenAddress),
    );

    if (mappedTokenAddress) {
      setDepositTokenSymbol(TokenMappings[mappedTokenAddress]);
    }

    // get token decimals
    const tokenDetails = new ERC20TokenDetails(depositERC20Address);
    const tokenDecimals = await tokenDetails.getTokenDecimals();
    setDepositTokenDecimals(tokenDecimals);
  };

  /**
   * Extracts some syndicate data and dispatches an action to set the details
   */
  useEffect(() => {
    if (syndicateContracts && syndicate) {
      // dispatch action to get details about the syndicate
      // These values will be used in other components that might
      // need them.
      const {
        depositERC20Address,
        profitShareToSyndicateLead,
        profitShareToSyndicateProtocol,
      } = syndicate;

      dispatch(
        setSyndicateDetails(
          syndicateContracts,
          depositERC20Address,
          profitShareToSyndicateLead,
          profitShareToSyndicateProtocol,
          syndicate,
          syndicateAddress,
        ),
      );
    }
  }, [syndicate, syndicateAddress]);

  // format an account address in the format 0x3f6q9z52…54h2kjh51h5zfa
  const formattedSyndicateAddress3XLarge = formatAddress(
    syndicateAddress,
    18,
    18,
  );
  const formattedSyndicateAddressXLarge = formatAddress(
    syndicateAddress,
    14,
    11,
  );
  const formattedSyndicateAddressLarge = formatAddress(syndicateAddress, 6, 7);
  const formattedSyndicateAddressMedium = formatAddress(syndicateAddress, 7, 6);
  const formattedSyndicateAddressSmall = formatAddress(
    syndicateAddress,
    10,
    14,
  );
  const formattedSyndicateAddressMobile = formatAddress(syndicateAddress, 5, 8);

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
    (depositsEnabled && !correctManagerDepositsAllowance) ||
    (distributing && !correctManagerDistributionsAllowance)
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
        accountIsManager,
        depositsEnabled,
        showManagerSetAllowancesModal,
        correctManagerDepositsAllowance,
        correctManagerDistributionsAllowance,
        distributing,
        icon: (
          <span className="rounded-full bg-yellow-300 flex-shrink-0 mt-2 w-2 h-2 ml-1"></span>
        ),
      }}
    />
  );

  if (depositsEnabled && !distributing) {
    syndicateBadge = (
      <BadgeCard
        {...{
          title: "Status",
          subTitle: accountIsManager
            ? "Open and accepting deposits"
            : "Open to Deposits.",
          text: accountIsManager
            ? managerWithdrawalText
            : "Depositing available.",
          syndicate,
          accountIsManager,
          depositsEnabled,
          correctManagerDepositsAllowance,
          correctManagerDistributionsAllowance,
          distributing,
          showManagerSetAllowancesModal,
          icon: (
            <span className="rounded-full bg-yellow-300 flex-shrink-0 mt-2 w-2 h-2 ml-1"></span>
          ),
        }}
      />
    );
  } else if (distributing) {
    syndicateBadge = (
      <BadgeCard
        {...{
          title: "Status",
          subTitle: "Operating",
          text: accountIsManager
            ? managerWithdrawalText
            : "Withdrawals available.",
          syndicate,
          accountIsManager,
          depositsEnabled,
          showManagerSetAllowancesModal,
          correctManagerDistributionsAllowance,
          distributing,
          icon: (
            <span className="rounded-full bg-green-300 flex-shrink-0 mt-2 w-2 h-2 ml-1"></span>
          ),
        }}
      />
    );
  }

  return (
    <div className="flex flex-col w-full sm:mr-2 lg:mr-6">
      <div className="h-fit-content rounded-custom">
        <span className="font-medium text-gray-500 text-sm uppercase tracking-widest pb-3">
          Syndicate
        </span>

        <div className="flex justif-start items-center">
          <div className="flex-shrink text-xl sm:text-2xl lg:text-3xl flex-wrap break-all my-3">
            <div className="mr-4">
              <div className="hidden 3xl:block">
                <span className="text-gray-500">0x</span>
                {formattedSyndicateAddress3XLarge.slice(2)}
              </div>
              <div className="hidden xl:block 3xl:hidden">
                <span className="text-gray-500">0x</span>
                {formattedSyndicateAddressXLarge.slice(2)}
              </div>
              <div className="hidden lg:block xl:hidden">
                <span className="text-gray-500">0x</span>
                {formattedSyndicateAddressLarge.slice(2)}
              </div>
              <div className="hidden md:block lg:hidden">
                <span className="text-gray-500">0x</span>
                {formattedSyndicateAddressMedium.slice(2)}
              </div>
              <div className="hidden sm:block md:hidden">
                <span className="text-gray-500">0x</span>
                {formattedSyndicateAddressSmall.slice(2)}
              </div>
              <div className="sm:hidden">
                <span className="text-gray-500">0x</span>
                {formattedSyndicateAddressMobile.slice(2)}
              </div>
            </div>
          </div>
          <CopyToClipboard text={syndicateAddress}>
            <div className="flex items-center ml-0 relative w-14 h-14 rounded-full cursor-pointer lg:hover:bg-gray-9 lg:active:bg-white lg:active:bg-opacity-20">
              {showCopyState ? (
                <span className="absolute text-xs -top-5">copied</span>
              ) : null}
              <img
                src="/images/copy-clipboard.svg"
                className="cursor-pointer h-4 mx-auto"
                onClick={updateAddresCopyState}
              />
            </div>
          </CopyToClipboard>
          {/* Hide profile circle until we can make colors unique to each syndicate */}
          {/* <p className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 md:h-16 md:w-16 ml-4 rounded-full ideo-liquidity inline"></p> */}
        </div>
        <div className="w-fit-content">
          <EtherscanLink contractAddress={syndicateAddress} />
        </div>
        <div className="h-fit-content flex w-full justify-start mb-8">
          {syndicateBadge}
        </div>

        {/* Syndicate details */}
        {/* details rendered on small devices only. render right column components on the left column in small devices */}
        {props.isChildVisible && props.children}

        {/* This component should be shown when we have details about user deposits */}
        <DetailsCard
          {...{
            title: "Details",
            sections: details,
            syndicateDetails: true,
            syndicate,
          }}
          customStyles={"w-full py-4 pb-8"}
          customInnerWidth="w-full"
        />
        <div className="w-full border-gray-nightrider border-t pt-4 mb-12">
          <DetailsCard
            {...{
              title: "Deposits",
              sections: syndicateCummulativeDetails,
              syndicateDetails: true,
              infoIcon: false,
              syndicate,
            }}
            customStyles={"w-full py-4 pb-8"}
            customInnerWidth="w-full"
          />
        </div>
      </div>
      <Footer />
      <ManagerSetAllowance
        {...{
          depositMaxTotal,
          depositsEnabled,
          depositTokenContract,
          showManagerSetAllowances,
          hideManagerSetAllowances,
          managerDepositsAllowance,
          depositTokenSymbol,
          depositTokenDecimals,
          syndicateContracts,
          depositERC20Address,
        }}
      />
    </div>
  );
};

export default SyndicateDetails;

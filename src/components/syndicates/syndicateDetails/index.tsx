import { SkeletonLoader } from "@/components/skeletonLoader";
import ManagerSetAllowance from "@/containers/managerActions/setAllowances";
import { RootState } from "@/redux/store";
import { getTokenIcon } from "@/TokensList";
import { getWeiAmount, isUnlimited, onlyUnique } from "@/utils/conversions";
import { epochTimeToDateFormat } from "@/utils/dateUtils";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import { getCoinFromContractAddress } from "functions/src/utils/ethereum";
import abi from "human-standard-token-abi";
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
// utils
import { formatAddress } from "src/utils/formatAddress";
import GradientAvatar from "../portfolioAndDiscover/portfolio/GradientAvatar";
import { DetailsCard } from "../shared";
import {
  closeDateToolTip,
  createdDateToolTip,
  depositRangeToolTip,
  depositTokenToolTip,
  distributionShareToSyndicateLeadToolTip,
  distributionShareToSyndicateProtocolToolTip,
  expectedAnnualOperatingFeesToolTip,
  totalDepositsToolTip,
} from "../shared/Constants";
import PermissionCard from "../shared/PermissionsCard";
import { ProgressIndicator } from "../shared/progressIndicator";

// we should have an isChildVisible prop here of type boolean
const SyndicateDetails = (props: {
  accountIsManager: boolean;
  children?: React.ReactChild;
}): JSX.Element => {
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
  const [details, setDetails] = useState<
    Array<{
      header: string;
      content: any;
      tooltip: string;
      isEditable?: boolean;
    }>
  >([]);

  const [showMore, setShowMore] = useState(false);

  // state to handle copying of the syndicate address to clipboard.
  const [showAddressCopyState, setShowAddressCopyState] =
    useState<boolean>(false);
  const [showDepositLinkCopyState, setShowDepositLinkCopyState] =
    useState<boolean>(false);

  // state to handle details about the current deposit ERC20 token
  const [depositTokenContract, setDepositTokenContract] = useState<any>("");

  // states to show general syndicate details
  const [syndicateCumulativeDetails, setSyndicateCumulativeDetails] = useState([
    {
      header: "Total Deposits",
      subText: "",
    },
  ]);

  // states to handle manager allowances
  // states to handle manager allowances
  const [managerDepositsAllowance, setManagerDepositsAllowance] =
    useState<number>(0);
  const [correctManagerDepositsAllowance, setCorrectManagerDepositsAllowance] =
    useState<boolean>(false);
  const [
    correctManagerDistributionsAllowance,
    setCorrectManagerDistributionsAllowance,
  ] = useState<boolean>(false);
  const [showManagerSetAllowances, setShowManagerSetAllowances] =
    useState<boolean>(false);

  // get syndicate address from the url
  const { syndicateAddress } = router.query;

  const tokenDecimals = syndicate?.tokenDecimals;
  const depositTotalMax = syndicate?.depositTotalMax;
  const depositERC20TokenSymbol = syndicate?.depositERC20TokenSymbol;
  const depositERC20Address = syndicate?.depositERC20Address;
  const distributing = syndicate?.distributing;
  const depositsEnabled = syndicate?.depositsEnabled;

  // get and set current token details
  useEffect(() => {
    if (depositERC20Address && web3) {
      // set up token contract
      const tokenContract = new web3.eth.Contract(abi, depositERC20Address);

      setDepositTokenContract(tokenContract);
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
      tokenDecimals,
      false,
    );

    setManagerDepositsAllowance(parseFloat(managerDepositAllowance));

    // check if the allowance set by the manager is not enough to cover the total max. deposits.
    // if the current token allowance is less than the syndicate total max. deposits
    // but is greater than zero, we'll consider this insufficient allowance.
    // The manager needs to fix this by adding more deposit token allowance to enable members
    // to withdraw their deposits.
    const sufficientAllowanceSet = +managerDepositAllowance >= +depositTotalMax;

    // dispatch action to store deposit token allowance details
    dispatch(
      storeDepositTokenAllowance([
        {
          tokenAddress: depositERC20Address,
          tokenAllowance: managerDepositAllowance,
          tokenSymbol: depositERC20TokenSymbol,
          tokenDeposits: depositTotalMax,
          tokenDecimals,
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
    const distributionEvents =
      await syndicateContracts.DistributionLogicContract.getDistributionEvents(
        "DistributionAdded",
        { syndicateAddress: addressOfSyndicate },
      );

    if (distributionEvents.length > 0) {
      // get all distributionERC20 tokens
      const distributionERC20s = [];
      const allowanceAndDistributionDetails = [];
      const syndicateDistributionTokensArray = [];

      for (let i = 0; i < distributionEvents.length; i++) {
        const { distributionERC20Address } = distributionEvents[i].returnValues;
        distributionERC20s.push(distributionERC20Address);
      }
      const uniqueERC20s = distributionERC20s.filter(onlyUnique);

      // set up token contract to check manager allowance for the ERC20
      for (let i = 0; i < uniqueERC20s.length; i++) {
        const tokenAddress = uniqueERC20s[i];

        const { decimals, symbol } = await getCoinFromContractAddress(
          tokenAddress,
        );

        // get token properties
        const tokenSymbol = symbol;
        const tokenDecimals = decimals ? decimals : "18";

        // get allowance set for token by the manager
        const managerAddress = syndicate?.managerCurrent;

        const tokenManagerAllowance = await checkAccountAllowance(
          tokenAddress,
          managerAddress,
          syndicateContracts.DistributionLogicContract._address,
        );

        /**
         * To find whether sufficient allowance is set, we need to compare total
         * unclaimed distributions against current allowance for a given token
         * address.
         *
         * Note: To get unclaimed distributions, we get the difference between
         * total current distributions and total claimed distributions.
         */
        const tokenAllowance = getWeiAmount(
          tokenManagerAllowance,
          tokenDecimals,
          false,
        );

        // get total distributions for the token
        const totalCurrentDistributions =
          await syndicateContracts.DistributionLogicContract.getDistributionTotal(
            syndicateAddress,
            tokenAddress,
          );

        // We should get also get total claimed distributions
        const totalClaimedDistributions =
          await syndicateContracts.DistributionLogicContract.getDistributionClaimedTotal(
            syndicateAddress,
            tokenAddress,
          );

        const tokenDistributions = getWeiAmount(
          totalCurrentDistributions,
          tokenDecimals,
          false,
        );

        const claimedDistributions = getWeiAmount(
          totalClaimedDistributions,
          tokenDecimals,
          false,
        );

        // Find the difference between total current and claimed distributions
        const totalUnclaimedDistributions =
          +tokenDistributions - +claimedDistributions;

        // check if allowance set is enough to cover distributions.
        const sufficientAllowanceSet =
          +tokenAllowance >= +totalUnclaimedDistributions;

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
          tokenIcon: getTokenIcon(tokenSymbol), // set Token Icon
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
          const currentToken = syndicateDistributionTokensArray[i];
          for (let j = 0; j < syndicateDistributionTokens.length; j++) {
            const currentStoredToken = syndicateDistributionTokens[j];
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
          const { sufficientAllowanceSet } =
            distributionTokensAllowanceDetails[i];
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
  }, [syndicateContracts, syndicate, depositERC20TokenSymbol, tokenDecimals]);

  // set syndicate cumulative values
  useEffect(() => {
    if (syndicate) {
      const { depositTotal, numMembersCurrent } = syndicate;
      setSyndicateCumulativeDetails([
        {
          header: "Total Deposits",
          subText: `${floatedNumberWithCommas(
            depositTotal,
          )} ${depositERC20TokenSymbol} (${numMembersCurrent} ${
            parseInt(numMembersCurrent) === 1 ? "depositor" : "depositors"
          })`,
        },
      ]);
    }
  }, [syndicate, syndicateDetails]);

  useEffect(() => {
    if (syndicate) {
      const {
        distributionShareToSyndicateProtocol,
        managerDistributionShareBasisPoints,
        managerManagementFeeBasisPoints,
        depositMemberMax,
        depositMemberMin,
        depositTotal,
        depositTotalMax,
        numMembersCurrent,
        numMembersMax,
        epochTime,
        depositERC20TokenSymbol,
      } = syndicate;

      const { closeDate, createdDate } = epochTime;

      const valueIsUnlimited = isUnlimited(depositMemberMax);

      setDetails([
        {
          header: "Total Deposits (Max)",
          content: (
            <div>
              {floatedNumberWithCommas(depositTotal)}&nbsp;
              {depositERC20TokenSymbol}&nbsp;
              <span className="text-gray-500">
                (
                {isUnlimited(depositTotalMax)
                  ? "Unlimited"
                  : floatedNumberWithCommas(depositTotalMax)}
                )
              </span>
            </div>
          ),
          tooltip: totalDepositsToolTip,
        },
        {
          header: "Deposit Range",
          content: `${floatedNumberWithCommas(depositMemberMin)} - ${
            isUnlimited(depositMemberMax)
              ? "Unlimited"
              : floatedNumberWithCommas(depositMemberMax)
          } ${depositERC20TokenSymbol}`,
          tooltip: depositRangeToolTip,
        },
        {
          header: "Total Members (Max)",
          content: (
            <div>
              {floatedNumberWithCommas(numMembersCurrent)}&nbsp;
              <span className="text-gray-500">
                (
                {isUnlimited(numMembersMax)
                  ? "Unlimited"
                  : floatedNumberWithCommas(numMembersMax)}
                )
              </span>
            </div>
          ),
          tooltip: depositTokenToolTip,
        },
        {
          header: "Annual Operating Fees",
          content: `${managerManagementFeeBasisPoints}%`,
          tooltip: expectedAnnualOperatingFeesToolTip,
        },
        {
          header: "Lead Distribution Share",
          content: `${managerDistributionShareBasisPoints}%`,
          tooltip: distributionShareToSyndicateLeadToolTip,
        },
        {
          header: "Protocol Distribution Share",
          content: `${distributionShareToSyndicateProtocol}%`,
          tooltip: distributionShareToSyndicateProtocolToolTip,
        },
        {
          header: "Creation Date",
          content: `${epochTimeToDateFormat(
            new Date(parseInt(createdDate) * 1000),
            "LLL dd yyyy, p zzz",
          )}`,
          tooltip: createdDateToolTip,
        },
        {
          header: "Close Date",
          content: `${epochTimeToDateFormat(
            new Date(parseInt(closeDate) * 1000),
            "LLL dd yyyy, p zzz",
          )}`,
          tooltip: closeDateToolTip,
        },
      ]);
    }
  }, [syndicate, syndicateDetails]);

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
        managerDistributionShareBasisPoints,
        distributionShareToSyndicateProtocol,
      } = syndicate;

      dispatch(
        setSyndicateDetails(
          syndicateContracts,
          depositERC20Address,
          managerDistributionShareBasisPoints,
          distributionShareToSyndicateProtocol,
          syndicate,
          syndicateAddress,
        ),
      );
    }
  }, [syndicate, syndicateAddress, depositERC20TokenSymbol, tokenDecimals]);

  // format an account address in the format 0x3f6q9z52…54h2kjh51h5zfa

  const formattedSyndicateAddress = formatAddress(syndicateAddress, 6, 4);

  // show message to the user when address has been copied.
  const updateAddressCopyState = () => {
    setShowAddressCopyState(true);
    setTimeout(() => setShowAddressCopyState(false), 1000);
  };

  const updateDepositLinkCopyState = () => {
    setShowDepositLinkCopyState(true);
    setTimeout(() => setShowDepositLinkCopyState(false), 1000);
  };

  // show modal for manager to set allowances for deposits/distributions
  const showManagerSetAllowancesModal = () => {
    setShowManagerSetAllowances(true);
  };
  //hide modal for setting allowances by the manager
  const hideManagerSetAllowances = () => {
    setShowManagerSetAllowances(false);
  };

  // Handle syndicate progress bar
  const depositTotal = syndicate?.depositTotal;
  let depositsMaxIsUnlimited = false;

  // checking if depositsMax is unlimited.
  depositsMaxIsUnlimited = isUnlimited(depositTotalMax);

  // set syndicate deposit link
  const [syndicateDepositLink, setSyndicateDepositLink] = useState<string>("");
  useEffect(() => {
    setSyndicateDepositLink(
      `${window.location.origin}/syndicates/${syndicateAddress}/deposit`,
    );
  }, [syndicateAddress]);

  const showSkeletonLoader = !syndicate;

  return (
    <div className="flex flex-col w-full sm:mr-2 lg:mr-6 relative">
      <div className="h-fit-content rounded-custom">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex justify-start items-center">
              <div className="mr-6">
                {syndicateAddress && (
                  <GradientAvatar
                    syndicateAddress={syndicateAddress}
                    size="w-16 h-16"
                  />
                )}
              </div>
              <div className="flex-shrink main-title flex-wrap break-all">
                <div className="mr-4">
                  <div className="">
                    <span className="text-gray-500">0x</span>
                    {formattedSyndicateAddress.slice(2)}
                  </div>
                </div>
              </div>
              <CopyToClipboard text={syndicateAddress}>
                <button
                  className="flex items-center ml-0 relative w-8 h-8 rounded-full cursor-pointer lg:hover:bg-gray-9 lg:active:bg-white lg:active:bg-opacity-20"
                  onClick={updateAddressCopyState}
                  onKeyDown={updateAddressCopyState}
                >
                  {showAddressCopyState ? (
                    <span className="absolute text-xs -top-5">copied</span>
                  ) : null}
                  <input
                    type="image"
                    src="/images/copy-clipboard.svg"
                    className="cursor-pointer h-4 mx-auto"
                    alt=""
                  />
                </button>
              </CopyToClipboard>
              <CopyToClipboard text={syndicateDepositLink}>
                <button
                  className="flex items-center ml-0 relative w-8 h-8 rounded-full cursor-pointer lg:hover:bg-gray-9 lg:active:bg-white lg:active:bg-opacity-20"
                  onClick={updateDepositLinkCopyState}
                  onKeyDown={updateDepositLinkCopyState}
                >
                  {showDepositLinkCopyState ? (
                    <span className="absolute text-xs -top-5">copied</span>
                  ) : null}
                  <input
                    type="image"
                    src="/images/copy-link.svg"
                    className="cursor-pointer h-4 mx-auto"
                    alt=""
                  />
                </button>
              </CopyToClipboard>
              <EtherscanLink
                customStyles="w-8 h-8 rounded-full lg:hover:bg-gray-9 lg:active:bg-white lg:active:bg-opacity-20"
                iconOnly
                etherscanInfo={syndicateAddress}
              />
              {/* Hide profile circle until we can make colors unique to each syndicate */}
              {/* <p className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 md:h-16 md:w-16 ml-4 rounded-full ideo-liquidity inline"></p> */}
            </div>
          </div>
        </div>

        {!depositsMaxIsUnlimited ? (
          <div className="h-fit-content flex w-full justify-start mt-16">
            <ProgressIndicator
              depositTotal={depositTotal}
              depositTotalMax={depositTotalMax}
              depositERC20TokenSymbol={depositERC20TokenSymbol}
            />
          </div>
        ) : null}

        {/* Syndicate details */}
        {/* details rendered on small devices only. render right column components on the left column in small devices */}
        {props.children}

        {/* This component should be shown when we have details about user deposits */}
        <div
          className="overflow-hidden mt-8"
          style={!showMore ? { height: "200px" } : null}
        >
          <DetailsCard
            {...{
              title: "Details",
              sections: details,
              syndicateDetails: true,
              syndicate,
            }}
            customStyles={"w-full py-4 pb-4"}
            customInnerWidth="w-full grid grid-cols-3 gap-4"
          />
          <PermissionCard
            allowlistEnabled={syndicate?.allowlistEnabled}
            modifiable={syndicate?.modifiable}
            tranferable={syndicate?.tranferable}
            className="pb-8"
            showSkeletonLoader={showSkeletonLoader}
          />
        </div>
        {/* Gradient overlay */}
        {!showMore ? (
          <div
            className="show-more-overlay w-full bottom-6 absolute"
            style={{ height: "100px" }}
          />
        ) : null}
        <button onClick={() => setShowMore(!showMore)} className="mt-5">
          {showSkeletonLoader ? (
            <SkeletonLoader height="4" width="full" borderRadius="rounded-md" />
          ) : (
            <div className="flex h-4 items-center text-base">
              <img
                src={
                  !showMore ? "/images/show-eye.svg" : "/images/hide-eye.svg"
                }
                alt="transferable"
                className="h-4 w-4"
              />
              <p className="ml-2 text-blue">
                {!showMore ? "Show more details" : "Show less details"}
              </p>
            </div>
          )}
        </button>
      </div>
      <ManagerSetAllowance
        {...{
          depositTotalMax,
          depositsEnabled,
          depositTokenContract,
          showManagerSetAllowances,
          hideManagerSetAllowances,
          managerDepositsAllowance,
          depositERC20TokenSymbol,
          tokenDecimals,
          syndicateContracts,
          depositERC20Address,
        }}
      />
    </div>
  );
};

export default SyndicateDetails;

import { SkeletonLoader } from "@/components/skeletonLoader";
import ManagerSetAllowance from "@/containers/managerActions/setAllowances";
import { RootState } from "@/redux/store";
import { getTokenIcon } from "@/TokensList";
import { getWeiAmount, isUnlimited, onlyUnique } from "@/utils/conversions";
import { epochTimeToDateFormat, getCountDownDays } from "@/utils/dateUtils";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import { getCoinFromContractAddress } from "functions/src/utils/ethereum";
import abi from "human-standard-token-abi";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useDispatch, useSelector } from "react-redux";
import { EtherscanLink } from "src/components/syndicates/shared/EtherscanLink";
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
const moment = require("moment");

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

  // Handle syndicate progress bar
  const depositTotal = syndicate?.depositTotal;
  let depositsMaxIsUnlimited = false;

  // checking if depositsMax is unlimited.
  depositsMaxIsUnlimited = isUnlimited(depositTotalMax);

  // get and set current token details
  useEffect(() => {
    if (depositERC20Address && web3) {
      // set up token contract
      const tokenContract = new web3.eth.Contract(abi, depositERC20Address);

      setDepositTokenContract(tokenContract);
    }
  }, [depositERC20Address, web3]);

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
        ...(syndicate?.open
          ? depositsMaxIsUnlimited
            ? [
                {
                  header: "Created on",
                  content: `${epochTimeToDateFormat(
                    new Date(parseInt(createdDate) * 1000),
                    "LLL dd yyyy, p zzz",
                  )}`,
                  tooltip: createdDateToolTip,
                },
              ]
            : [
                {
                  header: "Deposit Range",
                  content: `${floatedNumberWithCommas(depositMemberMin)} - ${
                    isUnlimited(depositMemberMax)
                      ? "Unlimited"
                      : floatedNumberWithCommas(depositMemberMax)
                  } ${depositERC20TokenSymbol}`,
                  tooltip: depositRangeToolTip,
                },
              ]
          : [
              {
                header: "Created on",
                content: `${epochTimeToDateFormat(
                  new Date(parseInt(createdDate) * 1000),
                  "LLL dd yyyy, p zzz",
                )}`,
                tooltip: createdDateToolTip,
              },
            ]),
        ...(syndicate?.open
          ? depositsMaxIsUnlimited
            ? [
                {
                  header: "Deposit Range",
                  content: `${floatedNumberWithCommas(depositMemberMin)} - ${
                    isUnlimited(depositMemberMax)
                      ? "Unlimited"
                      : floatedNumberWithCommas(depositMemberMax)
                  } ${depositERC20TokenSymbol}`,
                  tooltip: depositRangeToolTip,
                },
              ]
            : [
                {
                  header: `Members ${
                    !isUnlimited(numMembersMax) ? "(Max)" : ""
                  }`,
                  content: (
                    <div>
                      {floatedNumberWithCommas(numMembersCurrent)}&nbsp;
                      <span className="text-gray-500">
                        (
                        {isUnlimited(numMembersMax)
                          ? ""
                          : floatedNumberWithCommas(numMembersMax)}
                        )
                      </span>
                    </div>
                  ),
                  tooltip: depositTokenToolTip,
                },
              ]
          : [
              {
                header: "Closed on",
                content: `${epochTimeToDateFormat(
                  new Date(parseInt(closeDate) * 1000),
                  "LLL dd yyyy, p zzz",
                )}`,
                tooltip: closeDateToolTip,
              },
            ]),
        ...(syndicate?.open
          ? depositsMaxIsUnlimited
            ? [
                {
                  header: "",
                  content: null,
                  tooltip: null,
                },
              ]
            : [
                {
                  header: "",
                  content: null,
                  tooltip: null,
                },
              ]
          : [
              {
                header: "Deposit Range",
                content: `${floatedNumberWithCommas(depositMemberMin)} - ${
                  isUnlimited(depositMemberMax)
                    ? "Unlimited"
                    : floatedNumberWithCommas(depositMemberMax)
                } ${depositERC20TokenSymbol}`,
                tooltip: depositRangeToolTip,
              },
            ]),
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

  // set syndicate deposit link
  const [syndicateDepositLink, setSyndicateDepositLink] = useState<string>("");
  useEffect(() => {
    setSyndicateDepositLink(
      `${window.location.origin}/syndicates/${syndicateAddress}/deposit`,
    );
  }, [syndicateAddress]);

  const showSkeletonLoader = !syndicate;

  return (
    <div className="flex flex-col relative">
      <div className="h-fit-content rounded-custom">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex justify-start items-center">
              <div className="mr-6">
                {syndicateAddress && (
                  <GradientAvatar
                    syndicateAddress={syndicateAddress}
                    size="xl:w-20 lg:w-16 xl:h-20 lg:h-16 w-10 h-10"
                  />
                )}
              </div>
              <div className="flex-shrink main-title flex-wrap break-all xl:mr-10 lg:mr-6 mr-3">
                <div>
                  <div className="1.5xl:text-4.5xl lg:text-2xl md:text-xl text-lg font-normal">
                    <span className="text-gray-500">0x</span>
                    {formattedSyndicateAddress.slice(2)}
                  </div>
                </div>
              </div>
              <CopyToClipboard text={syndicateAddress}>
                <button
                  className="flex items-center relative w-8 h-8 xl:mr-6 mr-4 rounded-full cursor-pointer lg:hover:bg-gray-9 lg:active:bg-white lg:active:bg-opacity-20"
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
                  className="flex items-center relative w-8 h-8 xl:mr-6 mr-4 rounded-full cursor-pointer lg:hover:bg-gray-9 lg:active:bg-white lg:active:bg-opacity-20"
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

        {!depositsMaxIsUnlimited && syndicate?.open ? (
          <div className="h-fit-content flex w-full justify-start mt-16">
            <ProgressIndicator
              depositTotal={depositTotal}
              depositTotalMax={depositTotalMax}
              depositERC20TokenSymbol={depositERC20TokenSymbol}
              openDate={syndicate?.epochTime.createdDate}
              closeDate={syndicate?.epochTime.closeDate}
            />
          </div>
        ) : (
          <div className="pt-20 w-full pb-8 border-b-2 border-gray-9">
            <div
              className={`grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-2 xl:gap-4 gap-2 gap-y-8 justify-between`}
            >
              <div className={`text-left ${syndicate?.open ? "" : "mr-24"} `}>
                <p className="text-base text-gray-500 leading-loose font-light">
                  Total Deposits
                </p>
                <div className="flex">
                  <p className="text-white leading-loose xl:text-2xl lg:text-xl text-base">
                    {floatedNumberWithCommas(depositTotal)}&nbsp;
                    {depositERC20TokenSymbol}
                  </p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-base text-gray-500 leading-loose font-light">
                  Members{" "}
                  {!isUnlimited(syndicate?.numMembersMax) ? "(max)" : ""}
                </p>
                <div className="text-2xl">
                  {floatedNumberWithCommas(syndicate?.numMembersCurrent)}&nbsp;
                  {syndicate?.open && !isUnlimited(syndicate?.numMembersMax) ? (
                    <span className="text-gray-500">
                      ({floatedNumberWithCommas(syndicate?.numMembersMax)})
                    </span>
                  ) : null}
                </div>
              </div>
              {syndicate?.open ? (
                <div className="text-left">
                  <p className="text-base text-gray-500 leading-loose font-light">
                    Closing in
                  </p>
                  <p className="xl:text-2xl text-xl text-white leading-loose">
                    {getCountDownDays(syndicate?.epochTime?.closeDate)}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* This component should be shown when we have details about user deposits */}
        <div
          className="overflow-hidden mt-6 relative"
          style={!showMore ? { height: "200px" } : null}
        >
          <DetailsCard
            {...{
              title: "Details",
              sections: details,
              syndicateDetails: true,
              syndicate,
            }}
            customStyles={"w-full pt-4"}
            customInnerWidth="w-full grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-2 xl:gap-4 gap-2 gap-y-8"
          />
          <PermissionCard
            allowlistEnabled={syndicate?.allowlistEnabled}
            modifiable={syndicate?.modifiable}
            transferable={syndicate?.tranferable}
            className="pb-8 mt-6"
            showSkeletonLoader={showSkeletonLoader}
          />
        </div>
        {/* Gradient overlay */}
        {!showMore ? (
          <div
            className="show-more-overlay w-full bottom-6 absolute"
            style={{ height: "140px" }}
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
      {/* Syndicate details */}
      {/* details rendered on small devices only. render right column components on the left column in small devices */}
      {props.children}
    </div>
  );
};

export default SyndicateDetails;

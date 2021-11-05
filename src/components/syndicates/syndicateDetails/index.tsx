import { SkeletonLoader } from "@/components/skeletonLoader";
import { RootState } from "@/redux/store";
import { isUnlimited } from "@/utils/conversions";
import { epochTimeToDateFormat, getCountDownDays } from "@/utils/dateUtils";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import abi from "human-standard-token-abi";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useDispatch, useSelector } from "react-redux";
import { EtherscanLink } from "src/components/syndicates/shared/EtherscanLink";
import { setSyndicateDetails } from "src/redux/actions/syndicateDetails";
// utils
import { formatAddress } from "src/utils/formatAddress";
import GradientAvatar from "../portfolioAndDiscover/portfolio/GradientAvatar";
import { DetailsCard } from "../shared";
import { closeDateToolTip, createdDateToolTip } from "../shared/Constants";
import { ProgressIndicator } from "../shared/progressIndicator";

// we should have an isChildVisible prop here of type boolean
const SyndicateDetails: FC<{ accountIsManager: boolean }> = (props) => {
  const {
    initializeContractsReducer: { syndicateContracts },
    erc20TokenSliceReducer: { erc20Token },
    web3Reducer: {
      web3: { web3 },
    },
    syndicatesReducer: { syndicate },
  } = useSelector((state: RootState) => state);

  const {
    loading,
    tokenDecimals: decimals,
    maxTotalDeposits,
    depositToken,
    totalDeposits,
    memberCount,
    depositsEnabled,
    startTime,
    endTime,
    maxMemberCount,
    name,
    symbol,
  } = erc20Token;

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

  // state to handle copying of the syndicate address to clipboard.
  const [showAddressCopyState, setShowAddressCopyState] =
    useState<boolean>(false);
  const [showDepositLinkCopyState, setShowDepositLinkCopyState] =
    useState<boolean>(false);
  const [showMore, setShowMore] = useState(false);

  // state to handle details about the current deposit ERC20 token
  const [, setDepositTokenContract] = useState<any>("");

  // states to show general syndicate details
  const [, setSyndicateCumulativeDetails] = useState([
    {
      header: "Deposits",
      subText: "",
    },
  ]);

  // get syndicate address from the url
  const { syndicateAddress } = router.query;

  const tokenDecimals = decimals;
  const depositERC20TokenSymbol = "USDC"; // TOD: Update to support multiple tokens
  const depositERC20Address = depositToken;

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
    if (erc20Token) {
      const { totalDeposits, memberCount } = erc20Token;
      setSyndicateCumulativeDetails([
        {
          header: "Deposits",
          subText: `${floatedNumberWithCommas(
            totalDeposits,
          )} ${depositERC20TokenSymbol} (${memberCount} ${
            memberCount === 1 ? "depositor" : "depositors"
          })`,
        },
      ]);
    }
  }, [erc20Token]);

  useEffect(() => {
    if (erc20Token) {
      setDetails([
        ...(depositsEnabled
          ? [
              {
                header: "Created on",
                content: `${epochTimeToDateFormat(
                  new Date(startTime),
                  "LLL dd, yyyy",
                )}`,
                tooltip: createdDateToolTip,
              },
            ]
          : [
              {
                header: "Closed on",
                content: `${epochTimeToDateFormat(
                  new Date(endTime),
                  "LLL dd, yyyy",
                )}`,
                tooltip: createdDateToolTip,
              },
            ]),
        ...(depositsEnabled
          ? [
              {
                header: `Members`,
                content: <div>{memberCount}</div>,
                tooltip: `This is the amount of unique member addresses who have deposited funds into this syndicate. ${
                  !isUnlimited(maxMemberCount)
                    ? `A maximum of ${maxMemberCount} members are allowed for this syndicate.`
                    : ""
                }`,
              },
              {
                header: "Closing in",
                content: getCountDownDays(endTime.toString()),
                tooltip: closeDateToolTip,
              },
            ]
          : [
              {
                header: "Closed on",
                content: `${epochTimeToDateFormat(
                  new Date(startTime),
                  "LLL dd, yyyy",
                )}`,
                tooltip: closeDateToolTip,
              },
            ]),
      ]);
    }
  }, [JSON.stringify(erc20Token)]);

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
  //hide modal for setting allowances by the manager

  // set syndicate deposit link
  const [syndicateDepositLink, setSyndicateDepositLink] = useState<string>("");
  useEffect(() => {
    setSyndicateDepositLink(
      `${window.location.origin}/syndicates/${syndicateAddress}/deposit`,
    );
  }, [syndicateAddress]);

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

              <div className="flex-shrink main-title flex-wrap break-normal lg:mr-6 sm:mr-3 mr-4 space-y-1">
                <div className="flex flex-wrap space-y-1">
                  <div className="mr-4 xl:text-4.5xl lg:text-4xl md:text-xl sm:text-4xl text-lg font-normal line-clamp-2">
                    {name}
                  </div>
                  <div className="flex flex-wrap">
                    <div className="rounded-full py-1 px-3 text-sm border border-gray-24 flex items-center justify-center">
                      {symbol}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row relative">
                  <div className="text-sm mr-4">
                    <span className="text-gray-lightManatee">0x</span>
                    {formattedSyndicateAddress.slice(2)}
                  </div>
                  <CopyToClipboard text={syndicateAddress as string}>
                    <button
                      className="flex items-center relative w-4 h-4 mr-2 sm:mr-4 rounded-full cursor-pointer lg:hover:bg-gray-9 lg:active:bg-white lg:active:bg-opacity-20"
                      onClick={updateAddressCopyState}
                      onKeyDown={updateAddressCopyState}
                    >
                      {showAddressCopyState ? (
                        <span className="absolute text-xs -bottom-5">
                          copied
                        </span>
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
                      className="flex items-center relative w-4 h-4 mr-2 sm:mr-2 rounded-full cursor-pointer lg:hover:bg-gray-9 lg:active:bg-white lg:active:bg-opacity-20"
                      onClick={updateDepositLinkCopyState}
                      onKeyDown={updateDepositLinkCopyState}
                    >
                      {showDepositLinkCopyState ? (
                        <span className="absolute text-xs -bottom-5">
                          copied
                        </span>
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
                    customStyles="w-4 h-4 rounded-full lg:hover:bg-gray-9 lg:active:bg-white lg:active:bg-opacity-20"
                    iconOnly
                    etherscanInfo={syndicateAddress}
                  />
                </div>
              </div>
              {/* Hide profile circle until we can make colors unique to each syndicate */}
              {/* <p className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 md:h-16 md:w-16 ml-4 rounded-full ideo-liquidity inline"></p> */}
            </div>
          </div>
        </div>

        {depositsEnabled ? (
          <div className="h-fit-content flex w-full justify-start mt-16">
            <ProgressIndicator
              totalDeposits={totalDeposits}
              depositTotalMax={maxTotalDeposits.toString()}
              depositERC20TokenSymbol={depositERC20TokenSymbol}
              openDate={startTime.toString()}
              closeDate={endTime.toString()}
              loading={loading}
            />
          </div>
        ) : (
          <div className="pt-20 w-full pb-8 border-b-2 border-gray-9">
            {loading ? (
              <SkeletonLoader
                height="9"
                width="full"
                borderRadius="rounded-md"
              />
            ) : (
              <div
                className={`grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-2
              xl:gap-4 gap-2 gap-y-8 justify-between`}
              >
                <div className="text-left">
                  <p className="text-base text-gray-500 leading-loose font-light">
                    Deposits
                  </p>
                  <div className="flex">
                    <p
                      className="text-white leading-loose xl:text-2xl
                  lg:text-xl text-base"
                    >
                      {totalDeposits}&nbsp;
                      {depositERC20TokenSymbol}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-base text-gray-500 leading-loose font-light">
                    Members
                  </p>
                  <div className="xl:text-2xl lg:text-xl text-base">
                    {memberCount}&nbsp;
                    {erc20Token.depositsEnabled &&
                    !(erc20Token.memberCount === maxMemberCount) ? (
                      <span className="text-gray-500">({maxMemberCount})</span>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* This component should be shown when we have details about user deposits */}
        <div
          className="overflow-hidden mt-6 relative"
          style={!showMore ? { height: "200px" } : null}
        >
          {loading ? (
            <SkeletonLoader height="9" width="full" borderRadius="rounded-md" />
          ) : (
            <DetailsCard
              {...{
                title: "Details",
                sections: details,
                syndicateDetails: true,
                syndicate,
              }}
              customStyles={"w-full pt-4"}
              customInnerWidth="w-full grid xl:grid-cols-3 lg:grid-cols-3
            grid-cols-3 xl:gap-8 gap-6s gap-y-8"
            />
          )}

          {/* <PermissionCard
            allowlistEnabled={syndicate?.allowlistEnabled}
            modifiable={syndicate?.modifiable}
            transferable={syndicate?.tranferable}
            className="pb-8 mt-6"
            showSkeletonLoader={loading}
          /> */}
        </div>
        {/* Gradient overlay */}
        {!showMore ? (
          <div
            className="show-more-overlay w-full bottom-6 absolute"
            style={{ height: "140px" }}
          />
        ) : null}
        <button onClick={() => setShowMore(!showMore)} className="mt-5">
          {loading ? (
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

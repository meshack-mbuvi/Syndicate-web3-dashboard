import { SkeletonLoader } from "@/components/skeletonLoader";
import { RootState } from "@/redux/store";
import { isUnlimited } from "@/utils/conversions";
import { epochTimeToDateFormat, getCountDownDays } from "@/utils/dateUtils";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import abi from "human-standard-token-abi";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSelector } from "react-redux";
import { EtherscanLink } from "src/components/syndicates/shared/EtherscanLink";
// utils
import { formatAddress } from "src/utils/formatAddress";
import GradientAvatar from "../portfolioAndDiscover/portfolio/GradientAvatar";
import { DetailsCard } from "../shared";
import { ProgressIndicator } from "../shared/progressIndicator";
import { CopyToClipboardIcon } from "@/components/iconWrappers";
import ReactTooltip from "react-tooltip";

interface ClubDetails {
  header: string;
  content: React.ReactNode;
  tooltip?: string;
  isEditable?: boolean;
}

// we should have an isChildVisible prop here of type boolean
const SyndicateDetails: FC<{ accountIsManager: boolean }> = (props) => {
  const {
    erc20TokenSliceReducer: { erc20Token },
    web3Reducer: {
      web3: { web3 },
    },
    syndicatesReducer: { syndicate },
  } = useSelector((state: RootState) => state);

  const {
    loading,
    maxTotalDeposits,
    depositToken,
    totalDeposits,
    memberCount,
    startTime,
    endTime,
    maxMemberCount,
    name,
    symbol,
    maxTotalSupply,
    accountClubTokens,
  } = erc20Token;
  const depositsEnabled = true;
  const router = useRouter();
  const [details, setDetails] = useState<ClubDetails[]>([]);

  // state to handle copying of the syndicate address to clipboard.
  const [showAddressCopyState, setShowAddressCopyState] =
    useState<boolean>(false);

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
  const { clubAddress } = router.query;

  const depositERC20TokenSymbol = "USDC"; // TODO: Update to support multiple tokens
  const depositERC20Address = depositToken;
  const [showActionIcons, setShowActionIcons] = useState<boolean>(false);

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
                header: "Club token supply",
                content: (
                  <span>
                    {floatedNumberWithCommas(maxTotalSupply)} {symbol}
                  </span>
                ),
                tooltip: "",
              },
              {
                header: "Club tokens minted",
                content: (
                  <span>
                    {floatedNumberWithCommas(totalDeposits)} {symbol}
                  </span>
                ),
                tooltip: "",
              },
              {
                header: `Members (max)`,
                content: (
                  <div>
                    {memberCount} <span className="text-gray-syn4">({maxMemberCount})</span>
                  </div>
                ),
                tooltip: "",
              },
              {
                header: "Created",
                content: `${epochTimeToDateFormat(
                  new Date(startTime),
                  "LLL dd, yyyy",
                )}`,
                tooltip: "",
              },

              {
                header: "Closing in",
                content: getCountDownDays(endTime.toString()),
                tooltip: "",
              },
            ]
          : [
              {
                header: "Total deposited",
                content: (
                  <span>
                    {floatedNumberWithCommas(totalDeposits)}{" "}
                    {depositERC20TokenSymbol}
                  </span>
                ),
                tooltip: "",
              },
              {
                header: "Club tokens minted",
                content: (
                  <span>
                    {floatedNumberWithCommas(accountClubTokens)} {symbol}
                  </span>
                ),
                tooltip: "",
              },
              {
                header: "Members",
                content: <div>{memberCount}</div>,
                tooltip: `This is the amount of unique member addresses who have deposited funds into this syndicate. ${
                  !isUnlimited(maxMemberCount)
                    ? `A maximum of ${maxMemberCount} members are allowed for this syndicate.`
                    : ""
                }`,
              },
              {
                header: "Created",
                content: `${epochTimeToDateFormat(
                  new Date(startTime),
                  "LLL dd, yyyy",
                )}`,
                tooltip: "",
              },

              {
                header: "Closed",
                content: `${epochTimeToDateFormat(
                  new Date(endTime),
                  "LLL dd, yyyy",
                )}`,
                tooltip: "",
              },
            ]),
      ]);
    }
  }, [JSON.stringify(erc20Token)]);

  // format an account address in the format 0x3f6q9z52…54h2kjh51h5zfa

  const formattedSyndicateAddress = formatAddress(clubAddress, 6, 4);

  // show message to the user when address has been copied.
  const updateAddressCopyState = () => {
    setShowAddressCopyState(true);
    setTimeout(() => setShowAddressCopyState(false), 1000);
  };

  // show modal for manager to set allowances for deposits/distributions
  //hide modal for setting allowances by the manager

  return (
    <div className="flex flex-col relative mt-9">
      <div className="h-fit-content rounded-custom">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex justify-center items-center">
              <div className="mr-8">
                {clubAddress && !loading && (
                  <GradientAvatar
                    syndicateAddress={clubAddress}
                    size="xl:w-20 lg:w-16 xl:h-20 lg:h-16 w-10 h-10"
                  />
                )}
              </div>

              <div className="flex-shrink main-title flex-wrap break-normal m-0">
                {/* Syndicate address and action buttons  */}
                <div
                  className="flex items-center relative"
                  onMouseEnter={() => setShowActionIcons(true)}
                  onMouseLeave={() => setShowActionIcons(false)}
                >
                  {loading ? (
                    <SkeletonLoader
                      height="9"
                      width="full"
                      borderRadius="rounded-md"
                    />
                  ) : (
                    <div className="flex items-center mb-2 space-x-8">
                      <div className="text-sm cursor-default">
                        <span className="text-gray-syn4 text-lg md:text-2xl">
                          {formattedSyndicateAddress}
                        </span>
                      </div>

                      {showActionIcons ? (
                        <div className="flex space-x-6">
                          <CopyToClipboard text={clubAddress as string}>
                            <button
                              className="flex items-center relative w-4 h-4 cursor-pointer"
                              onClick={updateAddressCopyState}
                              onKeyDown={updateAddressCopyState}
                              data-for="copy-club-address"
                              data-tip
                            >
                              {showAddressCopyState ? (
                                <span className="absolute text-xs -bottom-5">
                                  copied
                                </span>
                              ) : null}
                              <ReactTooltip
                                id="copy-club-address"
                                place="top"
                                effect="solid"
                                className="actionsTooltip"
                                arrowColor="transparent"
                                backgroundColor="#131416"
                              >
                                Copy club address
                              </ReactTooltip>

                              <CopyToClipboardIcon color="text-gray-syn5 hover:text-gray-syn4" />
                            </button>
                          </CopyToClipboard>

                          <div data-for="view-on-etherscan" data-tip>
                            <EtherscanLink
                              customStyles="w-4 h-4"
                              etherscanInfo={clubAddress}
                              grouped
                              iconOnly
                            />
                            <ReactTooltip
                              id="view-on-etherscan"
                              place="top"
                              effect="solid"
                              className="actionsTooltip"
                              arrowColor="transparent"
                              backgroundColor="#131416"
                            >
                              View on Etherscan
                            </ReactTooltip>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
                {/* Syndicate name and symbol  */}
                <div className="flex justify-start items-center">
                  {loading ? (
                    <SkeletonLoader
                      height="9"
                      width="full"
                      borderRadius="rounded-md"
                    />
                  ) : (
                    <div className="flex items-center w-fit-content">
                      <div className="mr-6 2xl:text-4.5xl leading-10 lg:text-4xl md:text-xl sm:text-4xl text-lg font-normal line-clamp-2">
                        {name}
                      </div>
                      <div className="flex flex-wrap">
                        <div className="font-whyte-light text-gray-syn4 flex items-center justify-center">
                          <span className="2xl:text-4.5xl leading-10 lg:text-4xl md:text-xl sm:text-4xl text-lg">
                            {symbol}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {depositsEnabled && (
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
        )}

        {/* This component should be shown when we have details about user deposits */}
        <div className="overflow-hidden mt-6 relative">
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
        </div>
      </div>
      {/* Syndicate details */}
      {/* details rendered on small devices only. render right column components on the left column in small devices */}
      {props.children}
    </div>
  );
};

export default SyndicateDetails;

import { CopyToClipboardIcon } from '@/components/iconWrappers';
import { SkeletonLoader } from '@/components/skeletonLoader';
import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';
import DuplicateClubWarning from '@/components/syndicates/shared/DuplicateClubWarning';
import { CLUB_TOKEN_QUERY } from '@/graphql/queries';
import { getDepositDetails } from '@/helpers/erc20TokenDetails/index';
import { useAccountTokens } from '@/hooks/useAccountTokens';
import { useClubDepositsAndSupply } from '@/hooks/useClubDepositsAndSupply';
import { useIsClubOwner } from '@/hooks/useClubOwner';
import { useDemoMode } from '@/hooks/useDemoMode';
import { AppState } from '@/state';
import { setERC20TokenDepositDetails } from '@/state/erc20token/slice';
import { Status } from '@/state/wallet/types';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import { getTextWidth } from '@/utils/getTextWidth';
import { mockDepositERC20Token } from '@/utils/mockdata';
import { NetworkStatus, useQuery } from '@apollo/client';
import abi from 'human-standard-token-abi';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import NumberTreatment from '../NumberTreatment';
// utils
import GradientAvatar from './portfolioAndDiscover/portfolio/GradientAvatar';
import { DetailsCard, ProgressIndicator } from './shared';
interface ClubDetails {
  header: string;
  content: React.ReactNode;
  tooltip?: string;
  isEditable?: boolean;
}

// we should have an isChildVisible prop here of type boolean
const SyndicateDetails: FC<{ managerSettingsOpen: boolean }> = ({
  managerSettingsOpen,
  children
}) => {
  const {
    initializeContractsReducer: {
      syndicateContracts: { SingleTokenMintModule, DepositTokenMintModule }
    },
    erc20TokenSliceReducer: {
      erc20Token,
      depositDetails,
      depositTokenPriceInUSD,
      erc20TokenContract
    },
    merkleProofSliceReducer: { myMerkleProof },
    web3Reducer: {
      web3: { web3, status, account, activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const {
    address,
    loading,
    maxTotalDeposits,
    memberCount,
    maxMemberCount,
    name,
    owner,
    symbol,
    maxTotalSupply,
    depositsEnabled,
    claimEnabled
  } = erc20Token;

  const {
    depositTokenSymbol,
    depositToken,
    depositTokenLogo,
    depositTokenName,
    depositTokenDecimals,
    nativeDepositToken
  } = depositDetails;

  const isDemoMode = useDemoMode();

  const { accountTokens } = useAccountTokens();

  const router = useRouter();
  const dispatch = useDispatch();

  const {
    totalDeposits,
    totalSupply,
    loadingClubDeposits,
    startTime,
    endTime,
    refetch: refetchSingleClubDetails
  } = useClubDepositsAndSupply(address);

  const {
    loading: queryLoading,
    data,
    networkStatus,
    startPolling,
    stopPolling
  } = useQuery(CLUB_TOKEN_QUERY, {
    variables: {
      syndicateDaoId: address.toLocaleLowerCase()
    },
    notifyOnNetworkStatusChange: true,
    context: { clientName: 'theGraph', chainId: activeNetwork.chainId },
    skip: !address || loading,
    fetchPolicy: 'no-cache'
  });

  useEffect(() => {
    // we want to refetch every 2 seconds until the correct data is fetched
    if (address || !loading) {
      startPolling(2000);
    }
    return;
  }, [address, loading]);

  useEffect(() => {
    // check for demo mode to make sure correct things render
    if (!isDemoMode) {
      // check for network status as ready after query is over
      if (networkStatus !== NetworkStatus.ready) {
        return;
      }
      // check for query loading and data being non-null
      if (!data?.syndicateDAO && !queryLoading) {
        return;
      }
      stopPolling();
      // fallback for if single club details query doesn't initally work
      if (!totalDeposits) {
        refetchSingleClubDetails();
        return;
      }
    } else {
      if (!data) {
        return;
      }
    }

    const { depositToken } = data.syndicateDAO || {};
    async function fetchDepositDetails() {
      let depositDetails;

      if (isDemoMode) {
        depositDetails = mockDepositERC20Token;
      } else {
        depositDetails = await getDepositDetails(
          depositToken,
          erc20TokenContract,
          DepositTokenMintModule,
          SingleTokenMintModule,
          activeNetwork
        );
      }

      dispatch(
        setERC20TokenDepositDetails({
          ...depositDetails,
          loading: false
        })
      );
    }
    fetchDepositDetails();
  }, [
    data,
    data?.syndicateDAO,
    loading,
    erc20Token.loading,
    router.isReady,
    queryLoading,
    networkStatus,
    totalDeposits
  ]);

  const [details, setDetails] = useState<ClubDetails[]>([]);

  // state to handle copying of the syndicate address to clipboard.
  const [showAddressCopyState, setShowAddressCopyState] =
    useState<boolean>(false);

  // state to handle details about the current deposit ERC20 token
  const [, setDepositTokenContract] = useState<any>('');

  // states to show general syndicate details
  const [, setSyndicateCumulativeDetails] = useState([
    {
      header: 'Deposits',
      subText: ''
    }
  ]);

  // get syndicate address from the url
  const { clubAddress } = router.query;

  const [showActionIcons, setShowActionIcons] = useState<boolean>(false);

  const [divWidth, setDivWidth] = useState(0);
  const [nameWidth, setNameWidth] = useState(0);

  // get and set current token details
  useEffect(() => {
    if (!nativeDepositToken && depositToken && web3) {
      // set up token contract
      const tokenContract = new web3.eth.Contract(abi, depositToken);
      setDepositTokenContract(tokenContract);
    }
  }, [depositToken, web3]);

  // perform size checks
  useEffect(() => {
    setDivWidth(document?.getElementById('club-name')?.offsetWidth);
    setNameWidth(getTextWidth(name));
  }, [name]);

  // set syndicate cumulative values
  useEffect(() => {
    if (totalDeposits) {
      setSyndicateCumulativeDetails([
        {
          header: 'Deposits',
          subText: `${floatedNumberWithCommas(
            totalDeposits
          )} ${depositTokenSymbol} (${memberCount} ${
            memberCount === 1 ? 'depositor' : 'depositors'
          })`
        }
      ]);
    }
  }, [totalDeposits, memberCount]);

  useEffect(() => {
    if (name && !managerSettingsOpen) {
      setDetails([
        ...(depositsEnabled
          ? []
          : claimEnabled
          ? [
              {
                header: 'Club token max supply',
                content: (
                  <span>
                    <NumberTreatment numberValue={`${maxTotalSupply || ''}`} />
                  </span>
                ),
                tooltip: ''
              },
              {
                header: 'Club tokens minted',
                content: (
                  <span>
                    <NumberTreatment numberValue={totalDeposits} />
                    &nbsp;{symbol}
                  </span>
                ),
                tooltip: ''
              },
              {
                header: 'Members',
                content: <div>{memberCount}</div>,
                tooltip: ''
              }
            ]
          : [
              {
                header: 'Member deposits',
                content: (
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <img
                        src={depositTokenLogo}
                        className="w-4 h-4 mr-2"
                        alt="logo"
                      />
                      <span>
                        <NumberTreatment numberValue={totalDeposits} />{' '}
                        {depositTokenSymbol}
                      </span>
                    </div>
                    <div className="text-gray-syn4 text-sm">
                      {floatedNumberWithCommas(
                        depositTokenPriceInUSD * totalDeposits
                      )}{' '}
                      USD
                    </div>
                  </div>
                ),
                tooltip: ''
              },
              {
                header: 'Club tokens minted',
                content: (
                  <span>
                    <NumberTreatment numberValue={totalDeposits} /> {symbol}
                  </span>
                ),
                tooltip: ''
              },
              {
                header: 'Club token max supply',
                content: (
                  <span>
                    <NumberTreatment numberValue={`${maxTotalSupply || ''}`} />{' '}
                    {symbol}
                  </span>
                ),
                tooltip: ''
              }
            ])
      ]);
    }
  }, [
    name,
    depositsEnabled,
    maxTotalSupply,
    totalSupply,
    maxMemberCount,
    symbol,
    startTime,
    endTime,
    loading,
    maxTotalDeposits,
    memberCount,
    totalDeposits,
    depositTokenSymbol,
    depositTokenPriceInUSD
  ]);

  // show message to the user when address has been copied.
  const updateAddressCopyState = () => {
    setShowAddressCopyState(true);
    setTimeout(() => setShowAddressCopyState(false), 1000);
  };
  const isOwner = useIsClubOwner();
  const isActive = !depositsEnabled || claimEnabled;
  const isOwnerOrMember =
    isOwner || +accountTokens || myMerkleProof?.account === account;

  const [showDuplicateClubWarning, setShowDuplicateClubWarning] =
    useState(false);
  const [duplicateClubWarningExists, setDuplicateClubWarningExists] =
    useState(false);

  useEffect(() => {
    const duplicateWarningCookieSet = document.cookie
      .split('; ')
      .find((row) => row.startsWith('showedDuplicateClubWarning'));
    setDuplicateClubWarningExists(Boolean(duplicateWarningCookieSet));

    if (duplicateWarningCookieSet) {
      setShowDuplicateClubWarning(false);
    } else if (!duplicateWarningCookieSet && !loading) {
      setShowDuplicateClubWarning(true);
    }
  }, [router.isReady, account, loading]);

  const dismissDuplicateClubWarning = () => {
    if (!duplicateClubWarningExists) {
      // set cookie to expire in a very long time.
      document.cookie =
        'showedDuplicateClubWarning=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; SameSite=None; Secure';
    }
    setShowDuplicateClubWarning(false);
  };

  return (
    <div className="flex flex-col relative">
      <div className="h-fit-content rounded-custom">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex justify-center items-center">
              <div className="mr-8">
                {(loading || loadingClubDeposits || totalDeposits == '') &&
                !managerSettingsOpen ? (
                  <SkeletonLoader
                    height="20"
                    width="20"
                    borderRadius="rounded-full"
                  />
                ) : clubAddress ? (
                  <GradientAvatar
                    name={name}
                    size="xl:w-20 lg:w-16 xl:h-20 lg:h-16 w-10 h-10"
                  />
                ) : null}
              </div>

              <div className="flex-shrink flex-wrap break-normal m-0">
                {/* Syndicate name, symbol and action buttons  */}
                <div
                  className="flex justify-start items-center"
                  onMouseEnter={() => setShowActionIcons(true)}
                  onMouseLeave={() => setShowActionIcons(false)}
                >
                  {loading ? (
                    <div className="md:w-96 w-50">
                      <SkeletonLoader
                        height="9"
                        width="full"
                        borderRadius="rounded-lg"
                      />
                    </div>
                  ) : (
                    <div
                      className={`flex flex-wrap items-center w-fit-content`}
                    >
                      <h1
                        id="club-name"
                        className={`${
                          nameWidth >= divWidth
                            ? `line-clamp-2 mb-2`
                            : `flex mr-6`
                        }`}
                      >
                        {name}
                      </h1>
                      <h1 className="font-light flex flex-wrap text-gray-syn4 items-center justify-center">
                        {symbol}
                      </h1>
                      <div className="inline-flex items-center ml-6 space-x-8 pr-2">
                        {showActionIcons ? (
                          <div className="flex space-x-6">
                            <CopyToClipboard text={owner as string}>
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
                                  Copy club wallet address
                                </ReactTooltip>

                                <CopyToClipboardIcon color="text-gray-syn5 hover:text-gray-syn4" />
                              </button>
                            </CopyToClipboard>

                            <div data-for="view-on-block-explorer" data-tip>
                              <BlockExplorerLink
                                customStyles="w-4 h-4"
                                resourceId={erc20Token.owner}
                                grouped
                                iconOnly
                              />
                              <ReactTooltip
                                id="view-on-block-explorer"
                                place="top"
                                effect="solid"
                                className="actionsTooltip"
                                arrowColor="transparent"
                                backgroundColor="#131416"
                              >
                                View on {activeNetwork.blockExplorer.name}
                              </ReactTooltip>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {showDuplicateClubWarning &&
          !isDemoMode &&
          !isOwner &&
          !loading &&
          status !== Status.DISCONNECTED && (
            <div className="mt-6">
              <DuplicateClubWarning
                dismissDuplicateClubWarning={dismissDuplicateClubWarning}
              />
            </div>
          )}

        {status !== Status.DISCONNECTED &&
          depositsEnabled &&
          !managerSettingsOpen && (
            <div className="h-fit-content flex flex-col w-full justify-start mt-14">
              <ProgressIndicator
                totalDeposits={totalDeposits}
                depositTotalMax={maxTotalSupply.toString()}
                openDate={startTime.toString()}
                closeDate={endTime.toString()}
                loading={loading || loadingClubDeposits}
                nativeDepositToken={nativeDepositToken}
                depositTokenPriceInUSD={depositTokenPriceInUSD.toString()}
                tokenDetails={{
                  symbol: depositTokenSymbol,
                  contractAddress: depositToken,
                  logo: depositTokenLogo,
                  name: depositTokenName,
                  decimals: depositTokenDecimals
                }}
                activeNetwork={activeNetwork}
              />
            </div>
          )}

        {/* This component should be shown when we have details about user deposits */}
        {(status !== Status.DISCONNECTED &&
          (loading || !(isActive && !isOwnerOrMember))) ||
        isDemoMode ||
        !managerSettingsOpen ? (
          <div className="overflow-hidden mt-6 relative">
            {!depositsEnabled && (
              <DetailsCard
                title="Details"
                sections={details}
                customStyles={'w-full pt-4'}
                customInnerWidth="w-full grid xl:grid-cols-3 lg:grid-cols-3
          grid-cols-3 xl:gap-8 gap-2 xl:gap-5 gap-y-8"
              />
            )}
          </div>
        ) : null}
      </div>
      {/* Syndicate details */}
      {/* details rendered on small devices only. render right column components on the left column in small devices */}
      {children}
    </div>
  );
};

export default SyndicateDetails;

import DuplicateClubWarning from '@/components/syndicates/shared/DuplicateClubWarning';
import { B1, B3 } from '@/components/typography';
import { isStableCoin } from '@/containers/createInvestmentClub/shared/ClubTokenDetailConstants';
import { CLUB_TOKEN_QUERY } from '@/graphql/queries';
import { getDepositDetails } from '@/helpers/erc20TokenDetails/index';
import { useClubDepositsAndSupply } from '@/hooks/clubs/useClubDepositsAndSupply';
import { useAccountTokens } from '@/hooks/useAccountTokens';
import { useDemoMode } from '@/hooks/useDemoMode';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { setERC20TokenDepositDetails } from '@/state/erc20token/slice';
import { Status } from '@/state/wallet/types';
import { divideIfNotByZero } from '@/utils/conversions';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import { mockDepositERC20Token } from '@/utils/mockdata';
import { NetworkStatus, useQuery } from '@apollo/client';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'huma... Remove this comment to see the full error message
import abi from 'human-standard-token-abi';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NumberTreatment from '../NumberTreatment';
import { DetailsCard, ProgressIndicator } from './shared';

interface ClubDetails {
  header: string;
  content: React.ReactNode;
  tooltip?: string;
  isEditable?: boolean;
}

// we should have an isChildVisible prop here of type boolean
const SyndicateDetails: FC<{
  managerSettingsOpen: boolean;
  isOwner: boolean;
}> = ({ managerSettingsOpen, isOwner, children }) => {
  const {
    initializeContractsReducer: {
      syndicateContracts: { SingleTokenMintModule, DepositTokenMintModule }
    },
    erc20TokenSliceReducer: {
      erc20Token,
      depositDetails,
      depositTokenPriceInUSD,
      erc20TokenContract,
      activeModuleDetails,
      isNewClub
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
    context: {
      clientName: SUPPORTED_GRAPHS.THE_GRAPH,
      chainId: activeNetwork.chainId
    },
    skip: !address || loading || !activeNetwork.chainId || isDemoMode,
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
          activeModuleDetails?.mintModule,
          activeNetwork
        );
      }
      dispatch(
        // @ts-expect-error TS(2345): Argument of type '{ loading: false; mintModule: st... Remove this comment to see the full error message
        setERC20TokenDepositDetails({
          ...depositDetails,
          loading: false
        })
      );
    }

    void fetchDepositDetails();
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

  // state to handle details about the current deposit ERC20 token
  const [, setDepositTokenContract] = useState<any>('');
  const [tokensViaDeposits, setTokensViaDeposits] = useState(0);

  // states to show general syndicate details
  const [, setSyndicateCumulativeDetails] = useState([
    {
      header: 'Deposits',
      subText: ''
    }
  ]);

  // get and set current token details
  useEffect(() => {
    if (!nativeDepositToken && depositToken && !isEmpty(web3)) {
      // set up token contract
      const tokenContract = new web3.eth.Contract(abi, depositToken);
      setDepositTokenContract(tokenContract);
    }
  }, [depositToken, web3]);

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
    // depending on whether the admin burns tokens or not,
    // we need to calculate the amount raised based on
    // the total circulating supply of club tokens
    const amountRaised = nativeDepositToken
      ? +totalSupply / activeNetwork.nativeCurrency.exchangeRate
      : +totalSupply;

    if (name && !managerSettingsOpen) {
      setDetails([
        ...(depositsEnabled
          ? [
              {
                header: 'Fundraising goal',
                content: (
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <img
                        src={depositTokenLogo}
                        className="w-4 h-4 mr-2"
                        alt="logo"
                      />
                      <B1 extraClasses="flex-shrink-0">
                        {floatedNumberWithCommas(maxTotalDeposits)}{' '}
                        {depositTokenSymbol}
                      </B1>
                    </div>

                    {!isStableCoin(depositTokenSymbol) ? (
                      <B3 extraClasses="text-gray-syn3">
                        {floatedNumberWithCommas(
                          // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                          depositTokenPriceInUSD * maxTotalDeposits
                        )}{' '}
                        USD
                      </B3>
                    ) : null}
                  </div>
                ),
                tooltip: ''
              },
              {
                header: 'Amount raised',
                content: (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <img
                        src={depositTokenLogo}
                        className="w-4 h-4"
                        alt="logo"
                      />
                      <B1 extraClasses="flex-shrink-0">
                        {floatedNumberWithCommas(amountRaised)}{' '}
                        {depositTokenSymbol}
                      </B1>
                      <B1 extraClasses="text-gray-syn3 flex-shrink-0">
                        {floatedNumberWithCommas(
                          divideIfNotByZero(amountRaised, maxTotalDeposits) *
                            100
                        )}{' '}
                        %
                      </B1>
                    </div>

                    {!isStableCoin(depositTokenSymbol) ? (
                      <B3 className="text-gray-syn3 text-sm">
                        {floatedNumberWithCommas(
                          // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                          depositTokenPriceInUSD * amountRaised
                        )}{' '}
                        USD
                      </B3>
                    ) : null}
                  </div>
                ),
                tooltip: ''
              },
              {
                header: 'Amount remaining',
                content: (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <img
                        src={depositTokenLogo}
                        className="w-4 h-4"
                        alt="logo"
                      />
                      <B1 extraClasses="flex-shrink-0">
                        {floatedNumberWithCommas(
                          +maxTotalDeposits - +amountRaised
                        )}{' '}
                        {depositTokenSymbol}
                      </B1>
                      <B1 extraClasses="text-gray-syn3 flex-shrink-0">
                        {floatedNumberWithCommas(
                          divideIfNotByZero(
                            +maxTotalDeposits - +amountRaised,
                            maxTotalDeposits
                          ) * 100
                        )}{' '}
                        %
                      </B1>
                    </div>

                    {!isStableCoin(depositTokenSymbol) ? (
                      <B3 extraClasses="text-gray-syn3">
                        {floatedNumberWithCommas(
                          // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                          depositTokenPriceInUSD *
                            (+maxTotalDeposits - +amountRaised)
                        )}{' '}
                        USD
                      </B3>
                    ) : null}
                  </div>
                ),
                tooltip: ''
              }
            ]
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
                    <NumberTreatment numberValue={totalSupply} />
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

                    {!isStableCoin(depositTokenSymbol) ? (
                      <div className="text-gray-syn4 text-sm">
                        {floatedNumberWithCommas(
                          // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                          depositTokenPriceInUSD * totalDeposits
                        )}{' '}
                        USD
                      </div>
                    ) : null}
                  </div>
                ),
                tooltip: ''
              },
              {
                header: 'Club tokens minted',
                content: (
                  <span>
                    <NumberTreatment numberValue={totalSupply} /> {symbol}
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

  const isActive = !depositsEnabled || claimEnabled;

  const [showDuplicateClubWarning, setShowDuplicateClubWarning] =
    useState(false);
  const [duplicateClubWarningExists, setDuplicateClubWarningExists] =
    useState(false);

  const isOwnerOrMember =
    isOwner || +accountTokens || myMerkleProof?.account === account;

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

  const dismissDuplicateClubWarning = (): void => {
    if (!duplicateClubWarningExists) {
      // set cookie to expire in a very long time.
      document.cookie =
        'showedDuplicateClubWarning=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; SameSite=None; Secure';
    }
    setShowDuplicateClubWarning(false);
  };

  const { pathname } = router;
  const isSettingPage = pathname === '/clubs/[clubAddress]/modify';

  return (
    <div className="flex flex-col relative">
      <div className="h-fit-content rounded-custom">
        {showDuplicateClubWarning &&
          !isDemoMode &&
          !isOwner &&
          !loading &&
          status !== Status.DISCONNECTED &&
          !(isSettingPage && !isNewClub) && (
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
                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                depositTokenPriceInUSD={depositTokenPriceInUSD.toString()}
                tokenDetails={{
                  symbol: depositTokenSymbol,
                  contractAddress: depositToken,
                  logo: depositTokenLogo,
                  name: depositTokenName,
                  decimals: depositTokenDecimals
                }}
                activeNetwork={activeNetwork}
                depositsEnabled={depositsEnabled}
                setTokensViaDeposits={setTokensViaDeposits}
                tokensViaDeposits={tokensViaDeposits}
              />
            </div>
          )}

        {/* This component should be shown when we have details about user deposits */}
        {(status !== Status.DISCONNECTED &&
          (loading || !(isActive && !isOwnerOrMember))) ||
        isDemoMode ||
        !managerSettingsOpen ? (
          <div className="relative">
            <DetailsCard
              title="Details"
              sections={details}
              customStyles={'w-full pt-4'}
              customInnerWidth="w-full justify-between flex-wrap flex"
            />
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

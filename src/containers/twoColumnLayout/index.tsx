import { ClubERC20Contract } from '@/ClubERC20Factory/clubERC20';
import ErrorBoundary from '@/components/errorBoundary';
import Layout from '@/components/layout';
import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';
import { ClubHeader } from '@/components/syndicates/shared/clubHeader';
import Head from '@/components/syndicates/shared/HeaderTitle';
import {
  ERC20TokenDefaultState,
  setERC20Token
} from '@/helpers/erc20TokenDetails';
import { useClubDepositsAndSupply } from '@/hooks/useClubDepositsAndSupply';
import useClubTokenMembers from '@/hooks/useClubTokenMembers';
import { useDemoMode } from '@/hooks/useDemoMode';
import { useGetDepositTokenPrice } from '@/hooks/useGetDepositTokenPrice';
import useTransactions from '@/hooks/useTransactions';
import NotFoundPage from '@/pages/404';
import { AppState } from '@/state';
import {
  clearCollectiblesTransactions,
  fetchTokenTransactions,
  setMockCollectiblesResult,
  setMockTokensResult
} from '@/state/assets/slice';
import { setClubMembers } from '@/state/clubMembers';
import {
  setDepositTokenUSDPrice,
  setERC20TokenContract,
  setERC20TokenDepositDetails,
  setERC20TokenDetails
} from '@/state/erc20token/slice';
import { clearMyTransactions } from '@/state/erc20transactions';
import { Status } from '@/state/wallet/types';
import {
  mockActiveERC20Token,
  mockDepositModeTokens,
  mockTokensResult
} from '@/utils/mockdata';
import window from 'global';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { syndicateActionConstants } from 'src/components/syndicates/shared/Constants';

const TwoColumnLayout: FC<{
  dotIndicatorOptions: string[];
  managerSettingsOpen: boolean;
  leftColumnComponent;
  rightColumnComponent;
}> = ({
  managerSettingsOpen,
  leftColumnComponent,
  rightColumnComponent,
  dotIndicatorOptions = []
}) => {
  const {
    initializeContractsReducer: { syndicateContracts },
    web3Reducer: {
      web3: { account, web3, status, activeNetwork }
    },
    erc20TokenSliceReducer: {
      erc20Token,
      depositDetails: { nativeDepositToken },
      depositTokenPriceInUSD
    }
  } = useSelector((state: AppState) => state);

  const {
    owner,
    loading,
    name,
    depositsEnabled,
    maxTotalDeposits,
    address,
    symbol
  } = erc20Token;

  // Get clubAddress from window.location object since during page load, router is not ready
  // hence clubAddress is undefined.
  // We need to have access to clubAddress as early as possible.
  const clubAddress = window?.location?.pathname.split('/')[2];

  const isDemoMode = useDemoMode(clubAddress);
  // dispatch the price of the deposit token for use in other
  // components
  useGetDepositTokenPrice(activeNetwork.chainId);
  const zeroAddress = '0x0000000000000000000000000000000000000000';

  useEffect(() => {
    // Demo mode
    if (clubAddress === zeroAddress) {
      router.push('/clubs/demo/manage');
    }
  });

  const { loadingClubDeposits, totalDeposits } =
    useClubDepositsAndSupply(address);

  // fetch club transactions
  useTransactions();

  // fetch club members
  useClubTokenMembers();

  const router = useRouter();
  const dispatch = useDispatch();

  const fetchAssets = () => {
    // fetch token transactions for the connected account.
    dispatch(
      fetchTokenTransactions({
        account: owner,
        activeNetwork: activeNetwork,
        web3: web3
      })
    );
  };

  useEffect(() => {
    if (!owner) return;
    fetchAssets();
  }, [owner, web3, activeNetwork]);

  useEffect(() => {
    return () => {
      // clear transactions when component unmounts
      // solves an issue with previous transactions being loaded
      // when a switch is made to another club with a different owner.
      dispatch(clearMyTransactions());
      dispatch(clearCollectiblesTransactions());

      // also clearing token details when switching between clubs
      dispatch(setDepositTokenUSDPrice(0));

      dispatch(setERC20TokenDetails(ERC20TokenDefaultState));
      dispatch(
        setERC20TokenDepositDetails({
          mintModule: '',
          nativeDepositToken: false,
          depositToken: '',
          depositTokenSymbol: '',
          depositTokenLogo: '/images/usdcicon.png',
          depositTokenName: '',
          depositTokenDecimals: 6,
          loading: true
        })
      );
    };
  }, [dispatch]);

  const [showNav] = useState(true);

  useEffect(() => {
    if (owner) {
      // fetch token transactions for the connected account.
      dispatch(fetchTokenTransactions(owner));
    } else if (isDemoMode) {
      const mockTokens = depositsEnabled
        ? mockDepositModeTokens
        : mockTokensResult;
      dispatch(setMockTokensResult(mockTokens));

      dispatch(setMockCollectiblesResult(depositsEnabled));
    }
  }, [
    owner,
    clubAddress,
    depositsEnabled,
    maxTotalDeposits,
    depositTokenPriceInUSD,
    loadingClubDeposits,
    nativeDepositToken
  ]);

  useEffect(() => {
    // clear collectibles on account switch
    if (account && !isDemoMode) {
      dispatch(clearCollectiblesTransactions());
    }
  }, [account, clubAddress, dispatch, isDemoMode, maxTotalDeposits]);

  /**
   * Fetch club details
   */
  useEffect(() => {
    if (!clubAddress || status == Status.CONNECTING) return;

    if (
      clubAddress !== zeroAddress &&
      web3.utils?.isAddress(clubAddress) &&
      syndicateContracts?.DepositTokenMintModule
    ) {
      const clubERC20tokenContract = new ClubERC20Contract(
        clubAddress as string,
        web3,
        activeNetwork
      );

      dispatch(setERC20TokenContract(clubERC20tokenContract));

      dispatch(setERC20Token(clubERC20tokenContract));

      return () => {
        dispatch(setClubMembers([]));
      };
    } else if (isDemoMode) {
      // using "Active" as the default view.
      dispatch(setERC20TokenDetails(mockActiveERC20Token));
    }
  }, [
    clubAddress,
    account,
    nativeDepositToken,
    status,
    syndicateContracts?.DepositTokenMintModule
  ]);

  // get static text from constants
  const { noTokenTitleText } = syndicateActionConstants;

  // set texts to display on empty state
  // we'll initialize this to instances where address is not a syndicate.
  // if the address is invalid, this texts will be updated accordingly.

  // set syndicate empty state.
  // component will be rendered if the address is not a syndicate
  const syndicateEmptyState = (
    <div className="flex justify-center items-center h-full w-full mt-6 sm:mt-10">
      <div className="flex flex-col items-center justify-center sm:w-7/12 md:w-5/12 rounded-custom p-10">
        <div className="w-full flex justify-center mb-6">
          <img
            className="inline w-12"
            src="/images/syndicateStatusIcons/warning-triangle-gray.svg"
            alt="Warning"
          />
        </div>
        <p className="text-lg md:text-2xl text-center mb-3">
          {noTokenTitleText}
        </p>
        <BlockExplorerLink resource={'address'} resourceId={clubAddress} />
      </div>
    </div>
  );

  return (
    <>
      {router.isReady && !isDemoMode && !web3.utils?.isAddress(clubAddress) ? (
        <NotFoundPage />
      ) : (
        <Layout
          dotIndicatorOptions={dotIndicatorOptions}
          managerSettingsOpen={managerSettingsOpen}
          showNav={showNav}
          showBackButton={true}
        >
          <Head title={name || 'Club'} />
          <ErrorBoundary>
            <div className="w-full">
              {router.isReady && !name && !loading && !isDemoMode ? (
                syndicateEmptyState
              ) : (
                <div className="container mx-auto">
                  {/* Two Columns (Syndicate Details + Widget Cards) */}
                  <div className="grid grid-cols-12 gap-5">
                    {/* Left Column */}
                    <div
                      className={`md:col-start-1 ${
                        managerSettingsOpen ? 'md:col-end-8' : 'md:col-end-7'
                      } col-span-12`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          {/* Club header */}
                          <div className="flex justify-center items-center">
                            <ClubHeader
                              {...{
                                loading,
                                name,
                                symbol,
                                owner,
                                loadingClubDeposits,
                                totalDeposits,
                                managerSettingsOpen,
                                clubAddress
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Show distribution or syndicateDetails components */}

                      <div className="w-full mt-5">{leftColumnComponent}</div>
                      <div className="w-full md:hidden mt-8">
                        {rightColumnComponent}
                      </div>
                    </div>
                    {/* Right Column */}
                    <div className="md:col-end-13 md:col-span-5 col-span-12 hidden md:flex justify-end items-start pt-0 h-full">
                      <div className="sticky top-33 w-full max-w-120">
                        {rightColumnComponent}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ErrorBoundary>
        </Layout>
      )}
    </>
  );
};

export default TwoColumnLayout;

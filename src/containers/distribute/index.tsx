import { ClubERC20Contract } from '@/ClubERC20Factory/clubERC20';
import { BadgeWithOverview } from '@/components/distributions/badgeWithOverview';
import Layout from '@/components/layout';
import { ClubHeader } from '@/components/syndicates/shared/clubHeader';
import { setERC20Token } from '@/helpers/erc20TokenDetails';
import { useClubDepositsAndSupply } from '@/hooks/useClubDepositsAndSupply';
import { useIsClubOwner } from '@/hooks/useClubOwner';
import useClubTokenMembers from '@/hooks/useClubTokenMembers';
import { useDemoMode } from '@/hooks/useDemoMode';
import { useGetDepositTokenPrice } from '@/hooks/useGetDepositTokenPrice';
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
  setDistributeTokens,
  setDistributionMembers,
  setEth
} from '@/state/distributions';
import {
  setERC20TokenContract,
  setERC20TokenDetails
} from '@/state/erc20token/slice';
import { Status } from '@/state/wallet/types';
import { getSynToken } from '@/utils/api';
import {
  mockActiveERC20Token,
  mockDepositModeTokens,
  mockTokensResult
} from '@/utils/mockdata';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TwoColumnLayout from '../twoColumnLayout';
import ReviewDistribution from './DistributionMembers';
import { EstimateDistributionsGas } from './estimateDistributionsGas';
import TokenSelector from './TokenSelector';

enum Steps {
  selectTokens = 'select tokens',
  selectMembers = 'select members'
}

const Distribute: FC = () => {
  const {
    initializeContractsReducer: {
      syndicateContracts: { DepositTokenMintModule }
    },
    clubMembersSliceReducer: { clubMembers, loadingClubMembers },
    distributeTokensReducer: {
      distributionTokens,
      gasEstimate,
      eth,
      isLoading
    },
    erc20TokenSliceReducer: {
      erc20Token,
      depositDetails: { nativeDepositToken }
    },
    assetsSliceReducer: {
      tokensResult,
      collectiblesResult,
      loading: loadingAssets
    },
    web3Reducer: {
      web3: { account, status, activeNetwork, web3 }
    }
  } = useSelector((state: AppState) => state);

  // calls the estimate gas function which changes the redux state of gasEstimate
  EstimateDistributionsGas();

  // fetch club members
  useClubTokenMembers();

  const dispatch = useDispatch();

  const [tokensDetails, setTokensDetails] = useState([]);
  const [ctaButtonDisabled, setCtaButtonDisabled] = useState(true);
  const [sufficientGas, setSufficientGas] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>(Steps.selectTokens);
  const [activeIndex, setActiveIndex] = useState(0);

  const [isClubFound, setIsClubFound] = useState(false);

  const {
    owner,
    loading,
    depositsEnabled,
    name,
    maxTotalDeposits,
    address,
    symbol
  } = erc20Token;

  // Prepare distributions tokens for overview badge
  const router = useRouter();

  const {
    pathname,
    isReady,
    query: { clubAddress }
  } = router;

  const isOwner = useIsClubOwner();
  const isDemoMode = useDemoMode(clubAddress as string);

  useEffect(() => {
    if (!isReady || isEmpty(web3)) return;

    if (web3.utils?.isAddress(clubAddress as string) && !isDemoMode) {
      setIsClubFound(true);
    }
  }, [isReady, clubAddress, isDemoMode, web3]);

  useEffect(() => {
    if (
      loading ||
      !clubAddress ||
      status === Status.CONNECTING ||
      !owner ||
      !isReady
    )
      return;

    if (pathname.includes('/distribute') || isDemoMode) {
      if (depositsEnabled || !isOwner) {
        if (!isOwner) {
          router.replace(
            `/clubs/${clubAddress}${'?chain=' + activeNetwork.network}`
          );
        } else {
          router.replace(
            `/clubs/${clubAddress}/manage${'?chain=' + activeNetwork.network}`
          );
        }
      }
    }
  }, [
    depositsEnabled,
    owner,
    clubAddress,
    account,
    loading,
    status,
    isReady,
    isOwner,
    pathname,
    isDemoMode,
    router,
    activeNetwork.chainId
  ]);

  // Prepare distributions tokens for overview badge
  useEffect(() => {
    if (distributionTokens.length) {
      setCtaButtonDisabled(false);

      setTokensDetails(
        distributionTokens.map(({ symbol, tokenAmount, fiatAmount, icon }) => ({
          tokenAmount,
          fiatAmount,
          tokenIcon: icon,
          tokenSymbol: symbol,
          isLoading: loadingAssets
        }))
      );
    } else {
      setCtaButtonDisabled(true);
    }

    return () => {
      setTokensDetails([]);
      setCtaButtonDisabled(true);
    };
  }, [JSON.stringify(distributionTokens)]);

  useEffect(() => {
    if (loadingClubMembers) return;

    dispatch(setDistributionMembers(clubMembers));
  }, [JSON.stringify(clubMembers), loadingClubMembers]);

  /**
   * Prepare and handle token selection.
   */
  const [activeIndices, setActiveIndices] = useState([]);
  const [_options, setOptions] = useState([]);
  const [processingTokens, setProcessingTokens] = useState(true);

  // check whether we have sufficient gas for distribution
  useEffect(() => {
    if (!activeIndices.length) return; // return, there is nothing to distribute

    const [_loadedNativeToken] = tokensResult.filter(
      (token) => token.tokenSymbol === activeNetwork.nativeCurrency.symbol
    );
    const [_nativeToken] = distributionTokens.filter(
      (token) => token.symbol === activeNetwork.nativeCurrency.symbol
    );

    const _totalNativeCurrencyGasEstimate =
      distributionTokens.length * +gasEstimate.tokenAmount;

    // _nativeToken is undefined if its not selected
    if (_nativeToken) {
      const { tokenAmount } = _nativeToken;

      if (tokenAmount > _totalNativeCurrencyGasEstimate) {
        // we have enough gas
        setSufficientGas(true);
      } else {
        setSufficientGas(false);
      }
    } else {
      // token not selected for distribution
      if (_loadedNativeToken?.tokenBalance > _totalNativeCurrencyGasEstimate) {
        // we have enough gas
        setSufficientGas(true);
      } else {
        setSufficientGas(false);
      }
    }
  }, [distributionTokens, activeIndices]);

  // Calculates maximum tokens that can be distributed per given token
  const getTransferableTokens = useCallback(async () => {
    if (_options.length) {
      setOptions(_options);
    } else {
      const tokens = await await (
        await Promise.all([
          ...tokensResult.map(
            async ({
              tokenBalance,
              tokenName,
              tokenSymbol,
              price,
              logo,
              tokenValue,
              ...rest
            }) => {
              const {
                data: {
                  data: { syndicateDAOs }
                }
              } = await getSynToken(
                rest.contractAddress,
                activeNetwork.chainId
              );

              if (!syndicateDAOs.length && +tokenBalance > 0) {
                return {
                  ...rest,
                  logo,
                  icon: logo,
                  name: tokenName,
                  symbol: tokenSymbol,
                  tokenAmount: tokenBalance,
                  maximumTokenAmount:
                    tokenSymbol == activeNetwork.nativeCurrency.symbol &&
                    gasEstimate?.tokenAmount
                      ? parseFloat(`${tokenBalance}`) -
                        parseFloat(`${gasEstimate.tokenAmount}`)
                      : tokenBalance,
                  price: price?.usd ?? 0,
                  fiatAmount: tokenValue,
                  isEditingInFiat: false,
                  warning: ''
                };
              }
            }
          )
        ])
      ).filter((token) => (token = token !== undefined));

      setOptions(tokens);
      setProcessingTokens(false);
    }
  }, [
    tokensResult,
    activeNetwork.chainId,
    activeNetwork.nativeCurrency.symbol,
    gasEstimate.tokenAmount
  ]);

  useEffect(() => {
    getTransferableTokens();
  }, [getTransferableTokens, tokensResult]);

  // Add all selected tokens to store
  useEffect(() => {
    if (activeIndices.length > 0) {
      const selectedTokens = _options.filter((_, index) => {
        return activeIndices.includes(index);
      });

      dispatch(setDistributeTokens(selectedTokens));
    } else {
      dispatch(setDistributeTokens([]));
    }
  }, [_options, activeIndices, dispatch]);

  // Whenever the a new token is selected, maximum native token value should be recalculated
  useEffect(() => {
    let _ethIndex = -1;
    const [nativeToken] = _options.filter((token, ethIndex) => {
      if (token.symbol === activeNetwork.nativeCurrency.symbol) {
        _ethIndex = ethIndex;
        return token;
      }
    });

    if (nativeToken) {
      const { maximumTokenAmount: currentMax } = nativeToken;

      // Calculate maximum amount of nativeToken that can be distributed
      // Note: Added a 0.5 margin for gas estimate inaccuracy
      const _newMaxTokenAmount = activeIndices.length
        ? +eth.available - +gasEstimate.tokenAmount * activeIndices.length * 1.5
        : +eth.available - +gasEstimate.tokenAmount * 1.5;

      // if maximum value is selected, trigger error message
      let error = '';
      if (currentMax > _newMaxTokenAmount) {
        error = 'Exceeds amount available for distribution';
        setSufficientGas(false);
      } else {
        error = '';
        setSufficientGas(true);
      }

      // update maximumTokenAmount on ETH token
      setOptions([
        ..._options.slice(0, _ethIndex),
        {
          ..._options[_ethIndex],
          error,
          maximumTokenAmount: _newMaxTokenAmount
        },
        ..._options.slice(_ethIndex + 1)
      ]);
    }
  }, [activeIndices, gasEstimate.tokenAmount]);

  // dispatch the price of the deposit token for use in other
  // components
  useGetDepositTokenPrice(activeNetwork.chainId);
  const zeroAddress = '0x0000000000000000000000000000000000000000';

  const { loadingClubDeposits, totalDeposits } =
    useClubDepositsAndSupply(address);

  useEffect(() => {
    // Demo mode
    if (clubAddress === zeroAddress) {
      router.push('/clubs/demo/manage');
    }
  });

  useEffect(() => {
    if (owner && activeNetwork.chainId && !isEmpty(web3)) {
      // fetch token transactions for the connected account.
      dispatch(
        fetchTokenTransactions({
          account: owner,
          activeNetwork: activeNetwork,
          web3: web3
        })
      );
    }
  }, [activeNetwork, dispatch, owner]);

  useEffect(() => {
    if (isDemoMode) {
      const mockTokens = depositsEnabled
        ? mockDepositModeTokens
        : mockTokensResult;
      dispatch(setMockTokensResult(mockTokens));

      dispatch(setMockCollectiblesResult(depositsEnabled));
    }
  }, [isDemoMode, collectiblesResult.length]);

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
      web3.utils?.isAddress(clubAddress as string) &&
      DepositTokenMintModule
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
    DepositTokenMintModule
  ]);

  /**
   * if max ETH is selected and other tokens are available but not selected,
   * show warning message asking the admin to reserve some ETH for other token
   * distributions.
   */
  useEffect(() => {
    let warning = '';
    const eth = {
      available: '0',
      totalToDistribute: '0'
    };

    if (tokensResult.length) {
      const [nativeToken] = tokensResult.filter(
        (token) => token.tokenSymbol === activeNetwork.nativeCurrency.symbol
      );
      eth.available = nativeToken?.tokenBalance || '0';
    }

    const [nativeToken] = distributionTokens.filter(
      (token) => token.symbol == activeNetwork.nativeCurrency.symbol
    );

    // update total selected amount
    eth.totalToDistribute = nativeToken?.tokenAmount ?? '0';

    if (
      tokensResult.length > 1 &&
      distributionTokens.length < tokensResult.length
    ) {
      if (nativeToken) {
        if (
          nativeToken.tokenAmount > 0 &&
          nativeToken.tokenAmount == nativeToken.maximumTokenAmount
        ) {
          warning = `Consider reserving ${nativeToken.symbol} to pay gas on future 
          distributions`;
        } else {
          warning = '';
        }
      } else {
        warning = '';
      }

      // find index of ETH token on _options
      const ethIndex = _options.findIndex(
        (option) => option.symbol == activeNetwork.nativeCurrency.symbol
      );

      if (ethIndex > -1) {
        // update warning on ETH token
        setOptions([
          ..._options.slice(0, ethIndex),
          {
            ..._options[ethIndex],
            warning
          },
          ..._options.slice(ethIndex + 1)
        ]);
      }
    }

    dispatch(setEth(eth));
  }, [
    JSON.stringify(distributionTokens),
    JSON.stringify(tokensResult),
    loadingAssets
  ]);

  const [hasError, setHasError] = useState(true);
  useEffect(() => {
    const _hasError = _options.some((option) => option.error);
    setHasError(_hasError);
  }, [_options]);

  const handleNext = (event) => {
    event.preventDefault();
    setCurrentStep(Steps.selectMembers);
    setActiveIndex(1);
  };

  const rightColumnComponent = (
    <div className="space-y-8">
      <BadgeWithOverview
        tokensDetails={tokensDetails}
        gasEstimate={gasEstimate}
        isLoading={isLoading}
        numSelectedTokens={distributionTokens.length}
        isCTADisabled={ctaButtonDisabled || !sufficientGas || hasError}
        CTALabel={
          sufficientGas ? 'Next, review members' : 'Insufficient gas reserves'
        }
        ctaOnclickHandler={handleNext}
      />
    </div>
  );

  const headerComponent = (
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
              managerSettingsOpen: true,
              clubAddress
            }}
          />
        </div>
      </div>
    </div>
  );

  const dotIndicatorOptions = ['Distribute', 'Review'];

  // Redirect to /manage
  const handleExitClick = () =>
    router.replace(
      `/clubs/${clubAddress}/manage${'?chain=' + activeNetwork.network}`
    );

  const handleSetActiveIndex = (event) => {
    event.preventDefault();
    setActiveIndex(activeIndex - 1);
    setCurrentStep(Steps.selectTokens);
  };

  return (
    <>
      {!isClubFound ? (
        <NotFoundPage />
      ) : (
        <>
          {currentStep == Steps.selectTokens ? (
            <TwoColumnLayout
              activeIndex={activeIndex}
              setActiveIndex={handleSetActiveIndex}
              hideWalletAndEllipsis={true}
              showCloseButton={true}
              headerComponent={headerComponent}
              headerTitle={name}
              managerSettingsOpen={true}
              dotIndicatorOptions={dotIndicatorOptions}
              handleExitClick={handleExitClick}
              leftColumnComponent={
                <div>
                  <TokenSelector
                    options={_options}
                    activeIndices={activeIndices}
                    setOptions={setOptions}
                    setActiveIndices={setActiveIndices}
                    loading={loadingAssets || loading || processingTokens}
                  />
                </div>
              }
              rightColumnComponent={
                <div>
                  {/* Use this to take up space when the component's position is fixed */}
                  <div className="opacity-0 md:opacity-100">
                    {rightColumnComponent}
                  </div>
                  {/* Mobile positioning */}
                  <div className="fixed bottom-0 left-0 w-full md:hidden">
                    {rightColumnComponent}
                  </div>
                </div>
              }
            />
          ) : null}

          {/* show component to select members here */}
          {currentStep == Steps.selectMembers ? (
            <Layout
              managerSettingsOpen={false}
              showNav={true}
              showBackButton={true}
              dotIndicatorOptions={dotIndicatorOptions}
              handleExitClick={handleExitClick}
              activeIndex={activeIndex}
              setActiveIndex={handleSetActiveIndex}
            >
              <ReviewDistribution />
            </Layout>
          ) : null}
        </>
      )}
    </>
  );
};

export default Distribute;

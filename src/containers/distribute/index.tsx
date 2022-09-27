import { ClubERC20Contract } from '@/ClubERC20Factory/clubERC20';
import { BadgeWithOverview } from '@/components/distributions/badgeWithOverview';
import Layout from '@/components/layout';
import { ClubHeader } from '@/components/syndicates/shared/clubHeader';
import { resetClubState, setERC20Token } from '@/helpers/erc20TokenDetails';
import { useClubDepositsAndSupply } from '@/hooks/clubs/useClubDepositsAndSupply';
import { useTokenOwner } from '@/hooks/clubs/useClubOwner';
import { useDemoMode } from '@/hooks/useDemoMode';
import useGasDetails, { ContractMapper } from '@/hooks/useGasDetails';
import { useGetDepositTokenPrice } from '@/hooks/useGetDepositTokenPrice';
import NotFoundPage from '@/pages/404';
import { AppState } from '@/state';
import {
  clearCollectiblesTransactions,
  fetchTokenTransactions,
  setMockCollectiblesResult,
  setMockTokensResult
} from '@/state/assets/slice';
import { setERC20TokenContract } from '@/state/erc20token/slice';
import { Status } from '@/state/wallet/types';
import { isZeroAddress } from '@/utils';
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
    distributeTokensReducer: { gasEstimate },
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

  const dispatch = useDispatch();

  const [tokensDetails, setTokensDetails] = useState([]);
  const [ctaButtonDisabled, setCtaButtonDisabled] = useState(true);
  const [sufficientGas, setSufficientGas] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>(Steps.selectTokens);
  const [activeIndex, setActiveIndex] = useState(0);

  /**
   * Prepare and handle token selection.
   */
  const [activeIndices, setActiveIndices] = useState([]);
  const [_options, setOptions] = useState([]);
  const [distributionTokens, setDistributionTokens] = useState([]);
  const [processingTokens, setProcessingTokens] = useState(true);
  const [currentNativeToken, setCurrentNativeToken] = useState<{
    available: number;
    totalToDistribute: number;
  }>({
    available: 0,
    totalToDistribute: 0
  });

  const [isClubFound, setIsClubFound] = useState(false);
  const [hasError, setHasError] = useState(true);

  const {
    owner,
    loading,
    depositsEnabled,
    name,
    maxTotalDeposits,
    address,
    symbol
  } = erc20Token;

  const { gas: gasPrice, fiatAmount } = useGasDetails({
    contract: ContractMapper.DistributionsERC20,
    withFiatCurrency: true,
    args: {
      numSelectedTokens: distributionTokens.length,
      clubAddress:
        activeNetwork.chainId === 137
          ? '0x979e031fa7b743ce8896b03d4b96a212c3dd8417'
          : '0xb02a13a268339bedd892a00ff132da4352ed9df5',
      distributionERC20Address:
        activeNetwork.chainId === 137
          ? '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
          : '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926',
      totalDistributionAmount: 0,
      members: ['0x5b17a1dae9ebf4bc7a04579ae6cedf2afe7601c0'],
      batchIdentifier: 'batch'
    },
    skipQuery: !distributionTokens.length
  });

  // Prepare distributions tokens for overview badge
  const router = useRouter();

  const {
    pathname,
    isReady,
    query: { clubAddress }
  } = router;

  const isDemoMode = useDemoMode(clubAddress as string);

  const { isOwner } = useTokenOwner(
    clubAddress as string,
    web3,
    activeNetwork,
    account
  );

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
      if (+_loadedNativeToken?.tokenBalance > _totalNativeCurrencyGasEstimate) {
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
                  isSelected: false,
                  warning: '',
                  error: ''
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

      setDistributionTokens(selectedTokens);
    } else {
      setDistributionTokens([]);
    }
  }, [_options, activeIndices, dispatch]);

  // Whenever a new token is selected, maximum native token value should be recalculated
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
      // Note: Added a 2% margin for gas estimate inaccuracy
      const _newMaxTokenAmount = activeIndices.length
        ? +currentNativeToken.available -
          +gasEstimate.tokenAmount * activeIndices.length * 1.2
        : +currentNativeToken.available - +gasEstimate.tokenAmount * 1.2;

      // if maximum value is selected, trigger error message
      let error = '';
      if (currentMax > _newMaxTokenAmount) {
        error = 'Exceeds amount available for distribution';
        setSufficientGas(false);
      } else {
        error = '';
        setSufficientGas(true);
      }

      // update maximumTokenAmount on currentNativeToken token
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
  }, [activeIndices, gasEstimate.tokenAmount, currentNativeToken]);

  // dispatch the price of the deposit token for use in other
  // components
  useGetDepositTokenPrice(activeNetwork.chainId);

  const { loadingClubDeposits, totalDeposits } =
    useClubDepositsAndSupply(address);

  useEffect(() => {
    // Demo mode
    if (isZeroAddress(clubAddress as string)) {
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
      !isZeroAddress(clubAddress as string) &&
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
    } else if (isDemoMode) {
      // using "Active" as the default view.
      resetClubState(dispatch, mockActiveERC20Token);
    }
  }, [
    clubAddress,
    account,
    nativeDepositToken,
    status,
    DepositTokenMintModule
  ]);

  /**
   * if max native is selected and other tokens are available but not selected,
   * show warning message asking the admin to reserve some native for other token
   * distributions.
   */
  useEffect(() => {
    let warning = '';

    const [_selectedNativeToken] = distributionTokens.filter(
      (token) => token.symbol == activeNetwork.nativeCurrency.symbol
    );

    if (
      tokensResult.length > 1 &&
      distributionTokens.length < tokensResult.length
    ) {
      if (_selectedNativeToken) {
        if (
          _selectedNativeToken.tokenAmount > 0 &&
          _selectedNativeToken.tokenAmount ==
            _selectedNativeToken.maximumTokenAmount
        ) {
          warning = `Consider reserving ${_selectedNativeToken.symbol} to pay gas on future 
          distributions`;
        } else {
          warning = '';
        }
      } else {
        warning = '';
      }

      // find index of native token on _options
      const ethIndex = _options.findIndex(
        (option) => option.symbol == activeNetwork.nativeCurrency.symbol
      );

      if (ethIndex > -1) {
        // update warning on native token
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

    setCurrentNativeToken({
      available:
        +tokensResult.filter(
          (token) => token.tokenSymbol === activeNetwork.nativeCurrency.symbol
        )[0]?.tokenBalance || 0,
      totalToDistribute: +_selectedNativeToken?.tokenAmount ?? 0
    });
  }, [
    JSON.stringify(distributionTokens),
    JSON.stringify(tokensResult),
    loadingAssets
  ]);

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
        gasEstimate={
          gasPrice
            ? {
                tokenSymbol: activeNetwork?.nativeCurrency?.symbol,
                tokenAmount: String(gasPrice),
                fiatAmount: fiatAmount
              }
            : null
        }
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
              name,
              symbol,
              owner,
              loading: loadingClubDeposits || loading,
              totalDeposits,
              managerSettingsOpen: true,
              clubAddress: clubAddress?.toString() || ''
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

  const handlePrevious = (event) => {
    event.preventDefault();
    if (activeIndex === 0) return;
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
              handlePrevious={handlePrevious}
              hideWalletAndEllipsis={true}
              showCloseButton={true}
              headerTitle={name}
              managerSettingsOpen={true}
              dotIndicatorOptions={dotIndicatorOptions}
              handleExitClick={handleExitClick}
              leftColumnComponent={
                <div className="space-y-16">
                  {headerComponent}
                  <TokenSelector
                    symbol={symbol}
                    options={_options}
                    activeIndices={activeIndices}
                    handleOptionsChange={setOptions}
                    handleActiveIndicesChange={setActiveIndices}
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
              showNavButton={true}
              showBackButton={true}
              dotIndicatorOptions={dotIndicatorOptions}
              handleExitClick={handleExitClick}
              activeIndex={activeIndex}
              handlePrevious={handlePrevious}
              hideWalletAndEllipsis={true}
              showCloseButton={true}
            >
              <ReviewDistribution
                tokens={distributionTokens}
                handleExitClick={handleExitClick}
              />
            </Layout>
          ) : null}
        </>
      )}
    </>
  );
};

export default Distribute;

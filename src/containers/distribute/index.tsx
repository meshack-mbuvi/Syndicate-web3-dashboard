import { ClubERC20Contract } from '@/ClubERC20Factory/clubERC20';
import { BadgeWithOverview } from '@/components/distributions/badgeWithOverview';
import Layout from '@/components/layout';
import SyndicateEmptyState from '@/components/shared/SyndicateEmptyState';
import { ClubHeader } from '@/components/syndicates/shared/clubHeader';
import { resetClubState, setERC20Token } from '@/helpers/erc20TokenDetails';
import { useClubDepositsAndSupply } from '@/hooks/clubs/useClubDepositsAndSupply';
import { useTokenOwner } from '@/hooks/clubs/useClubOwner';
import { useDemoMode } from '@/hooks/useDemoMode';
import useGasDetails, { ContractMapper } from '@/hooks/useGasDetails';
import { useGetDepositTokenPrice } from '@/hooks/useGetDepositTokenPrice';
import { useGetNetwork } from '@/hooks/web3/useGetNetwork';
import { INetwork } from '@/Networks/networks';
import NotFoundPage from '@/pages/404';
import { AppState } from '@/state';
import {
  clearCollectiblesTransactions,
  fetchTokenTransactions,
  setMockCollectiblesResult,
  setMockTokensResult
} from '@/state/assets/slice';
import { IToken } from '@/state/assets/types';
import { setERC20TokenContract } from '@/state/erc20token/slice';
import { Status } from '@/state/wallet/types';
import { isZeroAddress } from '@/utils';
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

const GAS_ESTIMATE_MARGIN = 1.5; // A margin of 50% is added to the estimate.

const Distribute: FC = () => {
  const {
    initializeContractsReducer: {
      syndicateContracts: { DepositTokenMintModule, distributionsERC20 }
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

  const dispatch = useDispatch();

  const [CTAButtonDisabled, setCTAButtonDisabled] = useState(true);
  const [tokensDetails, setTokensDetails] = useState<
    {
      fiatAmount: string;
      tokenAmount: string;
      tokenIcon: string;
      tokenSymbol: string;
      isLoading?: boolean;
    }[]
  >([]);
  const [sufficientGas, setSufficientGas] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>(Steps.selectTokens);
  const [activeIndex, setActiveIndex] = useState(0);

  /**
   * Prepare and handle token selection.
   */
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [_options, setOptions] = useState<IToken[]>([]);
  const [distributionTokens, setDistributionTokens] = useState<IToken[]>([]);
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
          : activeNetwork.chainId === 4
          ? '0xb02a13a268339bedd892a00ff132da4352ed9df5'
          : '0xc96ff0a7fe274a4588f6d2a9baacfe9698bab3b0',
      distributionERC20Address:
        activeNetwork.chainId === 137
          ? '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
          : activeNetwork.chainId === 4
          ? '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926'
          : '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
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
    query: { clubAddress, chain }
  } = router;

  const isDemoMode = useDemoMode(clubAddress as string);

  const { isOwner } = useTokenOwner(
    clubAddress as string,
    web3,
    activeNetwork,
    account
  );

  const [urlNetwork, setUrlNetwork] = useState<INetwork>();

  useEffect(() => {
    if (chain) {
      GetNetworkByName(chain as string);
    }
  }, [chain]);

  const GetNetworkByName = (name: string): void => {
    const network: INetwork = useGetNetwork(name);
    setUrlNetwork(network);
  };

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
          void router.replace(
            `/clubs/${clubAddress as string}${
              '?chain=' + activeNetwork.network
            }`
          );
        } else {
          void router.replace(
            `/clubs/${clubAddress as string}/manage${
              '?chain=' + activeNetwork.network
            }`
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
      setCTAButtonDisabled(false);
      setTokensDetails(
        distributionTokens.map(({ symbol, tokenAmount, fiatAmount, icon }) => ({
          fiatAmount: isNaN(parseFloat(`${fiatAmount ?? 0}`))
            ? '0'
            : Number(fiatAmount).toFixed(4),
          tokenAmount: isNaN(parseFloat(tokenAmount ?? '0'))
            ? '0'
            : Number(tokenAmount).toFixed(4),
          tokenIcon: icon ?? '',
          tokenSymbol: symbol || '',
          isLoading: loadingAssets
        }))
      );
    } else {
      setCTAButtonDisabled(true);
    }

    return (): void => {
      setTokensDetails([]);
      setCTAButtonDisabled(true);
    };
  }, [JSON.stringify(distributionTokens)]);

  // check whether we have sufficient gas for distribution
  useEffect(() => {
    if (!activeIndices?.length) return; // return, there is nothing to distribute

    const [_loadedNativeToken] = tokensResult.filter(
      (token: IToken) =>
        token.tokenSymbol === activeNetwork.nativeCurrency.symbol
    );
    const [_nativeToken] =
      distributionTokens.filter(
        (token: IToken) => token.symbol === activeNetwork.nativeCurrency.symbol
      ) || [];

    const _totalNativeCurrencyGasEstimate: number =
      distributionTokens.length * gasPrice * GAS_ESTIMATE_MARGIN;

    // _nativeToken is undefined if its not selected
    if (_nativeToken) {
      const {
        tokenAmount,
        tokenBalance,
        isEditingInFiat = false,
        price,
        fiatAmount,
        maximumTokenAmount
      } = _nativeToken;

      const _amountAvailableForDistribution = parseFloat(
        isEditingInFiat
          ? `${fiatAmount ?? 0 * (price?.usd ?? 1)}`
          : tokenAmount && +tokenAmount != 0
          ? tokenAmount
          : tokenBalance
      );

      // There is sufficient gas if the amount entered by the user is less or
      // equal to the amount available.
      const maxAmount =
        (isEditingInFiat
          ? (maximumTokenAmount ? +maximumTokenAmount : 0) * (price?.usd ?? 1)
          : maximumTokenAmount) || 0;

      if (+maxAmount >= _amountAvailableForDistribution) {
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
  }, [distributionTokens, activeIndices, gasPrice]);

  // Calculates maximum tokens that can be distributed per given token
  const getTransferableTokens = useCallback(async () => {
    if (_options?.length) {
      setOptions(_options);
    } else {
      // Remove tokens hidden manually by admin.
      const existingClubsHiddenAssets =
        JSON.parse(localStorage.getItem('hiddenAssets') as string) || {};

      // filter out hidden tokens
      let filteredAssets;
      if (Object.keys(existingClubsHiddenAssets).length) {
        const clubHiddenAssets =
          existingClubsHiddenAssets[clubAddress as string];

        if (clubHiddenAssets && clubHiddenAssets?.length) {
          filteredAssets = tokensResult.map((data) => {
            const { contractAddress } = data;
            return {
              ...data,
              hidden: clubHiddenAssets.indexOf(contractAddress) > -1
            };
          });
        }
      }

      // For the remaining assets after removing those hidden manually by admin,
      // check whether there is any that is not transferrable
      // and filter it out.
      const filteredTokens =
        filteredAssets && filteredAssets?.length
          ? filteredAssets.filter((token) => !token?.hidden)
          : tokensResult;

      const tokens = await await (
        await Promise.all([
          ...filteredTokens.map(
            async ({
              tokenBalance,
              tokenName,
              tokenSymbol,
              price,
              logo,
              tokenValue,
              contractAddress,
              ...rest
            }) => {
              let isTransferable = false;
              if (contractAddress && contractAddress !== 'nativeTokenAddress') {
                await distributionsERC20
                  .getEstimateGasDistributeERC20(
                    account,
                    1,
                    clubAddress as string,
                    contractAddress,
                    0,
                    ['0x5b17a1dae9ebf4bc7a04579ae6cedf2afe7601c0'],
                    'test-123',
                    () => {
                      // successful gas estimates implies that the token can be distributed.
                      isTransferable = true;
                    },
                    (error: { message: string }) => {
                      if (
                        error.message.includes(
                          'requested transfer not allowed'
                        ) ||
                        error.message.includes(
                          'Sender or recipient must be DAOs'
                        )
                      ) {
                        isTransferable = false;
                      }
                    }
                  )
                  .catch((error: { message: string }) => {
                    if (
                      error.message.includes(
                        'requested transfer not allowed'
                      ) ||
                      error.message.includes('Sender or recipient must be DAOs')
                    ) {
                      isTransferable = false;
                    }
                  });
              }

              if (contractAddress == 'nativeTokenAddress') {
                isTransferable = true;
              }

              return {
                ...rest,
                tokenBalance,
                tokenName,
                tokenSymbol,
                logo,
                tokenValue,
                isTransferable,
                contractAddress,
                icon: logo,
                name: tokenName,
                symbol: tokenSymbol,
                tokenAmount: tokenBalance,
                maximumTokenAmount:
                  tokenSymbol == activeNetwork.nativeCurrency.symbol && gasPrice
                    ? parseFloat(`${tokenBalance}`) - parseFloat(`${gasPrice}`)
                    : tokenBalance,
                fiatAmount: tokenValue,
                isEditingInFiat: false,
                isSelected: false,
                price: { usd: price.usd ?? 0 },
                warning: '',
                error: ''
              };
            }
          )
        ])
      ).filter((token) => token?.isTransferable);

      // @ts-expect-error TS(2345): Argument of type 'any[]' is not assignable to para... Remove this comment to see the full error message
      setOptions(tokens);
      setProcessingTokens(false);
    }
  }, [
    tokensResult,
    activeNetwork.chainId,
    activeNetwork.nativeCurrency.symbol,
    gasPrice
  ]);

  useEffect(() => {
    void getTransferableTokens();
  }, [getTransferableTokens, tokensResult]);

  // Add all selected tokens to store
  useEffect(() => {
    if (activeIndices.length > 0) {
      const selectedTokens: IToken[] = _options.filter((_, index: number) => {
        return activeIndices.includes(index);
      });

      setDistributionTokens(selectedTokens);
    } else {
      setDistributionTokens([]);
    }
  }, [_options, activeIndices, dispatch]);

  // Whenever a new token is selected, maximum native token value should be recalculated
  useEffect(() => {
    if (gasPrice === 0) return;

    let _nativeTokenIndex = -1;
    const [nativeToken] = _options.filter((token, ethIndex) => {
      if (token.symbol === activeNetwork.nativeCurrency.symbol) {
        _nativeTokenIndex = ethIndex;
        return token;
      }
      return null;
    });

    // Calculate maximum amount of nativeToken that can be distributed
    // Note: Added a some margin(GAS_ESTIMATE_MARGIN) for gas estimate inaccuracy
    const _newMaxTokenAmount = activeIndices.length
      ? +currentNativeToken.available -
        +gasPrice * activeIndices.length * GAS_ESTIMATE_MARGIN
      : +currentNativeToken.available;

    // if maximum value is selected, trigger error message
    let error = '';
    if (nativeToken) {
      if (_newMaxTokenAmount <= 0) {
        error = 'Exceeds amount available for distribution';
        setSufficientGas(false);
      } else {
        error = '';
        setSufficientGas(true);
      }
    }

    const price = _options[_nativeTokenIndex].price.usd;

    // update maximumTokenAmount on currentNativeToken token
    setOptions([
      ..._options.slice(0, _nativeTokenIndex),
      {
        ..._options[_nativeTokenIndex],
        error,
        fiatAmount: price
          ? price * +_newMaxTokenAmount > 0
            ? price * +_newMaxTokenAmount
            : 0
          : 0,
        tokenAmount: `${_newMaxTokenAmount > 0 ? _newMaxTokenAmount : 0}`,
        maximumTokenAmount: `${_newMaxTokenAmount > 0 ? _newMaxTokenAmount : 0}`
      },
      ..._options.slice(_nativeTokenIndex + 1)
    ]);
  }, [activeIndices, gasPrice]);

  // dispatch the price of the deposit token for use in other
  // components
  useGetDepositTokenPrice(activeNetwork.chainId);

  const { loadingClubDeposits, totalDeposits } =
    useClubDepositsAndSupply(address);

  useEffect(() => {
    // Demo mode
    if (isZeroAddress(clubAddress as string)) {
      void router.push('/clubs/demo/manage');
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
    const [_selectedNativeToken]: IToken[] = distributionTokens.filter(
      (token: IToken) => token.symbol == activeNetwork.nativeCurrency.symbol
    );

    setCurrentNativeToken({
      available:
        +tokensResult.filter(
          (token: IToken) =>
            token.tokenSymbol === activeNetwork.nativeCurrency.symbol
        )[0]?.tokenBalance || 0,
      totalToDistribute:
        parseFloat(`${_selectedNativeToken?.tokenAmount ?? '0'}`) ?? 0
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

  const handleNext = (event: { preventDefault: () => void }): void => {
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
                tokenAmount: String(gasPrice * GAS_ESTIMATE_MARGIN),
                fiatAmount: String(+fiatAmount * GAS_ESTIMATE_MARGIN)
              }
            : null
        }
        isCTADisabled={CTAButtonDisabled || !sufficientGas || hasError}
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
  const handleExitClick = (): void => {
    void router.replace(
      `/clubs/${clubAddress as string}/manage${
        '?chain=' + activeNetwork.network
      }`
    );
  };

  const handlePrevious = (event: any): void => {
    event.preventDefault();

    if (activeIndex === 0) return;

    setActiveIndex(activeIndex - 1);
    setCurrentStep(Steps.selectTokens);
  };

  return (
    <>
      {!isClubFound ? (
        <NotFoundPage />
      ) : urlNetwork?.chainId &&
        urlNetwork?.chainId !== activeNetwork?.chainId ? (
        <SyndicateEmptyState activeNetwork={activeNetwork} />
      ) : (
        <>
          {currentStep == Steps.selectTokens ? (
            <TwoColumnLayout
              activeIndex={activeIndex}
              handlePrevious={handlePrevious}
              hideWallet={true}
              hideEllipsis={true}
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
              hideWallet={true}
              hideEllipsis={true}
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

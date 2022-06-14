import { BadgeWithOverview } from '@/components/distributions/badgeWithOverview';
import Layout from '@/components/layout';
import { useIsClubOwner } from '@/hooks/useClubOwner';
import { useDemoMode } from '@/hooks/useDemoMode';
import { AppState } from '@/state';
import {
  setDistributeTokens,
  setDistributionMembers,
  setEth
} from '@/state/distributions';
import { Status } from '@/state/wallet/types';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';
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
    clubMembersSliceReducer: { clubMembers, loadingClubMembers },
    distributeTokensReducer: { distributionTokens, gasEstimate, eth },
    erc20TokenSliceReducer: { erc20Token },
    assetsSliceReducer: { tokensResult, loading: loadingAssets },
    web3Reducer: {
      web3: { account, status }
    }
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();

  const [tokensDetails, setTokensDetails] = useState([]);
  const [ctaButtonDisabled, setCtaButtonDisabled] = useState(true);
  const [sufficientGas, setSufficientGas] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>(Steps.selectTokens);
  const [activeIndex, setActiveIndex] = useState(0);

  const { owner, loading } = erc20Token;

  // Prepare distributions tokens for overview badge
  const router = useRouter();

  const {
    pathname,
    isReady,
    query: { clubAddress }
  } = router;

  const isOwner = useIsClubOwner();
  const isDemoMode = useDemoMode();

  useEffect(() => {
    if (
      loading ||
      !clubAddress ||
      status === Status.CONNECTING ||
      !owner ||
      !isReady
    )
      return;

    if ((pathname.includes('/distribute') && !isOwner) || isDemoMode) {
      router.replace(`/clubs/${clubAddress}`);
    }
  }, [
    owner,
    clubAddress,
    account,
    loading,
    status,
    isReady,
    isOwner,
    pathname,
    isDemoMode,
    router
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

  // check whether we have sufficient gas for distribution
  useEffect(() => {
    if (
      eth &&
      gasEstimate &&
      +(parseFloat(eth.available) - parseFloat(eth.totalToDistribute)).toFixed(
        5
      ) >= parseFloat(gasEstimate.tokenAmount)
    ) {
      setSufficientGas(true);
    } else {
      setSufficientGas(false);
    }
  }, [JSON.stringify(gasEstimate), JSON.stringify(eth)]);

  /**
   * Prepare and handle token selection.
   */
  const [activeIndices, setActiveIndices] = useState([]);
  const [_options, setOptions] = useState([]);

  useEffect(() => {
    const tokens = tokensResult.map(
      ({ tokenBalance, tokenName, tokenSymbol, price, logo, ...rest }) => {
        return {
          ...rest,
          logo,
          icon: logo,
          name: tokenName,
          symbol: tokenSymbol,
          tokenAmount: tokenBalance,
          maximumTokenAmount:
            tokenSymbol == 'ETH' && gasEstimate?.tokenAmount
              ? parseFloat(`${tokenBalance}`) -
                parseFloat(`${gasEstimate.tokenAmount}`)
              : tokenBalance,
          price: price?.usd ?? 0,
          fiatAmount:
            parseFloat(Number(price) ? price : price?.usd ?? 0) *
            parseFloat(tokenBalance),
          isEditingInFiat: false,
          warning: ''
        };
      }
    );

    setOptions(tokens);
  }, [
    JSON.stringify(tokensResult),
    JSON.stringify(gasEstimate),
    loadingAssets,
    loadingAssets
  ]);

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
      const [ETH] = tokensResult.filter((token) => token.tokenSymbol === 'ETH');
      eth.available = ETH?.tokenBalance || '0';
    }

    const [ethToken] = distributionTokens.filter(
      (token) => token.symbol == 'ETH'
    );

    // update total selected amount
    eth.totalToDistribute = ethToken?.tokenAmount ?? '0';

    if (
      tokensResult.length > 1 &&
      distributionTokens.length < tokensResult.length
    ) {
      if (ethToken) {
        if (
          ethToken.tokenAmount > 0 &&
          ethToken.tokenAmount == ethToken.maximumTokenAmount
        ) {
          warning = `Consider reserving ${ethToken.symbol} to pay gas on future 
          distributions`;
        } else {
          warning = '';
        }
      } else {
        warning = '';
      }

      // find index of ETH token on _options
      const ethIndex = _options.findIndex((option) => option.symbol == 'ETH');

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
        isCTADisabled={ctaButtonDisabled || !sufficientGas}
        CTALabel={
          sufficientGas ? 'Next, review members' : 'Insufficient gas reserves'
        }
        ctaOnclickHandler={handleNext}
      />
    </div>
  );

  const dotIndicatorOptions = ['Distribute', 'Review'];

  // Redirect to /manage
  const handleExitClick = () => router.replace(`/clubs/${clubAddress}/manage`);

  const handleSetActiveIndex = (event) => {
    event.preventDefault();
    setActiveIndex(activeIndex - 1);
    setCurrentStep(Steps.selectTokens);
  };

  return (
    <>
      {currentStep == Steps.selectTokens ? (
        <TwoColumnLayout
          managerSettingsOpen={true}
          dotIndicatorOptions={dotIndicatorOptions}
          leftColumnComponent={
            <div>
              <TokenSelector
                options={_options}
                activeIndices={activeIndices}
                setOptions={setOptions}
                setActiveIndices={setActiveIndices}
                loading={loadingAssets}
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
  );
};

export default Distribute;

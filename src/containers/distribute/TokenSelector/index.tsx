import { AssetList } from '@/components/distributions/assetList';
import { SkeletonLoader } from '@/components/skeletonLoader';
import { B3, B4 } from '@/components/typography';
import { AppState } from '@/state';
import { setDistributeTokens, setEth } from '@/state/distributions';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DistributionHeader from '../DistributionHeader';

const TokenSelector: React.FC = () => {
  const {
    assetsSliceReducer: { tokensResult, loading },
    distributeTokensReducer: { distributionTokens, gasEstimate },
    erc20TokenSliceReducer: {
      erc20Token: { symbol }
    }
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();

  const [activeIndices, setActiveIndices] = useState([]);
  const [_options, setOptions] = useState([]);

  useEffect(() => {
    const tokens = tokensResult.map(
      ({ tokenBalance, tokenName, tokenSymbol, price, logo, ...rest }) => {
        return {
          ...rest,
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

    return () => {
      setOptions([]);
    };
  }, [JSON.stringify(tokensResult), JSON.stringify(gasEstimate), loading]);

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

    return () => {
      dispatch(setDistributeTokens([]));
    };
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
    loading
  ]);

  return (
    <div>
      <DistributionHeader
        titleText="What would you like to distribute?"
        subTitleText={`Assets are distributed in proportion to members’ ownership of ${symbol} tokens.`}
      />
      <div>
        <div className="hidden md:block">
          <B3 extraClasses="flex text-gray-syn5 mt-2">
            <img src="/images/question-gray5.svg" alt="" className="mr-2" />
            Why don’t NFTs show up here?
          </B3>
        </div>
        <div className="md:hidden">
          <B4 extraClasses="flex text-gray-syn5 mt-2">
            <img src="/images/question-gray5.svg" alt="" className="mr-2" />
            Why don’t NFTs show up here?
          </B4>
        </div>
      </div>

      <div className="mt-9">
        {loading ? (
          [1, 2, 3, 4].map((_, index) => (
            <div className="-space-y-2 mx-6 py-3" key={index}>
              <div className="flex justify-between">
                <SkeletonLoader width="1/3" height="6" />

                <SkeletonLoader width="1/3" height="6" />
              </div>
              <div className="flex justify-end">
                <SkeletonLoader width="1/6" height="5" />
              </div>
            </div>
          ))
        ) : _options.length ? (
          <AssetList
            options={_options}
            activeIndices={activeIndices}
            handleOptionsChange={setOptions}
            handleActiveIndicesChange={setActiveIndices}
          />
        ) : null}
      </div>
    </div>
  );
};

export default TokenSelector;

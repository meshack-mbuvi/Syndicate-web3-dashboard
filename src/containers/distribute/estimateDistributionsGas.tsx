import { AppState } from '@/state';
import { setGasEstimates, setIsLoading } from '@/state/distributions/index';
import { getNativeTokenPrice } from '@/utils/api/transactions';
import { getWeiAmount } from '@/utils/conversions';
import { isDev } from '@/utils/environment';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const baseURL = isDev
  ? 'https://api-rinkeby.etherscan.io/api'
  : 'https://api.etherscan.io/api';

export function EstimateDistributionsGas() {
  const {
    web3Reducer: {
      web3: { account, activeNetwork, web3 }
    },
    initializeContractsReducer: {
      syndicateContracts: { distributionsERC20, distributionsETH }
    },
    assetsSliceReducer: { tokensResult }
  } = useSelector((state: AppState) => state);

  const { nativeCurrency } = activeNetwork;

  const { symbol } = nativeCurrency;

  const [gasUnits, setGasUnits] = useState(0);
  const [gasBaseFee, setGasBaseFee] = useState(0);
  const [ethTokenPrice, setEthTokenPrice] = useState<number | undefined>();

  const dispatch = useDispatch();

  const processBaseFee = async (result) => {
    const baseFee = result.result;
    const baseFeeInDecimal = parseInt(baseFee, 16);
    setGasBaseFee(baseFeeInDecimal);
  };

  const fetchGasUnitAndBaseFeeERC20 = useCallback(async () => {
    if (!distributionsERC20 || !tokensResult.length) return;

    await Promise.all([
      !account
        ? setGasUnits(380000)
        : distributionsERC20.getEstimateGasDistributeERC20(
            account,
            setGasUnits
          ),
      axios
        .get(`${baseURL}?module=proxy&action=eth_gasPrice`)
        .then((res) => processBaseFee(res.data))
        .catch(() => 0),
      getNativeTokenPrice(activeNetwork.chainId)
        .then((res) => setEthTokenPrice(res))
        .catch(() => 0)
    ]);
  }, [distributionsERC20, tokensResult.length, account, activeNetwork.chainId]);

  const fetchGasUnitAndBaseFeeETH = useCallback(async () => {
    if (!distributionsETH) return;

    await Promise.all([
      !account
        ? setGasUnits(380000)
        : distributionsETH.getEstimateGasDistributeETH(account, setGasUnits),
      axios
        .get(`${baseURL}?module=proxy&action=eth_gasPrice`)
        .then((res) => processBaseFee(res.data))
        .catch(() => 0),
      getNativeTokenPrice(activeNetwork.chainId)
        .then((res) => setEthTokenPrice(res))
        .catch(() => 0)
    ]);
  }, [account, distributionsETH]);

  useEffect(() => {
    if (tokensResult.length == 0) return;

    void fetchGasUnitAndBaseFeeERC20();
  }, [tokensResult.length]);

  useEffect(() => {
    if (!gasUnits || !gasBaseFee || !ethTokenPrice || !web3 || !symbol) return;
    const estimatedGasInWei = gasUnits * (gasBaseFee + 2);
    const estimatedGas = getWeiAmount(
      web3,
      estimatedGasInWei.toString(),
      18,
      false
    );

    dispatch(
      setGasEstimates({
        tokenSymbol: symbol,
        tokenAmount: estimatedGas,
        fiatAmount: (estimatedGas * ethTokenPrice).toFixed(2)
      })
    );
    dispatch(setIsLoading(false));
  }, [gasUnits, gasBaseFee, ethTokenPrice, web3, symbol]);
}

import { getNativeTokenPrice } from '@/utils/api/transactions';
import { AppState } from '@/state';
import { getWeiAmount } from '@/utils/conversions';
import { isDev } from '@/utils/environment';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setGasEstimates } from '@/state/distributions/index';

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
    }
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
    if (!distributionsERC20) return;

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
  }, [account, distributionsERC20]);

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
    void fetchGasUnitAndBaseFeeERC20();
  }, [
    fetchGasUnitAndBaseFeeERC20
    /* fetchGasUnitAndBaseFeeETH */
  ]);

  useEffect(() => {
    if (!gasUnits || !gasBaseFee || !ethTokenPrice || !web3) return;
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
  }, [gasUnits, gasBaseFee, ethTokenPrice, web3]);
}

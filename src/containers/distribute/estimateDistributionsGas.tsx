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
      syndicateContracts: { clubERC20Factory, clubERC20FactoryNative }
    }
  } = useSelector((state: AppState) => state);

  const [gas, setGas] = useState(0);
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
    if (!clubERC20Factory) return;

    await Promise.all([
      !account
        ? setGasUnits(380000)
        : clubERC20Factory.getEstimateGasDistributeERC20(account, setGasUnits),
      axios
        .get(`${baseURL}?module=proxy&action=eth_gasPrice`)
        .then((res) => processBaseFee(res.data))
        .catch(() => 0),
      getNativeTokenPrice(activeNetwork.chainId)
        .then((res) => setEthTokenPrice(res))
        .catch(() => 0)
    ]);
  }, [account, clubERC20Factory]);

  const fetchGasUnitAndBaseFeeETH = useCallback(async () => {
    if (!clubERC20FactoryNative) return;

    await Promise.all([
      !account
        ? setGasUnits(380000)
        : clubERC20FactoryNative.getEstimateGasDistributeETH(
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
  }, [account, clubERC20FactoryNative]);

  useEffect(() => {
    /* if (!ethDepositToken) { */
    void fetchGasUnitAndBaseFeeERC20();
    /* } else {
      void fetchGasUnitAndBaseFeeETH();
    } */
  }, [
    fetchGasUnitAndBaseFeeERC20,
    fetchGasUnitAndBaseFeeETH /* , ethDepositToken */
  ]);

  useEffect(() => {
    if (!gasUnits || !gasBaseFee || !ethTokenPrice) return;
    const estimatedGasInWei = gasUnits * (gasBaseFee + 2);
    const estimatedGas = getWeiAmount(
      web3,
      estimatedGasInWei.toString(),
      18,
      false
    );

    const fiatAmount = Number(+estimatedGas * ethTokenPrice).toFixed(2);
    console.log('fiatamount: ', fiatAmount);
    // dispatch to gasEstimate Redux here?

    dispatch(
      setGasEstimates({
        tokenAmount: estimatedGas,
        fiatAmount: (estimatedGas * ethTokenPrice).toFixed(2)
      })
    );
    setGas(+estimatedGas);
  }, [gasUnits, gasBaseFee, ethTokenPrice]);

  console.log('ethtokenprice: ', ethTokenPrice);

  console.log('estimated gas value: ', gas);
}

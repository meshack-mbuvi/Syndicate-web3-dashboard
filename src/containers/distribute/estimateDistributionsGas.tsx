import { getNativeTokenPrice } from '@/utils/api/transactions';
import { AppState } from '@/state';
import { getWeiAmount } from '@/utils/conversions';
import { isDev } from '@/utils/environment';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setGasEstimates, setIsLoading } from '@/state/distributions/index';

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

  console.log('yo hit gasUnits:', gasUnits);

  const dispatch = useDispatch();

  const processBaseFee = async (result) => {
    const baseFee = result.result;
    const baseFeeInDecimal = parseInt(baseFee, 16);
    setGasBaseFee(baseFeeInDecimal);
  };

  const fetchGasUnitAndBaseFeeERC20 = useCallback(async () => {
    if (!distributionsERC20) return;
    console.log('yo hi account: ', account);
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
        .then((res) => {
          setEthTokenPrice(res);
        })
        .catch(() => 0)
    ]);
  }, [account, distributionsERC20, activeNetwork.chainId]);

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
    //void fetchGasUnitAndBaseFeeETH();
    void fetchGasUnitAndBaseFeeERC20();
  }, [/* fetchGasUnitAndBaseFeeETH,  */ fetchGasUnitAndBaseFeeERC20]);

  useEffect(() => {
    console.log('yo hit?');
    if (!gasUnits || !gasBaseFee || !ethTokenPrice || !web3 || !symbol) {
      if (!gasUnits) {
        console.log('yo hit gasUnits?');
        return;
      }
      if (!gasBaseFee) {
        console.log('yo hit gasBaseFee?');
        return;
      }
      if (!ethTokenPrice) {
        console.log('yo hit ethTokenPrice?');
        return;
      }
      if (!web3) {
        console.log('yo hit web3?');
        return;
      }
      if (!symbol) {
        console.log('yo hit symbol?');
        return;
      }
    }
    const estimatedGasInWei = gasUnits * (gasBaseFee + 2);
    const estimatedGas = getWeiAmount(
      web3,
      estimatedGasInWei.toString(),
      18,
      false
    );
    // damn sometimes this line and below doesn't even get reached
    console.log('yo hit');
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

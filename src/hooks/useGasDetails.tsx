import { AppState } from '@/state';
import { useDispatch, useSelector } from 'react-redux';
import { getNativeTokenPrice } from '@/utils/api/transactions';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { setGasDetails } from '@/state/gasDetails';

const useGasDetails = (): void => {
  const dispatch = useDispatch();

  const {
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const [gasBaseFee, setGasBaseFee] = useState(0);
  const [nativeTokenPrice, setNativeTokenPrice] = useState<
    number | undefined
  >();

  const processBaseFee = async (result) => {
    if (result.status === '0') return;
    const baseFee = result.result;
    const baseFeeInDecimal = parseInt(baseFee, 16);
    setGasBaseFee(baseFeeInDecimal);
  };

  const fetchGasUnitAndBaseFee = useCallback(async () => {
    await Promise.all([
      axios
        .get(
          `${activeNetwork.blockExplorer.api}/api?module=proxy&action=eth_gasPrice`
        )
        .then((res) => processBaseFee(res.data))
        .catch(() => 0),

      getNativeTokenPrice(activeNetwork.chainId)
        .then((res) => setNativeTokenPrice(res))
        .catch(() => 0)
    ]);
  }, [activeNetwork]);

  useEffect(() => {
    if (activeNetwork.chainId) {
      void fetchGasUnitAndBaseFee();
    }
  }, [activeNetwork.chainId, fetchGasUnitAndBaseFee]);

  useEffect(() => {
    if (nativeTokenPrice && gasBaseFee) {
      dispatch(
        setGasDetails({
          gasMultipler: gasBaseFee + 2,
          nativeTokenPrice: nativeTokenPrice
        })
      );
    }
  }, [nativeTokenPrice, gasBaseFee]);

  return;
};

export default useGasDetails;

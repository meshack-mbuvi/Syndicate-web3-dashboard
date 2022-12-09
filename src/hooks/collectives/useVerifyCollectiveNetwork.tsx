import { useState, useEffect } from 'react';
import { getCollectiveName } from '@/utils/contracts/collective';
import { AppState } from '@/state';
import { useSelector } from 'react-redux';
import useIsPolygon from '@/hooks/collectives/useIsPolygon';

const useVerifyCollectiveNetwork = (
  collectiveAddress: string
): {
  correctCollectiveNetwork: boolean;
  checkingNetwork: boolean;
} => {
  const {
    web3Reducer: {
      web3: { activeNetwork, web3 }
    }
  } = useSelector((state: AppState) => state);

  const { isPolygon } = useIsPolygon();
  const [correctCollectiveNetwork, setCorrectCollectiveNetwork] =
    useState(true);
  const [checkingNetwork, setCheckingNetwork] = useState(false);

  useEffect(() => {
    // When a network switch happens, we have no way of telling whether
    // the collective belongs to the current network
    // we'll use the collective name to verify
    const verifyCollectiveNetwork = async (): Promise<void> => {
      setCheckingNetwork(true);

      // also redirect to empty state if active network is Polygon
      if (isPolygon) {
        setCorrectCollectiveNetwork(false);
        return;
      }
      try {
        await getCollectiveName(collectiveAddress as string, web3);
        setCorrectCollectiveNetwork(true);
      } catch (e) {
        setCorrectCollectiveNetwork(false);
      }
      setCheckingNetwork(false);
    };
    void verifyCollectiveNetwork();
  }, [activeNetwork?.chainId, collectiveAddress, isPolygon]);

  return { correctCollectiveNetwork, checkingNetwork };
};

export default useVerifyCollectiveNetwork;

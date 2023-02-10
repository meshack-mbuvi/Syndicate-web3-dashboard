import useIsPolygon from '@/hooks/collectives/useIsPolygon';
import { AppState } from '@/state';
import { getCollectiveName } from '@/utils/contracts/collective';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const useVerifyCollectiveNetwork = (
  collectiveAddress: string
): {
  correctCollectiveNetwork: boolean;
  checkingNetwork: boolean;
} => {
  const {
    web3Reducer: {
      web3: { activeNetwork, web3, account }
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
      if (account && web3) {
        try {
          await getCollectiveName(collectiveAddress as string, web3);
          setCorrectCollectiveNetwork(true);
        } catch (e) {
          setCorrectCollectiveNetwork(false);
        }
      }

      setCheckingNetwork(false);
    };
    void verifyCollectiveNetwork();
  }, [activeNetwork?.chainId, collectiveAddress, isPolygon, account]);

  return { correctCollectiveNetwork, checkingNetwork };
};

export default useVerifyCollectiveNetwork;

import { useState, useEffect } from 'react';
import { getDealOwner } from '@/utils/contracts/deal';
import { AppState } from '@/state';
import { useSelector } from 'react-redux';
import useIsPolygon from '../collectives/useIsPolygon';

const useVerifyDealNetwork = (
  dealAddress: string
): {
  isCorrectDealNetwork: boolean;
  isLoadingNetwork: boolean;
} => {
  const {
    web3Reducer: {
      web3: { web3, activeNetwork, account }
    }
  } = useSelector((state: AppState) => state);

  // TODO [ENG-4944]: remove check from verifyDealNetwork
  const { isPolygon } = useIsPolygon();
  const [isCorrectDealNetwork, setCorrectDealNetwork] = useState(true);
  const [isLoadingNetwork, setLoadingNetwork] = useState(false);

  useEffect(() => {
    let isMounted = true;
    // When a network switch happens, we have no way of telling whether
    // the deal belongs to the current network
    // we'll use the deal owner to verify
    const verifyDealNetwork = async (): Promise<void> => {
      setLoadingNetwork(true);

      // also redirect to empty state if active network is Polygon
      if (isPolygon) {
        setCorrectDealNetwork(false);
        return;
      }
      if (account) {
        try {
          await getDealOwner(dealAddress as string, web3, activeNetwork);
          if (isMounted) {
            setCorrectDealNetwork(true);
          }
        } catch (e) {
          if (isMounted) {
            setCorrectDealNetwork(false);
          }
        }
      }
      setLoadingNetwork(false);
    };
    void verifyDealNetwork();

    return () => {
      isMounted = false;
    };
  }, [activeNetwork?.chainId, dealAddress, isPolygon, account]);

  return { isCorrectDealNetwork, isLoadingNetwork };
};

export default useVerifyDealNetwork;

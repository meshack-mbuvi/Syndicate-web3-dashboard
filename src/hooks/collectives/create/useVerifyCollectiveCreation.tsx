import { GetAdminCollectives } from '@/graphql/queries';
import { AppState } from '@/state';
import { NetworkStatus, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDemoMode } from '../../useDemoMode';

const useVerifyCollectiveCreation = (
  skipQuery?: boolean
): {
  loading: boolean;
  verifyCreation: (collectiveAddress: string) => void;
  collectiveIndexed: boolean;
} => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork, web3 }
    }
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();
  const isDemoMode = useDemoMode();
  const router = useRouter();

  const [collectiveAddress, setCollectiveAddress] = useState<string>('');
  const [collectiveIndexed, setCollectiveIndexed] = useState(false);

  const { loading, data, startPolling, stopPolling, networkStatus } = useQuery(
    GetAdminCollectives,
    {
      variables: {
        where: {
          contractAddress_contains_nocase: collectiveAddress.toLowerCase()
        }
      },
      skip:
        !collectiveAddress ||
        !account ||
        !activeNetwork.chainId ||
        skipQuery ||
        isDemoMode,
      context: { clientName: 'theGraph', chainId: activeNetwork.chainId }
    }
  );

  const verifyCreation = async (collectiveAddress) => {
    // Verification will start once collectiveAddress is set
    setCollectiveAddress(collectiveAddress);
  };
  useEffect(() => {
    if (collectiveAddress) {
      startPolling(1000);
    }
  }, [collectiveAddress]);

  useEffect(() => {
    // check for demo mode to make sure correct things render
    if (!isDemoMode) {
      // check for network status as ready after query is over
      if (networkStatus !== NetworkStatus.ready) {
        return;
      }
      // check for query loading and data being non-null
      if (!data?.syndicateCollectives.length && !loading) {
        return;
      }
      stopPolling();
    } else {
      if (!data) {
        return;
      }
    }
    setCollectiveIndexed(true);
  }, [
    data,
    data?.syndicateCollectives,
    loading,
    router.isReady,
    loading,
    networkStatus
  ]);

  return { loading, verifyCreation, collectiveIndexed };
};

export default useVerifyCollectiveCreation;

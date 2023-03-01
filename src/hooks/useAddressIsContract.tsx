import { ADDRESS_IS_CONTRACT } from '@/graphql/backend_queries';
import { AppState } from '@/state';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';

const useAddressIsContract = (): {
  AddressIsContract: boolean | null;
  checkAddressIsContract: (address: string) => Promise<boolean>;
} => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();

  const walletAddress = useMemo(() => {
    if (account) return account.toLowerCase();
    return '';
  }, [account]);

  // Stores value for currently connected wallet
  const [AddressIsContract, setAddressIsContract] = useState<boolean | null>(
    null
  );

  const { data, refetch, loading, fetchMore } = useQuery(ADDRESS_IS_CONTRACT, {
    variables: {
      chainId: activeNetwork.chainId,
      address: walletAddress
    },
    context: {
      clientName: SUPPORTED_GRAPHS.BACKEND,
      chainId: activeNetwork.chainId
    },
    skip: !account || !router.isReady || !activeNetwork.chainId
  });

  useEffect(() => {
    if (!walletAddress || !activeNetwork.chainId) return;
    refetch({
      chainId: activeNetwork.chainId,
      address: walletAddress
    });
  }, [activeNetwork.chainId, walletAddress]);

  useEffect(() => {
    if (loading || !data?.account.address) return;
    setAddressIsContract(data?.account?.isContract);
  }, [loading, data]);

  // chec if any address is contract wallet
  const checkAddressIsContract = async (address: string) => {
    if (!address || !activeNetwork.chainId) return;
    const userResp = await fetchMore({
      variables: {
        chainId: activeNetwork.chainId,
        address: address
      }
    });
    return userResp.data?.account.isContract;
  };

  return { AddressIsContract, checkAddressIsContract };
};

export default useAddressIsContract;

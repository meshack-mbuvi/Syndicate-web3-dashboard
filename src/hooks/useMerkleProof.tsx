import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { Status } from '@/state/wallet/types';
import { getWeiAmount } from '@/utils/conversions';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetIndexAndProofQuery } from './data-fetching/backend/generated-types';
import { useDemoMode } from './useDemoMode';

export interface IMerkleProof {
  accountIndex: number;
  amount: string;
  merkleProof: [];
  account: string;
  treeIndex: number;
  _amount: string;
}

const emptyMerkleProof: IMerkleProof = {
  accountIndex: 0,
  amount: '',
  merkleProof: [],
  account: '',
  treeIndex: 0,
  _amount: ''
};

const useFetchMerkleProof = (): {
  merkleProofLoading: boolean;
  merkleProof: IMerkleProof;
} => {
  const {
    web3Reducer: {
      web3: { account: address, web3, activeNetwork, status }
    },
    erc20TokenSliceReducer: {
      erc20Token: { address: clubAddress, tokenDecimals }
    }
  } = useSelector((state: AppState) => state);

  const isDemoMode = useDemoMode();
  const router = useRouter();

  const [merkleProof, setMerkleProof] = useState(emptyMerkleProof);

  const {
    loading,
    data: merkleData,
    refetch: refetchMerkle
  } = useGetIndexAndProofQuery({
    variables: { clubAddress, address, chainId: activeNetwork.chainId },
    skip: !address || !clubAddress || !activeNetwork.chainId || isDemoMode,
    context: {
      clientName: SUPPORTED_GRAPHS.BACKEND,
      chainId: activeNetwork.chainId
    }
  });

  useEffect(() => {
    if (
      !activeNetwork.chainId ||
      !clubAddress ||
      !address ||
      status !== Status.CONNECTED
    )
      return;

    if (router.isReady && web3 && web3.utils.isAddress(clubAddress)) {
      void refetchMerkle();
    }
  }, [clubAddress, address, activeNetwork.chainId, status]);

  useEffect(() => {
    if (loading) return;

    if (
      merkleData &&
      merkleData.Financial_getIndexAndProof?.accountIndex &&
      merkleData?.Financial_getIndexAndProof?.accountIndex >= 0
    ) {
      const merkleObject =
        merkleData?.Financial_getIndexAndProof as IMerkleProof;
      setMerkleProof({
        ...merkleObject,
        account: address,
        _amount: getWeiAmount(merkleObject?.amount, tokenDecimals, false)
      });
    }
  }, [address, loading, JSON.stringify(merkleData)]);

  return { merkleProofLoading: loading, merkleProof };
};

export default useFetchMerkleProof;

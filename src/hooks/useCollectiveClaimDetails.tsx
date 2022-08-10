import { GetAdminCollectives } from '@/graphql/queries';
import { AppState } from '@/state';
import { setERC721Collective } from '@/state/erc721Collective';
import { useQuery } from '@apollo/client';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useCollectiveClaimDetails = () => {
  const dispatch = useDispatch();

  const {
    web3Reducer: { web3: web3Instance }
  } = useSelector((state: AppState) => state);

  const router = useRouter();
  const { collectiveAddress } = router.query;

  const { account, activeNetwork, web3, status } = web3Instance;
  const walletAddress = useMemo(() => account.toLowerCase(), [account]);

  const [isLoading, setIsLoading] = useState(true);

  // Retrieve collective details for claim page
  const { loading, refetch, data } = useQuery(GetAdminCollectives, {
    variables: {
      where: {
        contractAddress: collectiveAddress?.toString().toLowerCase()
      }
    },
    context: { clientName: 'theGraph', chainId: activeNetwork.chainId },
    skip:
      !walletAddress ||
      !router.isReady ||
      !activeNetwork.chainId ||
      !collectiveAddress
  });

  // Process collective details for claim page
  useEffect(() => {
    if (!data?.syndicateCollectives[0] || isEmpty(web3) || !walletAddress)
      return;

    setIsLoading(true);

    const {
      contractAddress,
      ownerAddress,
      createdAt,
      name,
      symbol,
      mintPrice,
      totalSupply,
      maxTotalSupply,
      maxPerMember,
      numOwners
    } = data?.syndicateCollectives[0];

    const collective = {
      contractAddress,
      ownerAddress,
      tokenName: name,
      tokenSymbol: symbol,
      createdAt,
      priceEth: mintPrice,
      totalSupply,
      totalUnclaimed: +maxTotalSupply ? +maxTotalSupply - +totalSupply : 0,
      maxTotalSupply,
      maxPerMember,
      numOwners,
      tokenImage: '/images/placeholderCollectiveThumbnail.svg'
    };

    dispatch(setERC721Collective(collective));
    setIsLoading(false);
  }, [
    walletAddress,
    activeNetwork,
    data?.syndicateCollectives,
    loading,
    status,
    web3,
    dispatch
  ]);

  return { loading: isLoading };
};

export default useCollectiveClaimDetails;

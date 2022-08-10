import { GetAdminCollectives } from '@/graphql/queries';
import { AppState } from '@/state';
import {
  setCollectiveDetails,
  setCollectiveLoadingState
} from '@/state/collectiveDetails';
import { getWeiAmount } from '@/utils/conversions';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDemoMode } from '../useDemoMode';

const useFetchCollectiveDetails = (
  skipQuery?: boolean
): { loading: boolean; collectiveNotFound: boolean } => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork, web3 }
    }
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();
  const isDemoMode = useDemoMode();
  const router = useRouter();
  const { collectiveAddress } = router.query;

  const [collectiveNotFound, setCollectiveNotFound] = useState(false);

  const { loading, data, refetch } = useQuery(GetAdminCollectives, {
    variables: {
      where: {
        contractAddress_contains_nocase: collectiveAddress
      }
    },
    skip:
      !collectiveAddress ||
      !account ||
      !activeNetwork.chainId ||
      skipQuery ||
      isDemoMode,
    context: { clientName: 'theGraph', chainId: activeNetwork.chainId }
  });

  useEffect(() => {
    if (account && collectiveAddress && activeNetwork.chainId) {
      refetch();
    }
  }, [account, collectiveAddress, activeNetwork.chainId]);

  useEffect(() => {
    if (loading) {
      dispatch(
        setCollectiveLoadingState({
          isFetchingCollective: true,
          collectiveNotFound: false
        })
      );

      return;
    }
    if (data && data.syndicateCollectives.length) {
      const collective =
        data.syndicateCollectives[data.syndicateCollectives.length - 1];
      const {
        mintPrice,
        ownerAddress,
        numMinted,
        numOwners,
        owners,
        name: collectiveName,
        symbol: collectiveSymbol,
        contractAddress: address,
        maxPerMember: maxPerWallet,
        totalSupply,
        maxTotalSupply,
        areNftsTransferable: isTransferable,
        nftMetadata: { description, metadataCid, mediaCid }
      } = collective;

      dispatch(
        setCollectiveDetails({
          collectiveName,
          ownerAddress,
          collectiveSymbol,
          maxPerWallet,
          maxTotalSupply,
          totalSupply,
          numMinted,
          numOwners,
          owners,
          isTransferable,
          collectiveAddress: address,
          mintPrice: getWeiAmount(web3, mintPrice, 18, false),
          isOpen: true, // TODO: get this from graph
          mintEndTime: '1667019540', // TODO: get this from graph
          ipfsHash: metadataCid,
          description,
          mediaCid
        })
      );
      setCollectiveNotFound(false);
      dispatch(
        setCollectiveLoadingState({
          isFetchingCollective: false,
          collectiveNotFound: false
        })
      );
    } else {
      setCollectiveNotFound(true);
      dispatch(
        setCollectiveLoadingState({
          isFetchingCollective: false,
          collectiveNotFound: true
        })
      );
    }
  }, [loading, JSON.stringify(data)]);

  return { loading, collectiveNotFound };
};

export default useFetchCollectiveDetails;

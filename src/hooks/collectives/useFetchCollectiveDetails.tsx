import { GetAdminCollectives } from '@/graphql/queries';
import { AppState } from '@/state';
import { setCollectiveDetails } from '@/state/collectiveDetails';
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
    if (data && data.syndicateCollectives.length) {
      const collective =
        data.syndicateCollectives[data.syndicateCollectives.length - 1];
      const {
        mintPrice,
        numMinted,
        numOwners,
        name: collectiveName,
        symbol: collectiveSymbol,
        contractAddress: address,
        maxPerMember: maxPerWallet,
        totalSupply,
        maxTotalSupply,
        areNftsTransferable: isTransferable
      } = collective;

      dispatch(
        setCollectiveDetails({
          collectiveName,
          collectiveSymbol,
          maxPerWallet,
          maxTotalSupply,
          totalSupply,
          numMinted,
          numOwners,
          isTransferable,
          collectiveAddress: address,
          mintPrice: getWeiAmount(web3, mintPrice, 18, false),
          isOpen: true, // TODO: get this from graph
          mintEndTime: '1667019540', // TODO: get this from graph
          ipfsHash: 'QmcRRRFWMZCZxsEZRAEfBp4XTrgo2MVcYWJp9vcTS9LNKi', // TODO: get this from graph
          description:
            'Alpha Beta Punks dreamcatcher vice affogato sartorial roof party unicorn wolf. Heirloom disrupt PBR&B normcore flexitarian bitters tote bag coloring book cornhole. Portland fixie forage selvage, disrupt +1 dreamcatcher meh ramps poutine stumptown letterpress lyft fam. Truffaut put a bird on it asymmetrical, gastropub master cleanse fingerstache succulents swag flexitarian bespoke thundercats kickstarter chartreuse.' // TODO: get this from graph
        })
      );
      setCollectiveNotFound(false);
    } else {
      setCollectiveNotFound(true);
    }
  }, [loading, JSON.stringify(data)]);

  return { loading, collectiveNotFound };
};

export default useFetchCollectiveDetails;

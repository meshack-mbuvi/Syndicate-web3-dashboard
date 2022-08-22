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
import { CollectiveCardType } from '@/state/collectiveDetails/types';

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
        createdAt,
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
        nftMetadata: { description, metadataCid, mediaCid },
        modules
      } = collective;

      let collectiveCardType;

      // set collective card type.
      modules[0]?.activeRequirements.map((activeRequirement) => {
        const { requirement } = activeRequirement;
        const { endTime, requirementType } = requirement;

        if (
          +endTime > 0 &&
          requirementType === CollectiveCardType.TIME_WINDOW
        ) {
          collectiveCardType = CollectiveCardType.TIME_WINDOW;
          return;
        } else if (requirementType === CollectiveCardType.MAX_TOTAL_SUPPLY) {
          collectiveCardType = CollectiveCardType.MAX_TOTAL_SUPPLY;
          return;
        } else {
          collectiveCardType = CollectiveCardType.OPEN_UNTIL_CLOSED;
        }
      });

      modules[0]?.activeRequirements.map((activeRequirement) => {
        const { requirement } = activeRequirement;
        const { requirementType } = requirement;
        // case where time is chosen upon creation
        if (requirementType === 'TIME_WINDOW') {
          const currentTime = Date.now();
          const endTime =
            collective.modules[0].activeRequirements[1].requirement.endTime;
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
              createdAt,
              owners,
              isTransferable,
              collectiveAddress: address,
              mintPrice: getWeiAmount(web3, mintPrice, 18, false),
              // default is open only when endTime has not past yet, otherwise default is closed
              isOpen: currentTime / 1000 < endTime,
              mintEndTime: endTime,
              maxSupply: 0,
              metadataCid,
              description,
              mediaCid,
              collectiveCardType
            })
          );
        } else {
          const currentTime = Date.now();
          const currentMaxTotalSupply =
            collective.modules[0].activeRequirements[1].requirement
              .maxTotalSupply;
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
              createdAt,
              owners,
              isTransferable,
              collectiveAddress: address,
              mintPrice: getWeiAmount(web3, mintPrice, 18, false),
              // default is open only when totalSupply < maxTotalSupply, otherwise default is closed
              isOpen: totalSupply < maxTotalSupply,
              mintEndTime: String(Math.ceil(currentTime / 1000)),
              maxSupply: currentMaxTotalSupply,
              metadataCid,
              description,
              mediaCid,
              collectiveCardType
            })
          );
        }
      });

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

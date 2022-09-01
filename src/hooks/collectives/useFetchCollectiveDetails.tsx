import { GetAdminCollectives, GetERC721MemberEvents } from '@/graphql/queries';
import { AppState } from '@/state';
import {
  setCollectiveDetails,
  setCollectiveLoadingState,
  setMemberJoinedEvents,
  setLoadingMemberJoinedEvents
} from '@/state/collectiveDetails';
import { getWeiAmount } from '@/utils/conversions';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDemoMode } from '../useDemoMode';
import { CollectiveCardType } from '@/state/collectiveDetails/types';
import { CONTRACT_ADDRESSES } from '@/Networks';
import { CollectiveActivityType } from '@/components/collectives/activity';

const useFetchCollectiveDetails = (
  skipQuery?: boolean
): { loading: boolean; collectiveNotFound: boolean; refetch: () => void } => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork, web3 }
    }
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();
  const isDemoMode = useDemoMode();
  const router = useRouter();
  const { collectiveAddress } = router.query;
  const MINT_MODULE =
    CONTRACT_ADDRESSES[activeNetwork.chainId]?.EthPriceMintModule;

  const [collectiveNotFound, setCollectiveNotFound] = useState(false);

  // get collective details
  const { loading, data, refetch } = useQuery(GetAdminCollectives, {
    variables: {
      where: {
        contractAddress_contains_nocase: collectiveAddress
      }
    },
    skip:
      !collectiveAddress || !activeNetwork.chainId || skipQuery || isDemoMode,
    context: { clientName: 'theGraph', chainId: activeNetwork.chainId }
  });

  // get collective member joined events
  const {
    loading: loadingEvents,
    data: eventsData,
    refetch: refetchMemberEvents
  } = useQuery(GetERC721MemberEvents, {
    variables: {
      where: {
        collective_contains_nocase: collectiveAddress
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
      refetchMemberEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, collectiveAddress, activeNetwork.chainId]);

  // process member joined events
  useEffect(() => {
    if (loadingEvents) {
      dispatch(setLoadingMemberJoinedEvents(true));
      return;
    }

    if (eventsData && eventsData.mintERC721S.length) {
      const memberJoinedEvents = eventsData.mintERC721S.map((event) => {
        const { to, createdAt } = event;
        return {
          activityType: CollectiveActivityType.RECEIVED,
          profile: {
            address: to
          },
          timeStamp: createdAt
        };
      });
      dispatch(setMemberJoinedEvents(memberJoinedEvents));
      dispatch(setLoadingMemberJoinedEvents(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(eventsData), loadingEvents]);

  // process collective details
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
        activeModules
      } = collective;

      let collectiveCardType,
        mintEndTime,
        isOpen = true,
        maxSupply = 0;

      // set collective card type and check if collective is active
      activeModules.map((module) => {
        const { contractAddress, activeRequirements } = module;
        if (
          web3.utils.toChecksumAddress(contractAddress) ===
          web3.utils.toChecksumAddress(MINT_MODULE)
        ) {
          activeRequirements.map((activeRequirement) => {
            const { requirement } = activeRequirement;
            const { endTime, requirementType } = requirement;

            if (
              +endTime > 0 &&
              requirementType === CollectiveCardType.TIME_WINDOW
            ) {
              collectiveCardType = CollectiveCardType.TIME_WINDOW;
              mintEndTime = String(endTime);
              isOpen =
                parseInt((new Date().getTime() / 1000).toString()) < +endTime;
              return;
            } else if (
              requirementType === CollectiveCardType.MAX_TOTAL_SUPPLY
            ) {
              const currentTime = Date.now();
              collectiveCardType = CollectiveCardType.MAX_TOTAL_SUPPLY;
              isOpen = +totalSupply < +maxTotalSupply;
              mintEndTime = String(Math.ceil(currentTime / 1000));
              maxSupply = maxTotalSupply;
              return;
            }
          });

          return;
        }
      });

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
          isOpen,
          mintEndTime,
          maxSupply,
          metadataCid,
          description,
          mediaCid,
          collectiveCardType
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

  return { loading, collectiveNotFound, refetch };
};

export default useFetchCollectiveDetails;

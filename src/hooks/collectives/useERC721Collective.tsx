import useVerifyCollectiveNetwork from '@/hooks/collectives/useVerifyCollectiveNetwork';
import {
  RequirementType,
  useSyndicateCollectivesQuery
} from '@/hooks/data-fetching/thegraph/generated-types';
import { CONTRACT_ADDRESSES } from '@/Networks';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { getCollectiveName } from '@/utils/contracts/collective';
import { getWeiAmount } from '@/utils/conversions';
import { getFirstOrString } from '@/utils/stringUtils';
import { NetworkStatus } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDemoMode } from '../useDemoMode';
import { ICollectiveDetails } from './utils/types';

const emptyCollective: Partial<ICollectiveDetails> = {
  collectiveName: '',
  ownerAddress: '',
  collectiveSymbol: '',
  maxTotalSupply: '',
  totalSupply: '',
  createdAt: '',
  numOwners: '',
  owners: [],
  mintPrice: '',
  isTransferable: false,
  mintEndTime: '',
  maxSupply: 0,
  description: '',
  isOpen: false,
  metadataCid: '',
  mediaCid: '',
  collectiveCardType: RequirementType.TimeWindow,
  custom: {}
};

export interface ICollectiveDetailsResponse {
  collectiveDetails: Partial<ICollectiveDetails>;
  collectiveDetailsLoading: boolean;
  collectiveNotFound: boolean;
  correctCollectiveNetwork: boolean;
}

const useERC721Collective = (): ICollectiveDetailsResponse => {
  const {
    web3Reducer: {
      web3: { activeNetwork, web3 }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();

  const collectiveAddress = getFirstOrString(router.query.collectiveAddress);

  const isDemoMode = useDemoMode();
  const { correctCollectiveNetwork, checkingNetwork } =
    useVerifyCollectiveNetwork(collectiveAddress as string);

  const MINT_MODULE =
    CONTRACT_ADDRESSES[activeNetwork.chainId]?.EthPriceMintModule;

  const CUSTOM_MERKLE_MINT =
    CONTRACT_ADDRESSES[activeNetwork.chainId]?.nativeTokenPriceMerkleMintModule;

  const [collectiveDetails, setCollectiveDetails] =
    useState<Partial<ICollectiveDetails>>(emptyCollective);
  const [collectiveNotFound, setCollectiveNotFound] = useState(false);

  // get collective details
  const { loading, data, startPolling, stopPolling, networkStatus } =
    useSyndicateCollectivesQuery({
      variables: {
        where: {
          contractAddress_contains_nocase: collectiveAddress
        }
      },
      skip: !collectiveAddress || !activeNetwork.chainId || isDemoMode,
      context: {
        clientName: SUPPORTED_GRAPHS.THE_GRAPH,
        chainId: activeNetwork.chainId
      }
    });

  // process collective details
  // NOTE: Usually we want useMemo here, but since we need to verify if a collective exists we need more complicated logic
  useEffect(() => {
    if (loading) {
      return;
    }

    if (data && data.syndicateCollectives.length) {
      stopPolling();

      const collective =
        data.syndicateCollectives[data.syndicateCollectives.length - 1];

      const { description, metadataCid, mediaCid } =
        collective.nftMetadata || {};
      const {
        mintPrice,
        createdAt,
        ownerAddress,
        numOwners,
        owners,
        contractAddress,
        name: collectiveName,
        symbol: collectiveSymbol,
        maxPerMember,
        totalSupply,
        maxTotalSupply,
        transferGuardAddress,
        activeModules
      } = collective;

      let collectiveCardType = RequirementType.TimeWindow,
        mintEndTime = '',
        isOpen = true,
        maxSupply = 0,
        custom = {};

      // set collective card type and check if collective is active
      activeModules.map((module) => {
        const { contractAddress, activeRequirements } = module;
        if (
          web3 &&
          MINT_MODULE &&
          web3.utils.toChecksumAddress(contractAddress) ===
            web3.utils.toChecksumAddress(MINT_MODULE)
        ) {
          activeRequirements.map((activeRequirement) => {
            const { requirement } = activeRequirement;
            const { endTime, requirementType } = requirement;

            if (
              +endTime > 0 &&
              requirementType === RequirementType.TimeWindow
            ) {
              collectiveCardType = RequirementType.TimeWindow;
              mintEndTime = String(endTime);
              isOpen =
                parseInt((new Date().getTime() / 1000).toString()) < +endTime;
              return;
            } else if (requirementType === RequirementType.MaxTotalSupply) {
              const currentTime = Date.now();
              collectiveCardType = RequirementType.MaxTotalSupply;
              isOpen = +totalSupply < +maxTotalSupply;
              mintEndTime = String(Math.ceil(currentTime / 1000));
              maxSupply = maxTotalSupply;
              return;
            }
          });

          return;
        }

        if (
          web3 &&
          web3.utils.toChecksumAddress(contractAddress) ===
            web3.utils.toChecksumAddress(CUSTOM_MERKLE_MINT)
        ) {
          custom = { merkle: true };
          activeRequirements.map((activeRequirement) => {
            const {
              requirement: { endTime, requirementType }
            } = activeRequirement;

            if (
              +endTime > 0 &&
              requirementType === RequirementType.TimeWindow
            ) {
              collectiveCardType = RequirementType.TimeWindow;
              mintEndTime = String(endTime);
              isOpen =
                parseInt((new Date().getTime() / 1000).toString()) < +endTime;
              return;
            } else if (requirementType === RequirementType.MaxTotalSupply) {
              const currentTime = Date.now();
              collectiveCardType = RequirementType.MaxTotalSupply;
              isOpen = +totalSupply < +maxTotalSupply;
              mintEndTime = String(Math.ceil(currentTime / 1000));
              maxSupply = maxTotalSupply;
              return;
            }
          });

          return;
        }
      });

      setCollectiveDetails({
        collectiveName: collectiveName || '',
        ownerAddress,
        collectiveSymbol,
        maxPerMember: maxPerMember as number,
        maxTotalSupply: maxTotalSupply as number,
        totalSupply: totalSupply as number,
        numOwners: numOwners as number,
        createdAt,
        contractAddress,
        owners,
        isTransferable:
          transferGuardAddress.toString().toLocaleLowerCase() ==
          CONTRACT_ADDRESSES[
            activeNetwork.chainId
          ]?.GuardAlwaysAllow.toString().toLocaleLowerCase(),
        mintPrice: getWeiAmount(mintPrice, 18, false),
        isOpen,
        mintEndTime,
        maxSupply,
        metadataCid: metadataCid || '',
        description: description || '',
        mediaCid: mediaCid || '',
        collectiveCardType,
        custom
      });
    } else {
      void verifyNotFound();
    }
  }, [loading, data, activeNetwork?.chainId, MINT_MODULE]);

  const verifyNotFound = async (): Promise<void> => {
    if (!web3) return;

    const collectiveName = await getCollectiveName(
      collectiveAddress as string,
      web3
    );

    if (!collectiveName) {
      stopPolling();
      setCollectiveNotFound(true);
    } else {
      if (networkStatus === NetworkStatus.ready) {
        startPolling(1000);
      }
      setCollectiveDetails({
        ...emptyCollective,
        collectiveName: collectiveName as string,
        contractAddress: collectiveAddress as string
      });
    }
  };

  return {
    collectiveDetails,
    // If collectiveNotFound is false and the collective details is not set yet, we can assume we are either :
    // 1) still processing the response from the graph
    // 2) or still polling the graph for data
    // In either case the UI should still show a loading interface
    collectiveDetailsLoading:
      (!collectiveNotFound && collectiveDetails.collectiveSymbol === '') ||
      checkingNetwork,
    collectiveNotFound,
    correctCollectiveNetwork
  };
};

export default useERC721Collective;

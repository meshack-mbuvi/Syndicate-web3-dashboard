import { GetAdminCollectives } from '@/graphql/queries';
import { AppState } from '@/state';
import { getWeiAmount } from '@/utils/conversions';
import { NetworkStatus, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useDemoMode } from '../useDemoMode';
import { CollectiveCardType } from '@/state/modifyCollectiveSettings/types';
import { CONTRACT_ADDRESSES } from '@/Networks';
import { getCollectiveName } from '@/utils/contracts/collective';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import useVerifyCollectiveNetwork from '@/hooks/collectives/useVerifyCollectiveNetwork';

export interface ICollectiveDetails {
  collectiveName: string;
  ownerAddress: string;
  collectiveSymbol: string;
  collectiveAddress: string;
  maxPerWallet: string;
  maxTotalSupply: string;
  totalSupply: string;
  createdAt: any;
  numOwners: string;
  owners: any;
  mintPrice: string;
  isTransferable: boolean;
  mintEndTime: string;
  maxSupply: number;
  description: string;
  isOpen: boolean;
  metadataCid: string;
  mediaCid: string;
  collectiveCardType: CollectiveCardType;
  custom?: any;
}

const emptyCollective: ICollectiveDetails = {
  collectiveName: '',
  ownerAddress: '',
  collectiveSymbol: '',
  collectiveAddress: '',
  maxPerWallet: '',
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
  collectiveCardType: CollectiveCardType.TIME_WINDOW,
  custom: {}
};

export interface ICollectiveDetailsResponse {
  collectiveDetails: ICollectiveDetails;
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
  const {
    query: { collectiveAddress }
  } = router;

  const isDemoMode = useDemoMode();
  const { correctCollectiveNetwork, checkingNetwork } =
    useVerifyCollectiveNetwork(collectiveAddress as string);

  const MINT_MODULE =
    CONTRACT_ADDRESSES[activeNetwork.chainId]?.EthPriceMintModule;

  const CUSTOM_MERKLE_MINT =
    CONTRACT_ADDRESSES[activeNetwork.chainId]?.nativeTokenPriceMerkleMintModule;

  const [collectiveDetails, setCollectiveDetails] =
    useState<ICollectiveDetails>(emptyCollective);
  const [collectiveNotFound, setCollectiveNotFound] = useState(false);

  // get collective details
  const { loading, data, startPolling, stopPolling, networkStatus } = useQuery(
    GetAdminCollectives,
    {
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
    }
  );

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
      const {
        mintPrice,
        createdAt,
        ownerAddress,
        numOwners,
        owners,
        name: collectiveName,
        symbol: collectiveSymbol,
        contractAddress: address,
        maxPerMember: maxPerWallet,
        totalSupply,
        maxTotalSupply,
        transferGuardAddress,
        nftMetadata: { description, metadataCid, mediaCid },
        activeModules
      } = collective;

      let collectiveCardType = CollectiveCardType.TIME_WINDOW,
        mintEndTime = '',
        isOpen = true,
        maxSupply = 0,
        custom = {};

      // set collective card type and check if collective is active
      activeModules.map((module: any) => {
        const { contractAddress, activeRequirements } = module;
        if (
          MINT_MODULE &&
          web3.utils.toChecksumAddress(contractAddress) ===
            web3.utils.toChecksumAddress(MINT_MODULE)
        ) {
          activeRequirements.map((activeRequirement: any) => {
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

        if (
          web3.utils.toChecksumAddress(contractAddress) ===
          web3.utils.toChecksumAddress(CUSTOM_MERKLE_MINT)
        ) {
          custom = { merkle: true };
          activeRequirements.map((activeRequirement: any) => {
            const {
              requirement: { endTime, requirementType }
            } = activeRequirement;

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

      setCollectiveDetails({
        collectiveName,
        ownerAddress,
        collectiveSymbol,
        maxPerWallet,
        maxTotalSupply,
        totalSupply,
        numOwners,
        createdAt,
        owners,
        isTransferable:
          transferGuardAddress.toString().toLocaleLowerCase() ==
          CONTRACT_ADDRESSES[
            activeNetwork.chainId
          ]?.GuardAlwaysAllow.toString().toLocaleLowerCase(),
        collectiveAddress: address,
        mintPrice: getWeiAmount(web3, mintPrice, 18, false),
        isOpen,
        mintEndTime,
        maxSupply,
        metadataCid,
        description,
        mediaCid,
        collectiveCardType,
        custom
      });
    } else {
      verifyNotFound();
    }
  }, [loading, data, activeNetwork?.chainId, MINT_MODULE]);

  const verifyNotFound = async () => {
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
        collectiveAddress: collectiveAddress as string
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

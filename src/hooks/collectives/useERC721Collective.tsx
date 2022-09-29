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
}
// export interface ICollectiveDetails {
//   collectiveName?: string;
//   ownerAddress?: string;
//   collectiveSymbol?: string;
//   collectiveAddress?: string;
//   maxPerWallet?: string;
//   maxTotalSupply?: string;
//   totalSupply?: string;
//   createdAt?: any;
//   numOwners?: string;
//   owners?: any;
//   mintPrice?: string;
//   isTransferable?: boolean;
//   mintEndTime?: string;
//   maxSupply?: number;
//   description?: string;
//   isOpen?: boolean;
//   metadataCid?: string;
//   mediaCid?: string;
//   collectiveCardType?: CollectiveCardType;
// }

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
  collectiveCardType: CollectiveCardType.TIME_WINDOW
};

export interface ICollectiveDetailsResponse {
  collectiveDetails: ICollectiveDetails;
  collectiveDetailsLoading: boolean;
  collectiveNotFound: boolean;
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

  const MINT_MODULE =
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    CONTRACT_ADDRESSES[activeNetwork.chainId]?.EthPriceMintModule;

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
      context: { clientName: 'theGraph', chainId: activeNetwork.chainId }
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
        maxSupply = 0;

      // set collective card type and check if collective is active
      activeModules.map((module: any) => {
        const { contractAddress, activeRequirements } = module;
        if (
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
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
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
        collectiveCardType
      });
    } else {
      verifyNotFound();
    }
  }, [loading, data]);

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
      !collectiveNotFound && collectiveDetails.collectiveSymbol === '',
    collectiveNotFound
  };
};

export default useERC721Collective;

import { GetDealDetails } from '@/graphql/queries';
import { AppState } from '@/state';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useDemoMode } from '../useDemoMode';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';

export interface IDealDetails {
  dealName: string;
  ownerAddress: string;
  dealToken: string;
  depositToken: string;
  dealDestination: string;
  totalCommitments: string;
  totalCommited: string;
  createdAt: any;
}

const emptyDeal: IDealDetails = {
  dealName: '',
  ownerAddress: '',
  dealToken: '',
  depositToken: '',
  dealDestination: '',
  totalCommitments: '',
  totalCommited: '',
  createdAt: ''
};

export interface IDealDetailsResponse {
  dealDetails: IDealDetails;
  dealDetailsLoading: boolean;
  dealNotFound: boolean;
  //   dealNetwork: boolean;
}

const useDealsDetails = (): IDealDetailsResponse => {
  const {
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();
  const {
    query: { dealAddress }
  } = router;

  const isDemoMode = useDemoMode();

  const [dealDetails, setDealDetails] = useState<IDealDetails>(emptyDeal);
  const [dealNotFound, setDealNotFound] = useState(false);

  // get deal details
  const { loading, data } = useQuery(GetDealDetails, {
    variables: {
      where: {
        contractAddress_contains_nocase: dealAddress
      }
    },
    // TODO: Remove hardcoded "true" when subgraph is ready
    skip: !dealAddress || !activeNetwork.chainId || isDemoMode || true,
    context: {
      clientName: SUPPORTED_GRAPHS.THE_GRAPH,
      chainId: activeNetwork.chainId
    }
  });

  // process deal details
  useEffect(() => {
    if (loading) {
      return;
    }

    if (data) {
      // TODO: Proccess results from query
      // setDealDetails({...});
    }

    // TODO: Remove when subgraph is ready
    setDealDetails({
      dealName: 'Dummy Deal',
      ownerAddress: '0xb6235EAEADfA5839CdA207B454d98b328dFE2F3A',
      dealToken: '0xdeal',
      depositToken: '0xb6e77703b036bfb97dd40a22f021a85ae4a6d750', // Dummy USDC
      dealDestination: '0xb6235EAEADfA5839CdA207B454d98b328dFE2F3A',
      totalCommitments: '3',
      totalCommited: '5000',
      createdAt: '1669731360'
    });
    setDealNotFound(false);
  }, [loading, data, activeNetwork?.chainId]);

  return {
    dealDetails,
    dealDetailsLoading: !dealNotFound && dealDetails.dealName === '',
    dealNotFound
    // correctDealNetwork
  };
};

export default useDealsDetails;

import Layout from '@/components/layout';
import { Spinner } from '@/components/shared/spinner';
import MemberLegalAgreement from '@/components/syndicates/memberLegalAgreement';
import Head from '@/components/syndicates/shared/HeaderTitle';
import WalletNotConnected from '@/components/walletNotConnected';
import { CLUB_TOKEN_QUERY } from '@/graphql/subgraph_queries';
import { getDepositDetails } from '@/helpers/erc20TokenDetails';
import { useClubDepositsAndSupply } from '@/hooks/clubs/useClubDepositsAndSupply';
import { useConnectedAccountDetails } from '@/hooks/useConnectedAccountDetails';
import { useDemoMode } from '@/hooks/useDemoMode';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { setERC20TokenDepositDetails } from '@/state/erc20token/slice';
import { mockDepositERC20Token } from '@/utils/mockdata';
import { NetworkStatus, useQuery } from '@apollo/client';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const SignMemberLegalAgreement: NextPage = () => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork }
    },
    initializeContractsReducer: {
      syndicateContracts: { SingleTokenMintModule, DepositTokenMintModule }
    },
    erc20TokenSliceReducer: {
      erc20TokenContract,
      erc20Token: { loading },
      depositDetails: { loading: loadingDepositSymbol },
      activeModuleDetails
    }
  } = useSelector((state: AppState) => state);
  const router = useRouter();
  const isDemoMode = useDemoMode();

  const [dataLoading, setDataLoading] = useState(true);

  const clubAddress = router.query?.clubAddress?.toString();

  const {
    loading: queryLoading,
    data,
    networkStatus,
    stopPolling
  } = useQuery(CLUB_TOKEN_QUERY, {
    variables: {
      syndicateDaoId: clubAddress?.toLocaleLowerCase()
    },
    context: {
      clientName: SUPPORTED_GRAPHS.THE_GRAPH,
      chainId: activeNetwork.chainId
    },
    notifyOnNetworkStatusChange: true,
    skip: !clubAddress || loading || !activeNetwork.chainId,
    fetchPolicy: 'no-cache'
  });

  // Load club details if we are on the club page
  const dispatch = useDispatch();

  const { totalDeposits, refetch: refetchSingleClubDetails } =
    // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    useClubDepositsAndSupply(clubAddress);

  const { memberDeposits, loadingMemberOwnership } =
    useConnectedAccountDetails();

  useEffect(() => {
    // check for demo mode to make sure correct things render
    if (!isDemoMode) {
      // check for network status as ready after query is over
      if (networkStatus !== NetworkStatus.ready) {
        return;
      }
      // check for query loading and data being non-null
      if (!data?.syndicateDAO && !queryLoading) {
        return;
      }
      stopPolling();
      // fallback for if single club details query doesn't initally work
      if (!totalDeposits) {
        refetchSingleClubDetails();
        return;
      }
    } else {
      if (!data) {
        return;
      }
    }

    const { depositToken } = data.syndicateDAO || {};

    async function fetchDepositDetails() {
      let depositDetails;

      if (isDemoMode) {
        depositDetails = mockDepositERC20Token;
      } else {
        depositDetails = await getDepositDetails(
          depositToken,
          erc20TokenContract,
          DepositTokenMintModule,
          SingleTokenMintModule,
          activeModuleDetails?.mintModule,
          activeNetwork
        );
      }

      dispatch(
        // @ts-expect-error TS(2345): Argument of type '{ loading: false; mintModule: st... Remove this comment to see the full error message
        setERC20TokenDepositDetails({
          ...depositDetails,
          loading: false
        })
      );
      setDataLoading(false);
    }
    fetchDepositDetails();

    return () => {
      setDataLoading(true);
    };
  }, [
    data,
    data?.syndicateDAO?.depositToken,
    loading,
    router.isReady,
    queryLoading,
    networkStatus,
    totalDeposits,
    activeModuleDetails?.mintModule
  ]);

  const navItems = [
    {
      url: `/clubs/${clubAddress}${'?chain=' + activeNetwork.network}`,
      navItemText: 'Exit'
    },
    {
      navItemText: 'Sign legal agreements',
      isLegal: true
    }
  ];

  return (
    <Layout navItems={navItems}>
      <Head title="Member legal agreement" />
      {!account ? (
        <WalletNotConnected />
      ) : loading ||
        loadingDepositSymbol ||
        loadingMemberOwnership ||
        queryLoading ||
        !router.isReady ||
        dataLoading ? (
        <div>
          <Spinner />
        </div>
      ) : (
        <MemberLegalAgreement memberDeposits={memberDeposits} />
      )}
    </Layout>
  );
};

export default SignMemberLegalAgreement;

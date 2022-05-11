import Layout from '@/components/layout';
import { Spinner } from '@/components/shared/spinner';
import MemberLegalAgreement from '@/components/syndicates/memberLegalAgreement';
import Head from '@/components/syndicates/shared/HeaderTitle';
import WalletNotConnected from '@/components/walletNotConnected';
import { CLUB_TOKEN_QUERY } from '@/graphql/queries';
import { getDepositDetails } from '@/helpers/erc20TokenDetails';
import { useClubDepositsAndSupply } from '@/hooks/useClubDepositsAndSupply';
import { useDemoMode } from '@/hooks/useDemoMode';
import { AppState } from '@/state';
import { setERC20TokenDepositDetails } from '@/state/erc20token/slice';
import { mockDepositERC20Token } from '@/utils/mockdata';
import { NetworkStatus, useQuery } from '@apollo/client';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const SignMemberLegalAgreement: NextPage = () => {
  const {
    web3Reducer: {
      web3: { account }
    },
    initializeContractsReducer: {
      syndicateContracts: { SingleTokenMintModule, DepositTokenMintModule }
    },
    erc20TokenSliceReducer: {
      erc20TokenContract,
      erc20Token: { loading },
      depositDetails: { loading: loadingDepositSymbol }
    }
  } = useSelector((state: AppState) => state);
  const router = useRouter();
  const isDemoMode = useDemoMode();

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
    notifyOnNetworkStatusChange: true,
    skip: !clubAddress || loading,
    fetchPolicy: 'no-cache'
  });

  // Load club details if we are on the club page
  const dispatch = useDispatch();

  const { totalDeposits, refetch: refetchSingleClubDetails } =
    useClubDepositsAndSupply(clubAddress);

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

    console.log('here');

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
          SingleTokenMintModule
        );
      }

      dispatch(
        setERC20TokenDepositDetails({
          ...depositDetails,
          loading: false
        })
      );
    }
    fetchDepositDetails();
  }, [
    data,
    data?.syndicateDAO,
    loading,
    router.isReady,
    queryLoading,
    networkStatus,
    totalDeposits
  ]);
  const navItems = [
    {
      url: `/clubs/${clubAddress}`,
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
      ) : loading || loadingDepositSymbol ? (
        <div>
          <Spinner />
        </div>
      ) : (
        <MemberLegalAgreement />
      )}
    </Layout>
  );
};

export default SignMemberLegalAgreement;

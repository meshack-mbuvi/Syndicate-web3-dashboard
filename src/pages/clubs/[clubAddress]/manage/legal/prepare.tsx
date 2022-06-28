import Layout from '@/components/layout';
import CreateAgreementComponent from '@/components/syndicates/CreateAgreement';
import Head from '@/components/syndicates/shared/HeaderTitle';
import WalletNotConnected from '@/components/walletNotConnected';
import { AppState } from '@/state';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';

/**
 * This page shows the manager component for a given syndicate address
 */
const CreateAgreementPage: NextPage = () => {
  const { account, activeNetwork } = useSelector(
    (state: AppState) => state?.web3Reducer?.web3
  );

  const router = useRouter();
  const { clubAddress } = router.query;

  const navItems = [
    {
      url: `/clubs/${clubAddress}/manage${'?chain=' + activeNetwork.network}`,
      navItemText: 'Exit'
    },
    {
      navItemText: 'Prepare legal documents',
      isLegal: true
    }
  ];

  return (
    <Layout navItems={navItems}>
      <Head title="Prepare legal Documents" />

      {!account ? <WalletNotConnected /> : <CreateAgreementComponent />}
    </Layout>
  );
};

export default CreateAgreementPage;

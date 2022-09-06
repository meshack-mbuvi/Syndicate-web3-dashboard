import Layout from '@/components/layout';
import Head from '@/components/syndicates/shared/HeaderTitle';
import SignAgreement from '@/components/syndicates/shared/signAgreement';
import WalletNotConnected from '@/components/walletNotConnected';
import SendForSignatures from '@/containers/managerActions/SendForSignatures';
import { AppState } from '@/state';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { SEND_FOR_SIGNATURES_CLICK } from '@/components/amplitude/eventNames';
import { Flow, amplitudeLogger } from '@/components/amplitude';

const ManagerAgreementPage: NextPage = () => {
  const router = useRouter();
  const { clubAddress } = router.query;

  const { account, activeNetwork } = useSelector(
    (state: AppState) => state.web3Reducer.web3
  );
  const clubInfo = useSelector(
    (state: AppState) => state.legalInfoReducer.clubInfo
  );

  const [showSendForSignaturesModal, setShowSendForSignaturesModal] =
    useState(false);

  const navbarItems = [
    {
      url: `/clubs/${clubAddress}/manage${'?chain=' + activeNetwork.network}`,
      navItemText: 'Exit'
    },
    {
      navItemText: 'Prepare legal documents',
      isLegal: true
    }
  ];

  const handleSendForSignature = () => {
    setShowSendForSignaturesModal(true);
    amplitudeLogger(SEND_FOR_SIGNATURES_CLICK, {
      flow: Flow.CLUB_LEGAL
    });
  };

  return (
    <Layout navItems={navbarItems}>
      <Head title="Sign legal Documents" />
      {!account ? (
        <WalletNotConnected />
      ) : (
        <>
          <SignAgreement
            handleSignatureSuccess={handleSendForSignature}
            fieldInfo={clubInfo}
            isManager={true}
          />
          <SendForSignatures
            showSendForSignaturesModal={showSendForSignaturesModal}
            setShowSendForSignaturesModal={setShowSendForSignaturesModal}
          />
        </>
      )}
    </Layout>
  );
};

export default ManagerAgreementPage;

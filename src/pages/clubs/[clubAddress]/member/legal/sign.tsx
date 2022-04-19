import Layout from '@/components/layout';
import Head from '@/components/syndicates/shared/HeaderTitle';
import SignAgreement from '@/components/syndicates/shared/signAgreement';
import WalletNotConnected from '@/components/walletNotConnected';
import { AppState } from '@/state';
import { getTemplates } from '@/utils/templates';
import axios from 'axios';
import moment from 'moment';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';

const MemberAgreementPage: NextPage = () => {
  const router = useRouter();
  const { clubAddress } = router.query;

  const {
    legalInfoReducer: { memberInfo, clubInfo, walletSignature },
    web3Reducer: {
      web3: { account }
    }
  } = useSelector((state: AppState) => state);

  const navbarItems = [
    {
      url: `/clubs/${clubAddress}`,
      navItemText: 'Exit'
    },
    {
      navItemText: 'Sign legal documents',
      isLegal: true
    }
  ];

  const signHandler = () => {
    // Render Final Docs :
    const data = {
      ...memberInfo,
      ...clubInfo,
      clubTokenAddress: clubAddress,
      memberSignature: walletSignature.signature,
      memberSignDate: moment(walletSignature.timeSigned).format('LL')
    };

    const { compiledOp, compiledSub } = getTemplates(clubInfo.isSeriesLLC);

    const operatingAgreement = compiledOp(data);
    const subscriptionAgreement = compiledSub(data);

    axios.post(`/.netlify/functions/emailSignedDocuments`, {
      legalEntityName: clubInfo.legalEntityName,
      clubAddress,
      operatingAgreement,
      subscriptionAgreement,
      managerName: clubInfo.adminName,
      managerEmail: clubInfo.managerEmail,
      memberName: memberInfo.memberName,
      memberEmail: memberInfo.emailAddress
    });

    router.push(`/clubs/${clubAddress}`);
  };

  return (
    <Layout navItems={navbarItems}>
      <Head title="Sign legal Documents" />
      {!account ? (
        <WalletNotConnected />
      ) : (
        <SignAgreement
          fieldInfo={{ ...memberInfo, ...clubInfo }}
          isManager={false}
          handleSignatureSuccess={signHandler}
        />
      )}
    </Layout>
  );
};

export default MemberAgreementPage;

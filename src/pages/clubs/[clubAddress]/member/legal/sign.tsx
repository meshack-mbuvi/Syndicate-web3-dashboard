import { CtaButton } from '@/components/CTAButton';
import Layout from '@/components/layout';
import Modal, { ModalStyle } from '@/components/modal';
import Head from '@/components/syndicates/shared/HeaderTitle';
import SignAgreement from '@/components/syndicates/shared/signAgreement';
import WalletNotConnected from '@/components/walletNotConnected';
import { AppState } from '@/state';
import { getTemplates } from '@/utils/templates';
import axios from 'axios';
import moment from 'moment';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const MemberAgreementPage: NextPage = () => {
  const router = useRouter();
  const { clubAddress } = router.query;

  const {
    legalInfoReducer: { memberInfo, clubInfo, walletSignature },
    web3Reducer: {
      web3: { account, activeNetwork }
    },
    erc20TokenSliceReducer: {
      erc20Token: { depositsEnabled }
    }
  } = useSelector((state: AppState) => state);

  const navbarItems = [
    {
      url: `/clubs/${clubAddress}${'?chain=' + activeNetwork.network}`,
      navItemText: 'Exit'
    },
    {
      navItemText: 'Sign legal documents',
      isLegal: true
    }
  ];

  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

    if (depositsEnabled) {
      router.push(`/clubs/${clubAddress}${'?chain=' + activeNetwork.network}`);
    } else {
      setShowSuccessModal(true);
    }
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

      <Modal
        {...{
          modalStyle: ModalStyle.DARK,
          show: showSuccessModal,
          customWidth: 'w-100',
          customClassName: 'pt-8 px-10 pb-8',
          showCloseButton: false,
          outsideOnClick: true,
          showHeader: false,
          alignment: 'align-top',
          margin: 'mt-48'
        }}
      >
        <div className="flex flex-col items-center pb-3 space-y-10">
          <img
            className="h-16 w-16"
            src="/images/syndicateStatusIcons/checkCircleGreen.svg"
            alt="checkmark"
          />
          <div className="flex flex-col items-center">
            <div className="text-xl mb-4">Signed and submitted</div>
            <div className="body text-gray-syn4 mb-8">
              You’ll receive a signed copy via email
            </div>

            <Link
              href={`/clubs/${clubAddress}${'?chain=' + activeNetwork.network}`}
            >
              <CtaButton onClick={() => setShowSuccessModal(false)}>
                Back to club dashboard
              </CtaButton>
            </Link>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default MemberAgreementPage;

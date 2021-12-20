import Layout from "@/components/layout";
import MemberLegalAgreement from "@/components/syndicates/memberLegalAgreement";
import Head from "@/components/syndicates/shared/HeaderTitle";
import WalletNotConnected from "@/components/walletNotConnected";
import { AppState } from "@/state";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";

const SignMemberLegalAgreement: NextPage = () => {
  const account = useSelector(
    (state: AppState) => state.web3Reducer.web3.account,
  );
  const router = useRouter();
  const { clubAddress } = router.query;

  const navItems = [
    {
      url: `/clubs/${clubAddress}`,
      urlText: "Exit",
    },
    {
      url: `/clubs/${clubAddress}/member/legal/sign`,
      urlText: "Sign legal agreements",
    },
  ];

  return (
    <Layout navItems={navItems}>
      <Head title="Member legal agreement" />
      {!account ? <WalletNotConnected /> : <MemberLegalAgreement />}
    </Layout>
  );
};

export default SignMemberLegalAgreement;

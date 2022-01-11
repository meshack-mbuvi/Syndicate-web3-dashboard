import React from "react";
import Layout from "src/components/layout";
import Head from "src/components/syndicates/shared/HeaderTitle";
import ClaimUtilityNFT from "@/components/nft/utility/claim";

const ClaimUtilityNFTView: React.FC = () => {
  return (
    <Layout>
      <Head title="Claim Utility NFT" />
      <ClaimUtilityNFT></ClaimUtilityNFT>
    </Layout>
  );
};

export default ClaimUtilityNFTView;

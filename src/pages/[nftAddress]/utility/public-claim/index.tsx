import React from "react";
import Layout from "src/components/layout";
import Head from "src/components/syndicates/shared/HeaderTitle";
import ClaimNFT from "@/components/nft/claim";

const ClaimNFTView: React.FC = () => {
  return (
    <Layout>
      <Head title="Claim NFT" />
      <ClaimNFT></ClaimNFT>
    </Layout>
  );
};

export default ClaimNFTView;

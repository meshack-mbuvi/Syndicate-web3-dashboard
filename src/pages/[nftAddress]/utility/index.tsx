import React from "react";
import Layout from "src/components/layout";
import Head from "src/components/syndicates/shared/HeaderTitle";
import UtilityNFT from "@/components/nft/utility";

const UtilityNFTView: React.FC = () => {
  return (
    <Layout>
      <Head title="Claim Utility NFT" />
      <UtilityNFT></UtilityNFT>
    </Layout>
  );
};

export default UtilityNFTView;

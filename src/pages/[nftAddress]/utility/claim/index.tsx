import React from "react";
import Layout from "src/components/layout";
import Head from "src/components/syndicates/shared/HeaderTitle";
import ClaimNFT from "@/components/nft/claim";
// import ClaimUtilityNFT from "@/components/nft/utility/claim";

const ClaimUtilityNFTView: React.FC = () => {
  return (
    <Layout>
      <Head title="Claim Utility NFT" />
      <ClaimNFT></ClaimNFT>
      {/* <ClaimUtilityNFT></ClaimUtilityNFT> */}
    </Layout>
  );
};

export default ClaimUtilityNFTView;

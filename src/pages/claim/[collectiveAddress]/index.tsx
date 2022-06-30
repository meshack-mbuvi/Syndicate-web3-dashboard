import React from 'react';
import Layout from 'src/components/layout';
import Head from 'src/components/syndicates/shared/HeaderTitle';
import ClaimPass from '@/containers/collectives/ClaimPass';

const ClaimCollectiveNftView: React.FC = () => {
  return (
    <Layout>
      <Head title="Claim collective pass" />
      <ClaimPass />
    </Layout>
  );
};

export default ClaimCollectiveNftView;

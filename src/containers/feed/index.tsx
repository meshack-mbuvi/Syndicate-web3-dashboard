import React from 'react';
import Head from 'src/components/syndicates/shared/HeaderTitle';

// Social page components
import SocialFeed from './socialFeed';
import Discovery from './discovery';
import Layout from 'src/components/layout';

/**
 * Manages feeds page
 */
const FeedPage: React.FC = () => {
  return (
    <Layout>
      <Head title="Social" />
      <SocialFeed />
      <Discovery />
    </Layout>
  );
};

export default FeedPage;

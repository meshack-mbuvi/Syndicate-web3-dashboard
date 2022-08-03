import Layout from '@/components/layout';
import { Spinner } from '@/components/shared/spinner';
import DistributionContainer from '@/containers/distribute';
import NotFoundPage from '@/pages/404';
import { AppState } from '@/state';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useDistributionsFeatureFlag from '@/hooks/distributions/useDistributionsFeatureFlag';

/**
 * This page shows the manager container for a given syndicate address
 */
const DistributeTokensPage: React.FC = () => {
  const {
    web3Reducer: {
      web3: { web3 }
    }
  } = useSelector((state: AppState) => state);
  const [pageIsLoading, setPageIsLoading] = useState(true);

  const { isReady, readyDistributionsClient } = useDistributionsFeatureFlag();

  useEffect(() => {
    if (!readyDistributionsClient || isEmpty(web3) || !isReady) return;

    setPageIsLoading(false);
    return () => {
      setPageIsLoading(true);
    };
  }, [readyDistributionsClient, web3, isReady]);

  return pageIsLoading ? (
    <Layout>
      <div className="container my-32">
        <Spinner />
      </div>
    </Layout>
  ) : isReady && readyDistributionsClient.treatment === 'on' ? (
    <DistributionContainer />
  ) : (
    <NotFoundPage />
  );
};

export default DistributeTokensPage;

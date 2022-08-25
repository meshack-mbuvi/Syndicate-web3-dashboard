import Layout from '@/components/layout';
import { Spinner } from '@/components/shared/spinner';
import CollectiveDetails from '@/containers/collectives';
import NotFoundPage from '@/pages/404';
import { AppState } from '@/state';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useCollectivesFeatureFlag from '@/hooks/collectives/useCollectivesFeatureFlag';
import useIsPolygon from '@/hooks/collectives/useIsPolygon';

/**
 * This page shows the manager container for a given syndicate address
 */
const CollectiveIndexPage: React.FC = () => {
  const {
    web3Reducer: {
      web3: { web3 }
    }
  } = useSelector((state: AppState) => state);
  const [pageIsLoading, setPageIsLoading] = useState(true);

  const { isReady, readyCollectivesClient } = useCollectivesFeatureFlag();

  // Check to make sure collectives are not viewable on Polygon
  const { isPolygon } = useIsPolygon();

  useEffect(() => {
    if (!readyCollectivesClient || isEmpty(web3) || !isReady) return;

    setPageIsLoading(false);
    return () => {
      setPageIsLoading(true);
    };
  }, [readyCollectivesClient, isReady, web3]);

  return pageIsLoading ? (
    <Layout>
      <div className="container my-32">
        <Spinner />
      </div>
    </Layout>
  ) : isReady && readyCollectivesClient.treatment === 'on' && !isPolygon ? (
    <CollectiveDetails />
  ) : (
    <NotFoundPage />
  );
};

export default CollectiveIndexPage;

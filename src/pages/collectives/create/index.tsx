import CreateCollectiveContainer from '@/containers/createCollective';
import Layout from '@/components/layout';
import { Spinner } from '@/components/shared/spinner';
import NotFoundPage from '@/pages/404';
import { AppState } from '@/state';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useCollectivesFeatureFlag from '@/hooks/collectives/useCollectivesFeatureFlag';
import useIsPolygon from '@/hooks/collectives/useIsPolygon';

const CreateCollectivePage: React.FC = () => {
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
    if (!readyCollectivesClient || !isReady) return;

    setPageIsLoading(false);
    return () => {
      setPageIsLoading(true);
    };
  }, [readyCollectivesClient, web3, isReady]);

  return pageIsLoading ? (
    <Layout>
      <div className="container my-32">
        <Spinner />
      </div>
    </Layout>
  ) : isReady && readyCollectivesClient.treatment === 'on' && !isPolygon ? (
    <CreateCollectiveContainer />
  ) : (
    <NotFoundPage />
  );
};

export default CreateCollectivePage;

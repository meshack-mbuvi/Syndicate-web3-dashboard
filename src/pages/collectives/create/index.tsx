import CreateCollectiveContainer from '@/containers/createCollective';
import Layout from '@/components/layout';
import { Spinner } from '@/components/shared/spinner';
import NotFoundPage from '@/pages/404';
import { AppState } from '@/state';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useFeatureFlag from '@/hooks/useFeatureFlag';
import useIsPolygon from '@/hooks/collectives/useIsPolygon';
import { FEATURE_FLAGS } from '@/pages/_app';

const CreateCollectivePage: React.FC = () => {
  const {
    web3Reducer: {
      web3: { web3 }
    }
  } = useSelector((state: AppState) => state);

  const [pageIsLoading, setPageIsLoading] = useState(true);

  const { isReady, readyClient: readyCollectivesClient } = useFeatureFlag(
    FEATURE_FLAGS.COLLECTIVES,
    {
      collectivesAllowlisted: true
    }
  );

  // Check to make sure collectives are not viewable on Polygon
  const { isPolygon } = useIsPolygon();

  useEffect(() => {
    if (!readyCollectivesClient || isEmpty(web3) || !isReady) return;

    setPageIsLoading(false);
    return () => {
      setPageIsLoading(true);
    };
  }, [readyCollectivesClient, web3, isReady]);

  const isCollectivesReady =
    isReady && readyCollectivesClient?.treatment === 'on' && !isPolygon;

  return pageIsLoading ? (
    <Layout>
      <div className="container my-32">
        <Spinner />
      </div>
    </Layout>
  ) : isCollectivesReady ? (
    <CreateCollectiveContainer />
  ) : (
    <NotFoundPage />
  );
};

export default CreateCollectivePage;

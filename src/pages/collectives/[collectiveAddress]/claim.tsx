import { Spinner } from '@/components/shared/spinner';
import ClaimPass from '@/containers/collectives/ClaimPass';
import NotFoundPage from '@/pages/404';
import { AppState } from '@/state';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from 'src/components/layout';
import Head from 'src/components/syndicates/shared/HeaderTitle';
import useCollectivesFeatureFlag from '@/hooks/collectives/useCollectivesFeatureFlag';
import useIsPolygon from '@/hooks/collectives/useIsPolygon';

const ClaimCollectiveNftView: React.FC = () => {
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
    <div className="container my-32">
      <Spinner />
    </div>
  ) : isReady && readyCollectivesClient.treatment === 'on' && !isPolygon ? (
    <Layout>
      <Head title="Claim collective pass" />
      <ClaimPass />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ClaimCollectiveNftView;

import ClaimPass from '@/containers/collectives/ClaimPass';
import NotFoundPage from '@/pages/404';
import { AppState } from '@/state';
import { Spinner } from '@/components/shared/spinner';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from 'src/components/layout';
import Head from 'src/components/syndicates/shared/HeaderTitle';
import useCollectivesFeatureFlag from '@/hooks/collectives/useCollectivesFeatureFlag';

const ClaimCollectiveNftView: React.FC = () => {
  const {
    web3Reducer: {
      web3: { web3 }
    }
  } = useSelector((state: AppState) => state);

  const [pageIsLoading, setPageIsLoading] = useState(true);

  const { isReady, readyCollectivesClient } = useCollectivesFeatureFlag();

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
  ) : isReady && readyCollectivesClient.treatment === 'on' ? (
    <Layout>
      <Head title="Claim collective pass" />
      <ClaimPass />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ClaimCollectiveNftView;

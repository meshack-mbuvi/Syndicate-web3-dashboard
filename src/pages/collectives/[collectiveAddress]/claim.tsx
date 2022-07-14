import ClaimPass from '@/containers/collectives/ClaimPass';
import NotFoundPage from '@/pages/404';
import { AppState } from '@/state';
import { Spinner } from '@/stories/FileUploader.stories';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from 'src/components/layout';
import Head from 'src/components/syndicates/shared/HeaderTitle';

const ClaimCollectiveNftView: React.FC = () => {
  const {
    web3Reducer: {
      web3: { web3 }
    }
  } = useSelector((state: AppState) => state);

  const [pageIsLoading, setPageIsLoading] = useState(true);

  const router = useRouter();

  const { isReady } = router;

  const { collectives } = useFlags();

  useEffect(() => {
    // collectives is undefined on page load
    if (collectives == undefined || isEmpty(web3) || !isReady) return;

    setPageIsLoading(false);
    return () => {
      setPageIsLoading(true);
    };
  }, [collectives, isReady, web3]);

  return pageIsLoading ? (
    <Layout>
      <div className="container my-32">
        <Spinner />
      </div>
    </Layout>
  ) : collectives ? (
    <Layout>
      <Head title="Claim collective pass" />
      <ClaimPass />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ClaimCollectiveNftView;

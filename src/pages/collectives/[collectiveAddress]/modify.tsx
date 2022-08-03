import Layout from '@/components/layout';
import ModifyCollectiveSettings from '@/components/collectives/edit/ModifyCollectiveSettings';
import { AppState } from '@/state';
import { isEmpty } from 'lodash';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NotFoundPage from '@/pages/404';
import useFetchCollectiveDetails from '@/hooks/collectives/useFetchCollectiveDetails';
import { useRouter } from 'next/router';
import Head from '@/components/syndicates/shared/HeaderTitle';
import TokenEmptyState from '@/containers/layoutWithSyndicateDetails/TokenEmptyState';
import { Spinner } from '@/components/shared/spinner';
import useCollectivesFeatureFlag from '@/hooks/collectives/useCollectivesFeatureFlag';

const ModifyCollectives: React.FC = () => {
  const {
    web3Reducer: {
      web3: { web3 }
    },
    collectiveDetailsReducer: {
      details: { collectiveName }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();
  const { collectiveAddress } = router.query;

  const { loading: fetchingCollective, collectiveNotFound } =
    useFetchCollectiveDetails();

  const { isReady, readyCollectivesClient } = useCollectivesFeatureFlag();

  const [pageIsLoading, setPageIsLoading] = useState(true);

  useEffect(() => {
    if (!readyCollectivesClient || isEmpty(web3) || !isReady) return;

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
  ) : isReady && readyCollectivesClient.treatment === 'on' ? (
    <Layout>
      <Head title={collectiveName || 'Collective'} />
      <div className="relative container mx-auto">
        <div className="grid grid-cols-12 gap-5 w-80 sm:w-730">
          <div className="col-span-12 text-white pb-10">
            {!fetchingCollective && collectiveNotFound ? (
              <div className="w-full">
                <TokenEmptyState
                  tokenTitle="collective"
                  tokenAddress={collectiveAddress as string}
                />
              </div>
            ) : (
              <ModifyCollectiveSettings />
            )}
          </div>
        </div>
      </div>
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ModifyCollectives;

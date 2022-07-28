import Layout from '@/components/layout';
import ModifyCollectiveSettings from '@/components/collectives/edit/ModifyCollectiveSettings';
import { AppState } from '@/state';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { isEmpty } from 'lodash';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NotFoundPage from '@/pages/404';
import useFetchCollectiveDetails from '@/hooks/collectives/useFetchCollectiveDetails';
import { useRouter } from 'next/router';
import Head from '@/components/syndicates/shared/HeaderTitle';
import { useDemoMode } from '@/hooks/useDemoMode';
import TokenEmptyState from '@/containers/layoutWithSyndicateDetails/TokenEmptyState';

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
  const isDemoMode = useDemoMode(collectiveAddress as string);

  const { loading: fetchingCollective, collectiveNotFound } =
    useFetchCollectiveDetails();

  const [pageIsLoading, setPageIsLoading] = useState(true);

  // LaunchDarkly collectives feature flag
  const { collectives } = useFlags();

  useEffect(() => {
    // collectives is undefined on page load
    if (collectives == undefined || isEmpty(web3)) return;

    setPageIsLoading(false);
    return () => {
      setPageIsLoading(true);
    };
  }, [collectives, web3]);

  return (
    <>
      {!pageIsLoading &&
      router.isReady &&
      !isDemoMode &&
      !isEmpty(web3) &&
      !web3?.utils?.isAddress(collectiveAddress) &&
      !collectives ? (
        <NotFoundPage />
      ) : (
        <Layout>
          <Head title={collectiveName || 'Collective'} />
          <div className="relative container mx-auto">
            <div className="grid grid-cols-12 gap-5 w-80 sm:w-730">
              <div className="col-span-12 text-white pb-10">
                {!pageIsLoading &&
                router.isReady &&
                !fetchingCollective &&
                !isDemoMode &&
                collectiveNotFound ? (
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
      )}
    </>
  );
};

export default ModifyCollectives;

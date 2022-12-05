import Layout from '@/components/layout';
import { SkeletonLoader } from '@/components/skeletonLoader';
import DistributionContainer from '@/containers/distribute';
import useFeatureFlag from '@/hooks/useFeatureFlag';
import NotFoundPage from '@/pages/404';
import { FEATURE_FLAGS } from '@/pages/_app';
import { AppState } from '@/state';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

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

  const {
    isReady,
    readyClient: readyDistributionsClient,
    isTreatmentOn: isDistributionsTreatmentOn
  } = useFeatureFlag(FEATURE_FLAGS.DISTRIBUTIONS, {
    distributionsAllowlisted: true
  });
  useEffect(() => {
    if (!readyDistributionsClient || isEmpty(web3) || !isReady) return;

    setPageIsLoading(false);
    return () => {
      setPageIsLoading(true);
    };
  }, [readyDistributionsClient, web3, isReady]);

  return pageIsLoading ? (
    <Layout>
      <div className="container my-32 w-full">
        <div>
          <div className="flex flex-col justify-between">
            <SkeletonLoader width="1/3" height="6" />
            <SkeletonLoader width="2/3" height="5" />
            <SkeletonLoader width="1/3" height="5" />
          </div>
        </div>
        <div>
          {[...Array(5).keys()].map((_, index) => (
            <div
              className="flex w-full justify-between -space-y-2 mx-6 py-3"
              key={index}
            >
              <div className="flex w-full self-center">
                <SkeletonLoader width="4/5" height="6" />
              </div>
              <div className="flex w-full flex-col space-y-1 items-end mr-10">
                <SkeletonLoader width="4/5" height="6" />
                <SkeletonLoader width="2/5" height="5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  ) : isReady && isDistributionsTreatmentOn ? (
    <DistributionContainer />
  ) : (
    <NotFoundPage />
  );
};

export default DistributeTokensPage;

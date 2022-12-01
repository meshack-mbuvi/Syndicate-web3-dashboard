import Layout from '@/components/layout';
import { Spinner } from '@/components/shared/spinner';
import NotFoundPage from '@/pages/404';
import { AppState } from '@/state';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useIsPolygon from '@/hooks/collectives/useIsPolygon';
import useFeatureFlag from '@/hooks/useFeatureFlag';
import { FEATURE_FLAGS } from '@/pages/_app';

const CreateDealsPage: React.FC = () => {
  const {
    web3Reducer: {
      web3: { web3 }
    }
  } = useSelector((state: AppState) => state);

  const [pageIsLoading, setPageIsLoading] = useState(true);

  const {
    isReady,
    readyClient: readyDealsClient,
    isTreatmentOn: isDealsTreatmentOn
  } = useFeatureFlag(FEATURE_FLAGS.DEALS, {});

  // Check to make sure deals are not viewable on Polygon
  const { isPolygon } = useIsPolygon();

  useEffect(() => {
    if (!readyDealsClient || isEmpty(web3) || !isReady) return;

    setPageIsLoading(false);
    return (): void => {
      setPageIsLoading(true);
    };
  }, [readyDealsClient, web3, isReady]);

  const isDealReady = isReady && isDealsTreatmentOn && !isPolygon;

  return pageIsLoading ? (
    <Layout>
      <div className="container my-32">
        <Spinner />
      </div>
    </Layout>
  ) : isDealReady ? (
    /* TODO: CreateDealContainer */
    <NotFoundPage />
  ) : (
    <NotFoundPage />
  );
};

export default CreateDealsPage;

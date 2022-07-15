import CreateCollectiveContainer from '@/containers/createCollective';
import Layout from '@/components/layout';
import { Spinner } from '@/components/shared/spinner';
import NotFoundPage from '@/pages/404';
import { AppState } from '@/state';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const CreateCollectivePage: React.FC = () => {
  const {
    web3Reducer: {
      web3: { web3 }
    }
  } = useSelector((state: AppState) => state);
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

  return pageIsLoading ? (
    <Layout>
      <div className="container my-32">
        <Spinner />
      </div>
    </Layout>
  ) : collectives ? (
    <CreateCollectiveContainer />
  ) : (
    <NotFoundPage />
  );
};

export default CreateCollectivePage;

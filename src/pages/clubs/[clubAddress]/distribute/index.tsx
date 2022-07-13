import Layout from '@/components/layout';
import { Spinner } from '@/components/shared/spinner';
import DistributionContainer from '@/containers/distribute';
import NotFoundPage from '@/pages/404';
import { AppState } from '@/state';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
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

  const router = useRouter();

  const { isReady } = router;

  // LaunchDarkly distributions feature flag
  const { distributions } = useFlags();

  useEffect(() => {
    // distributions is undefined on page load
    if (distributions == undefined || isEmpty(web3) || !isReady) return;

    setPageIsLoading(false);
    return () => {
      setPageIsLoading(true);
    };
  }, [distributions, web3]);

  return pageIsLoading ? (
    <Layout>
      <div className="container my-32">
        <Spinner />
      </div>
    </Layout>
  ) : distributions ? (
    <DistributionContainer />
  ) : (
    <NotFoundPage />
  );
};

export default DistributeTokensPage;

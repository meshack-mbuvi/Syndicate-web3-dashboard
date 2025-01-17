import Layout from '@/components/layout';
import { Spinner } from '@/components/shared/spinner';
import CollectiveDetails from '@/containers/collectives';
import { GoogleAnalyticsPageView } from '@/google-analytics/gtag';
import useERC721Collective from '@/hooks/collectives/useERC721Collective';
import useFeatureFlag from '@/hooks/useFeatureFlag';
import NotFoundPage from '@/pages/404';
import { FEATURE_FLAGS } from '@/pages/_app';
import { AppState } from '@/state';
import { isEmpty } from 'lodash';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

/**
 * This page shows the manager container for a given syndicate address
 */
const CollectiveIndexPage: React.FC = () => {
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

  useEffect(() => {
    if (!readyCollectivesClient || isEmpty(web3) || !isReady) return;

    setPageIsLoading(false);
    return (): void => {
      setPageIsLoading(true);
    };
  }, [readyCollectivesClient, isReady, web3]);

  const {
    collectiveDetails: { collectiveName }
  } = useERC721Collective();

  // Google Analytics
  // Wait until enough data on the page is loaded
  // before sending data to Google Analyitics
  const [fullPathname, setFullPathname] = useState('');
  router.events.on('routeChangeComplete', (url) => {
    setFullPathname(url);
  });
  useEffect(() => {
    // Collective name must be loaded before sending data, otherwise GA
    // will record the page title incorrectly (e.g "Collective NFT | Syndicate")
    // instead of using the actual collective name
    if (collectiveName && fullPathname) {
      GoogleAnalyticsPageView(fullPathname);
    }
  }, [router.events, collectiveName, fullPathname]);

  const isCollectivesReady =
    isReady &&
    readyCollectivesClient &&
    readyCollectivesClient.treatment === 'on';

  return pageIsLoading ? (
    <Layout>
      <div className="container my-32">
        <Spinner />
      </div>
    </Layout>
  ) : isCollectivesReady ? (
    <CollectiveDetails />
  ) : (
    <NotFoundPage />
  );
};

export default CollectiveIndexPage;

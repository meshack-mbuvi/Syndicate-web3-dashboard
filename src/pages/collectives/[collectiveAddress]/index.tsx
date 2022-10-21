import Layout from '@/components/layout';
import { Spinner } from '@/components/shared/spinner';
import CollectiveDetails from '@/containers/collectives';
import NotFoundPage from '@/pages/404';
import { AppState } from '@/state';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useCollectivesFeatureFlag from '@/hooks/collectives/useCollectivesFeatureFlag';
import useIsPolygon from '@/hooks/collectives/useIsPolygon';
import router from 'next/router';
import useERC721Collective from '@/hooks/collectives/useERC721Collective';
import { GoogleAnalyticsPageView } from '@/google-analytics/gtag';

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

  return pageIsLoading ? (
    <Layout>
      <div className="container my-32">
        <Spinner />
      </div>
    </Layout>
  ) : isReady && readyCollectivesClient.treatment === 'on' && !isPolygon ? (
    <CollectiveDetails />
  ) : (
    <NotFoundPage />
  );
};

export default CollectiveIndexPage;

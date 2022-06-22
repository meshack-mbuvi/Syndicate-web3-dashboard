import DistributionContainer from '@/containers/distribute';
import { useFlags } from 'launchdarkly-react-client-sdk';
import NotFoundPage from '@/pages/404';

/**
 * This page shows the manager container for a given syndicate address
 */
const DistributeTokensPage: React.FC = () => {
  // LaunchDarkly distributions feature flag
  const { distributions } = useFlags();
  return distributions ? <DistributionContainer /> : <NotFoundPage />;
};

export default DistributeTokensPage;

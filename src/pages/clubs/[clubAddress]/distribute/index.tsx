import DistributionContainer from '@/containers/distribute';
import NotFoundPage from '@/pages/404';
import { useFlags } from 'launchdarkly-react-client-sdk';

/**
 * This page shows the manager container for a given syndicate address
 */
const DistributeTokensPage: React.FC = () => {
  // LaunchDarkly distributions feature flag
  const { distributionButton } = useFlags();

  return distributionButton ? <DistributionContainer /> : <NotFoundPage />;
};

export default DistributeTokensPage;

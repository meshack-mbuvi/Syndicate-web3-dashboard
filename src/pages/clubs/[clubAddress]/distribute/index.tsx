import DistributionContainer from '@/containers/distribute';
import { useFlags } from 'launchdarkly-react-client-sdk';
import NotFoundPage from '@/pages/404';

/**
 * This page shows the manager container for a given syndicate address
 */
const DistributeTokensPage: React.FC = () => {
  // LaunchDarkly distribution-button (converted to camelcase) feature flag is called
  const { distributionButton } = useFlags();
  return distributionButton ? <DistributionContainer /> : <NotFoundPage />;
};

export default DistributeTokensPage;

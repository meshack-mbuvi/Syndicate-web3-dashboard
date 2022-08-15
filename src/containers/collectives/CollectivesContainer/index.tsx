import useFetchCollectiveDetails from '@/hooks/collectives/useFetchCollectiveDetails';
import { AppState } from '@/state';
import { useSelector } from 'react-redux';
import CollectiveNotFound from '@/containers/collectives/shared/collectiveNotFound';
import Layout from '@/components/layout';

const CollectivesContainer: React.FC = ({ children }) => {
  const {
    collectiveDetailsReducer: {
      loadingState: { collectiveNotFound }
    }
  } = useSelector((state: AppState) => state);

  // fetch collective details for both claim and details page
  useFetchCollectiveDetails();

  return (
    <div>
      {collectiveNotFound ? (
        <Layout>
          <CollectiveNotFound />
        </Layout>
      ) : (
        children
      )}
    </div>
  );
};

export default CollectivesContainer;

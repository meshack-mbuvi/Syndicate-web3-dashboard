import useFetchCollectiveDetails from '@/hooks/collectives/useFetchCollectiveDetails';
import NotFoundPage from '@/pages/404';
import { AppState } from '@/state';
import { useSelector } from 'react-redux';

const CollectivesContainer: React.FC = ({ children }) => {
  const {
    collectiveDetailsReducer: {
      loadingState: { collectiveNotFound }
    }
  } = useSelector((state: AppState) => state);

  // fetch collective details for both claim and details page
  useFetchCollectiveDetails();

  //TODO: using the 404 page when no collective is found for address.
  // we'll need to switch this out with a 404 page for collectives.
  return <div>{collectiveNotFound ? <NotFoundPage /> : children}</div>;
};

export default CollectivesContainer;

import useERC721Collective from '@/hooks/collectives/useERC721Collective';
import CollectiveNotFound from '@/containers/collectives/shared/collectiveNotFound';
import Layout from '@/components/layout';

const CollectivesContainer: React.FC = ({ children }) => {
  const { collectiveNotFound, correctCollectiveNetwork } =
    useERC721Collective();

  return (
    <div>
      {collectiveNotFound || !correctCollectiveNetwork ? (
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

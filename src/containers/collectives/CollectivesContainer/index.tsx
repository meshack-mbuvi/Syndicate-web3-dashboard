import useERC721Collective from '@/hooks/collectives/useERC721Collective';
import ProductTokenNotFound, {
  TokenType
} from '@/containers/collectives/shared/productAddressNotFound';
import Layout from '@/components/layout';

const CollectivesContainer: React.FC = ({ children }) => {
  const { collectiveNotFound, correctCollectiveNetwork } =
    useERC721Collective();

  return (
    <div>
      {collectiveNotFound || !correctCollectiveNetwork ? (
        <Layout>
          <ProductTokenNotFound tokenTitle={TokenType.COLLECTIVE} />
        </Layout>
      ) : (
        children
      )}
    </div>
  );
};

export default CollectivesContainer;

import useERC721Collective from '@/hooks/collectives/useERC721Collective';
import ProductTokenNotFound, {
  ProductType
} from '@/containers/collectives/shared/productAddressNotFound';
import Layout from '@/components/layout';

const CollectivesContainer: React.FC = ({ children }) => {
  const { collectiveNotFound, correctCollectiveNetwork } =
    useERC721Collective();

  return (
    <div>
      {collectiveNotFound || !correctCollectiveNetwork ? (
        <Layout>
          <ProductTokenNotFound tokenTitle={ProductType.COLLECTIVE} />
        </Layout>
      ) : (
        children
      )}
    </div>
  );
};

export default CollectivesContainer;

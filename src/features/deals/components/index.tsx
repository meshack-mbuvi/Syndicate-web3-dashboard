import Layout from '@/components/layout';
import ProductTokenNotFound, {
  ProductType
} from '@/containers/collectives/shared/productAddressNotFound';
import useDealsDetails from '@/hooks/deals/useDealsDetails';

export const DealsContainer: React.FC = ({ children }) => {
  const { dealNotFound } = useDealsDetails();

  return (
    <div>
      {dealNotFound ? (
        <Layout>
          <ProductTokenNotFound tokenTitle={ProductType.DEAL} />
        </Layout>
      ) : (
        children
      )}
    </div>
  );
};

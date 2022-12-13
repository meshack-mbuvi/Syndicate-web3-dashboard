import Layout from '@/components/layout';
import ProductTokenNotFound, {
  TokenType
} from '@/containers/collectives/shared/productAddressNotFound';
import useDealsDetails from '@/hooks/deals/useDealsDetails';

export const DealsContainer: React.FC = ({ children }) => {
  const { dealNotFound } = useDealsDetails();

  return (
    <div>
      {dealNotFound ? (
        <Layout>
          <ProductTokenNotFound tokenTitle={TokenType.COLLECTIVE} />
        </Layout>
      ) : (
        children
      )}
    </div>
  );
};

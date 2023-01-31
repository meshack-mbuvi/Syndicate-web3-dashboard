import { MEMBER_SIGNED_QUERY } from '@/graphql/backend_queries';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';

const useHasMemberSigned = (props: {
  clubAddress: string;
  memberAddress: string;
}): any => {
  const {
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);
  const { clubAddress, memberAddress } = props;

  return useQuery(MEMBER_SIGNED_QUERY, {
    context: {
      clientName: SUPPORTED_GRAPHS.BACKEND,
      chainId: activeNetwork.chainId
    },
    variables: { clubAddress, memberAddress },
    skip: !activeNetwork.chainId || !clubAddress || !memberAddress
  });
};

export default useHasMemberSigned;

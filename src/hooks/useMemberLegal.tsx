import { MEMBER_SIGNED_QUERY } from '@/graphql/queries';
import { useQuery } from '@apollo/client';
import { AppState } from '@/state';
import { useSelector } from 'react-redux';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';

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

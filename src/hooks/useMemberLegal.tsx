import { MEMBER_SIGNED_QUERY } from "@/graphql/queries";
import { useQuery } from "@apollo/client";

const useHasMemberSigned = (props: {
  clubAddress: string;
  memberAddress: string;
}): any => {
  const { clubAddress, memberAddress } = props;

  return useQuery(MEMBER_SIGNED_QUERY, {
    variables: {
      clubAddress,
      memberAddress,
    },
  });
};

export default useHasMemberSigned;

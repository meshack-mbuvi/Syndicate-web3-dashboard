import { MEMBER_SIGNED_QUERY } from "@/graphql/queries";
import { useQuery } from "@apollo/client";

import { useConnectWalletContext } from "../context/ConnectWalletProvider";

const useHasMemberSigned = (props: {
  clubAddress: string;
  memberAddress: string;
}): any => {
  const { clubAddress, memberAddress } = props;
  const { chainId } = useConnectWalletContext();

  return useQuery(MEMBER_SIGNED_QUERY, {
    context: { chainId },
    variables: { clubAddress, memberAddress },
  });
};

export default useHasMemberSigned;

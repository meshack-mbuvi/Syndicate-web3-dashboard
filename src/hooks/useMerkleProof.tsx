import { INDEX_AND_PROOF } from "@/graphql/merkleDistributor";
import { AppState } from "@/state";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";

export const useFetchMerkleProof: any = (skipQuery = true) => {
  const {
    web3Reducer: {
      web3: { account: address },
    },
    erc20TokenSliceReducer: {
      erc20Token: { address: clubAddress },
    },
  } = useSelector((state: AppState) => state);

  return useQuery(INDEX_AND_PROOF, {
    variables: { clubAddress, address },
    skip: !address || skipQuery,
    context: { clientName: "backend" },
  });
};

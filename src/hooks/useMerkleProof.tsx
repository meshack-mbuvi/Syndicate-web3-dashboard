import { useQuery } from "@apollo/client";
import { INDEX_AND_PROOF } from "@/graphql/merkleDistributor";
import { useSelector } from "react-redux";
import { AppState } from "@/state";

export const useFetchMerkleProof: any = (skipQuery: boolean = true) => {
  const {
    web3Reducer: {
      web3: { account },
    },
    erc20TokenSliceReducer: { erc20Token },
  } = useSelector((state: AppState) => state);

  console.log("XXXXXX");
  console.log(erc20Token.address, account);

  return useQuery(INDEX_AND_PROOF, {
    variables: {
      clubAddress: erc20Token.address,
      address: account,
    },
    skip: !account || skipQuery,
    context: { clientName: "backend" },
  });
};

import { TOKENS_BY_NAME } from "@/graphql/queries";
import { useQuery } from "@apollo/client";

//TODO
// rn bare bones of token search by name - needs tokenByID
// need to handle either identifying if searchTerm is by id
// or combining queries to always query both

const useSearchToken = (tokenSearchTerm : string) => {
  const { data, loading, error, refetch } = useQuery(TOKENS_BY_NAME, {
    variables: {
      where: {
        name_contains: tokenSearchTerm
      },
    },
    context: { clientName: "uniswap" },
  });

  return {data, loading, error, refetch};

}

export default useSearchToken;
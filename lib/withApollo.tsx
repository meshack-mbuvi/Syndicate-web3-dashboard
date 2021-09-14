import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { useRouter } from "next/router";
import nextWithApollo from "next-with-apollo";
import { isDev } from "@/utils/environment";

const GetWithApollo = ({ Page, props }) => {
  const router = useRouter();
  return (
    <ApolloProvider client={props.apollo}>
      <Page {...props} {...router} />
    </ApolloProvider>
  );
};

const withApollo = nextWithApollo(
  ({ initialState, headers }) => {
    return new ApolloClient({
      ssrMode: typeof window === "undefined",
      link: new HttpLink({
        uri: isDev
          ? "http://localhost:4000"
          : process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
      }),
      headers: {
        ...(headers as Record<string, string>),
      },
      cache: new InMemoryCache().restore(initialState || {}),
    });
  },
  {
    render: GetWithApollo,
  },
);

export default withApollo;

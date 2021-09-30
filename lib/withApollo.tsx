import "@/utils/firebase/initAuth";

import { isDev, isSSR } from "@/utils/environment";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { User, getAuth } from "firebase/auth";
import nextWithApollo from "next-with-apollo";
import { useRouter } from "next/router";

const ApolloProviderPage = ({ Page, props }) => {
  const router = useRouter();

  return (
    <ApolloProvider client={props.apollo}>
      <Page {...props} {...router} />
    </ApolloProvider>
  );
};

const withApollo: any = nextWithApollo(
  ({ initialState, ctx = {} }) => {
    const authLink = setContext(async (_, { headers }) => {
      const ssrMode = isSSR();
      const currentUser =
        ssrMode && "AuthUser" in ctx
          ? ((ctx as any).AuthUser as User)
          : getAuth().currentUser;
      const token = await currentUser?.getIdToken();

      return {
        headers: {
          ...headers,
          "X-Social-Token": token,
        },
      };
    });

    const httpLink = new HttpLink({
      uri: isDev
        ? "http://localhost:4000"
        : process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
    });

    return new ApolloClient({
      ssrMode: isSSR(),
      link: authLink.concat(httpLink),
      cache: new InMemoryCache().restore(initialState || {}),
    });
  },
  { render: ApolloProviderPage },
);

export default withApollo;

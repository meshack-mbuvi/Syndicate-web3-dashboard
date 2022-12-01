import 'nprogress/nprogress.css'; //styles of nprogress
/**
 * datepicker component requires these in-built styles, so we import them
 * from here to make them available globally
 */
import 'react-datepicker/dist/react-datepicker.css';

import '../styles/animation.css';
import '../styles/custom-datepicker.css';
import '../styles/global.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAmplitude } from '@/components/amplitude';
import FontsPreloader from '@/components/fonts';
import BeforeGettingStartedProvider from '@/context/beforeGettingStartedContext';
import ConnectWalletProvider from '@/context/ConnectWalletProvider';
import CreateInvestmentClubProvider from '@/context/CreateInvestmentClubContext';
import OnboardingProvider from '@/context/OnboardingContext';
import { wrapper } from '@/state';
import { isDev, isSSR } from '@/utils/environment';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache
} from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import withApollo from 'next-with-apollo';
import { AppProps } from 'next/app';
import Head from 'next/head';
import NProgress from 'nprogress';
import React from 'react';
import {
  GRAPH_ENDPOINTS,
  GraphLinks,
  SUPPORTED_GRAPHS
} from '@/Networks/backendLinks';

import { SplitFactory } from '@splitsoftware/splitio-react';
import Script from 'next/script';
import router from 'next/router';
import {
  GA_TRACKING_ID,
  GoogleAnalyticsPageView
} from '@/google-analytics/gtag';
import useIsInDarkMode from '@/hooks/useDarkMode';

const handleRouteChangeGoogleAnalytics = (url: string) => {
  const isURLForClub = url.split('/').includes('clubs');
  const isURLForCollective = url.split('/').includes('collectives');
  if (!isURLForClub && !isURLForCollective) {
    GoogleAnalyticsPageView(url);
  }
};

//Binding events.
router.events.on('routeChangeStart', () => NProgress.start());
router.events.on('routeChangeError', () => NProgress.done());
router.events.on('routeChangeComplete', (url: string) => {
  NProgress.done();
  handleRouteChangeGoogleAnalytics(url);
});
router.events.on('hashChangeComplete', (url: string) => {
  NProgress.done();
  handleRouteChangeGoogleAnalytics(url);
});

const sdkConfig = {
  core: {
    authorizationKey: isDev
      ? process.env.NEXT_PUBLIC_SPLIT_SDK_CLIENT_TEST
      : process.env.NEXT_PUBLIC_SPLIT_SDK_CLIENT_PRODUCTION,
    key: ''
  }
};

// Names of splits here should match the names of the feature flags in Split.io
export enum FEATURE_FLAGS {
  DISTRIBUTIONS = 'Distributions',
  COLLECTIVES = 'Collectives',
  CLUBS_MIXIN_GUARDED = 'ClubsMixinGuarded',
  DEALS = 'Deals'
}

const StateProviders: React.FC = ({ children }) => (
  <SplitFactory config={sdkConfig}>
    <OnboardingProvider>
      <BeforeGettingStartedProvider>
        <CreateInvestmentClubProvider>{children}</CreateInvestmentClubProvider>
      </BeforeGettingStartedProvider>
    </OnboardingProvider>
  </SplitFactory>
);

// react-query
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5000 } }
});

const Body: React.FC<AppProps & { apollo: ApolloClient<unknown> }> = ({
  Component,
  pageProps,
  apollo
}) => {
  return (
    <>
      <Head>
        <title>Home | Syndicate Dashboard</title>
        {/* Safari favicon */}
        <link rel="icon" href="/favicon.png" sizes="any" />
        {/* Favicon */}
        <link
          rel="icon"
          href={useIsInDarkMode() ? '/favicon-white.svg' : 'favicon.svg'}
          type="image/svg+xml"
        ></link>{' '}
        <FontsPreloader />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <ApolloProvider client={apollo}>
        <Component {...pageProps} />
      </ApolloProvider>

      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `
        }}
      />
    </>
  );
};

const App = (props: any) => {
  useAmplitude();

  return (
    <StateProviders>
      <ConnectWalletProvider>
        <QueryClientProvider client={queryClient}>
          <Body {...props} />
        </QueryClientProvider>
      </ConnectWalletProvider>
    </StateProviders>
  );
};

// Construct dynamic httpLinks from available networks and graphs
const constructGraphLinks = (): GraphLinks => {
  const links: GraphLinks = {};
  Object.entries(GRAPH_ENDPOINTS).map(([networkId, graphEndpoints]) => {
    const httplinks: Record<SUPPORTED_GRAPHS, HttpLink> = {} as Record<
      SUPPORTED_GRAPHS,
      HttpLink
    >;
    Object.values(SUPPORTED_GRAPHS).map((value) => {
      httplinks[value] = new HttpLink({
        uri: graphEndpoints[value]
      });
    });
    links[networkId] = httplinks;
  });

  return links;
};

const httpsLinks = Object.freeze(constructGraphLinks());

const apolloInitializer = ({ initialState }: any) => {
  const graphLink = new ApolloLink((operation) => {
    const { clientName = 'backend', chainId = 1 } = operation.getContext();
    return httpsLinks[(chainId as string) || '1'][
      (clientName as SUPPORTED_GRAPHS) || SUPPORTED_GRAPHS.BACKEND
    ].request(operation);
  });
  return new ApolloClient({
    ssrMode: isSSR(),
    link: new RetryLink().concat(graphLink),
    cache: new InMemoryCache().restore(initialState || {}),
    connectToDevTools: isDev
  });
};

export default withApollo(apolloInitializer)(wrapper.withRedux(App));

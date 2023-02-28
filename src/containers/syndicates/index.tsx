import { amplitudeLogger, Flow } from '@/components/amplitude';
import { WEB_APP_LANDING } from '@/components/amplitude/eventNames';
import ErrorBoundary from '@/components/errorBoundary';
import Layout from '@/components/layout';
import PortfolioAndDiscover from '@/components/syndicates/portfolioAndDiscover';
import useWindowSize from '@/hooks/useWindowSize';
import { useRouter } from 'next/router';

import React, { FC, useEffect } from 'react';
import Head from 'src/components/syndicates/shared/HeaderTitle';

/**
 * Displays all clubs.
 *
 */

const SyndicatesComponent: FC = () => {
  const { width } = useWindowSize();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
      amplitudeLogger(WEB_APP_LANDING, {
        flow: Flow.WEB_APP
      });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Layout>
      <Head title="My Investment Clubs" />
      {/* help for the Netlify post-processing bots */}
      <form
        name="offChainData"
        data-netlify="true"
        netlify-honeypot="bot-field"
        hidden
      >
        <input type="text" name="fullName" />
        <input type="text" name="emailAddress" />
        <input type="text" name="syndicateAddress" />
        <input type="checkbox" name="attachLLCManually" />
      </form>
      <ErrorBoundary>
        <div className="w-full">
          {/* show my clubs */}
          <div
            className="container mx-auto"
            // @ts-expect-error TS(2322): Type '{ paddingRight: string; } | null' is not ass... Remove this comment to see the full error message
            style={width < 480 ? { paddingRight: '0' } : null}
          >
            <PortfolioAndDiscover />
          </div>
        </div>
      </ErrorBoundary>
    </Layout>
  );
};

export default SyndicatesComponent;

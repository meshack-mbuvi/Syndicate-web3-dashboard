import ErrorBoundary from '@/components/errorBoundary';
import Layout from '@/components/layout';
import PortfolioAndDiscover from '@/components/syndicates/portfolioAndDiscover';
import useWindowSize from '@/hooks/useWindowSize';
import React, { FC } from 'react';
import Head from 'src/components/syndicates/shared/HeaderTitle';

/**
 * Displays all clubs.
 
 *
 */
const SyndicatesComponent: FC = () => {
  const { width } = useWindowSize();
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

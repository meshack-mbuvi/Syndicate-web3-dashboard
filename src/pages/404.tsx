import PrimaryButton from '@/components/buttons/PrimaryButton';
import Router from 'next/router';
import React from 'react';
import Layout from 'src/components/layout';
import SEO from 'src/components/seo';

const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <SEO
        keywords={[
          `syndicate`,
          `crypto`,
          `invest`,
          `fund`,
          `social`,
          `ethereum`
        ]}
        title="404: Not Found"
      />
      <div className="w-full" style={{ height: 'calc(100vh - 300px)' }}>
        <div className="vertically-center container mx-auto">
          <div className="w-full sm:w-8/12 lg:w-5/12">
            <div className="tagline mb-4">404 / Not Found</div>
            <h1 className="my-6">There&apos;s nothing here yet</h1>
            <p className="mb-3 text-gray-3">
              Make sure you’re connected with a wallet that has permission to
              view this. If you typed the URL directly, double check for any
              typos.
            </p>
            <p className="mb-8 text-gray-3">
              You can also try refreshing after a minute or two. Syndicate works
              on the blockchain, so things can sometimes take an extra moment to
              process.
            </p>
            <PrimaryButton
              customClasses="secondary-CTA"
              onClick={() => {
                Router.push('/clubs');
              }}
            >
              <img
                className="inline w-4 mr-3 -ml-1"
                src="/images/leftArrow.svg"
                alt="Back Arrow"
              />
              Back
            </PrimaryButton>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;

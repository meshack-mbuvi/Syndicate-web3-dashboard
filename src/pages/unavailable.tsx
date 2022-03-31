import React from 'react';
import Layout from 'src/components/layout';
import SEO from 'src/components/seo';
import Image from 'next/image';

const NotAvailable: React.FC = () => {
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
        title="Not Available"
      />
      <div className="w-full lg:w-1/3" style={{ marginTop: '144px' }}>
        <div className="mx-auto" style={{ width: '488px' }}>
          <div className="flex items-center justify-center mb-9">
            <Image src={`/images/pinLocation.svg`} height={95} width={62} />
          </div>
          <div className="flex justify-between">
            <div className="">
              <h1 className="font-whyte text-2xl mb-2">
                Syndicate isn’t available in your region yet
              </h1>
              <p className=" mb-6 text-gray-syn4 text-base">
                Syndicate is available in most places, but due to sanctions and
                other regulations, Syndicate isn’t available everywhere yet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotAvailable;

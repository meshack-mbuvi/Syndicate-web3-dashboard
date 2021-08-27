import React from "react";
import Router from "next/router";
import PrimaryButton from "@/components/buttons";

import Layout from "src/components/layout";
import SEO from "src/components/seo";

function NotFoundPage() {
  return (
    <Layout>
      <SEO
        keywords={[`syndicate`, `crypto`, `invest`, `fund`, `social`, `ethereum`]}
        title="404: Not Found"
      />
      <div className="w-full" style={{height: "calc(100vh - 300px)"}}>
        <div className="vertically-center container mx-auto">
          <div className="w-full sm:w-8/12 lg:w-5/12">
            <h2 className="tagline mb-4">404 / Not Found</h2>
            <h1 className="font-whyte text-3xl mb-3">There's nothing here yet</h1>
            <p className="mb-8 text-gray-3">Double check the address or wait a minute and then try refreshing this page. Syndicate works on the blockchain, so things can sometimes take an extra moment to process.</p>
            <PrimaryButton 
              customClasses="px-12 py-3.5 rounded-lg focus:outline-none border-none bg-gray-manatee bg-opacity-30 text-white" 
              onClick={() => {Router.push("/syndicates")}}
            >
                <img className="inline w-4 mr-3 -ml-1" src="/images/leftArrow.svg" alt="Back Arrow"/>
                Back
            </PrimaryButton>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default NotFoundPage;

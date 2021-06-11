import Link from "next/link";
import React from "react";
import Footer from "src/components/navigation/footer";
import SEO from "src/components/seo";
import { homePageConstants } from "src/components/syndicates/shared/Constants";

function IndexPage() {
  const {
    primaryHeaderText,
    secondaryHeaderText,
    homeButtonText,
  } = homePageConstants;
  return (
    <>
      <SEO
        keywords={[`next`, `tailwind`, `react`, `tailwindcss`]}
        title="Home"
      />
      <div className="flex justify-between flex-col full-height relative h-screen">
        <div className="flex justify-center w-full">
          <img src="/images/logo.svg" className="h-12 w-12 mt-8 mx-4" />
        </div>

        <main className="flex flex-col justify-center px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-4xl tracking-tight font-bold text-white sm:text-5xl md:text-7xl leading-10 mb-8">
              {primaryHeaderText}
            </p>
            <p className="text-white font-normal text-xl sm:text-2xl">
              {secondaryHeaderText}
            </p>

            <div className="flex items-center justify-center mt-10 sm:mt-20 w-full">
              <div className="rounded-md">
                <Link href="/syndicates">
                  <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-custom text-white hover md:py-4 md:text-lg md:px-10 bg-blue">
                    {homeButtonText}
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </main>
        <div className="flex w-1/2 mx-auto">
          <Footer extraClasses="border-none text-center" />
        </div>
      </div>
    </>
  );
}

export default IndexPage;

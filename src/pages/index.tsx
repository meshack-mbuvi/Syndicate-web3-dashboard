import React, { FC } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import Footer from "src/components/navigation/footer";
import SEO from "src/components/seo";
import { homePageConstants } from "src/components/syndicates/shared/Constants";
import { CLICK_USE_SYNDICATE } from "@/components/amplitude/eventNames";
import { amplitudeLogger, Flow } from "@/components/amplitude";
import { initWalletConnection } from "@/redux/actions/web3Provider";

const IndexPage: FC = () => {
  const dispatch = useDispatch();
  const { primaryHeaderText, secondaryHeaderText, homeButtonText } =
    homePageConstants;

  const handleOnClickUseSyndicate = () => {
    // Amplitude logger: How many users who got on out site clicked on the "Use Syndicate Button"
    amplitudeLogger(CLICK_USE_SYNDICATE, { flow: Flow.MGR_CREATE_SYN });
    dispatch(initWalletConnection());
  };

  return (
    <>
      <SEO
        keywords={[`next`, `tailwind`, `react`, `tailwindcss`]}
        title="Home"
      />

      <div className="flex justify-between flex-col full-height relative h-screen">
        <div className="flex justify-center w-full">
          <img
            alt="Syndicate logo"
            src="/images/logo.svg"
            className="h-12 w-12 mt-8 mx-4"
          />
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
                  <button
                    onClick={handleOnClickUseSyndicate}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-custom text-white hover md:py-4 md:text-lg md:px-10 bg-blue"
                  >
                    {homeButtonText}
                  </button>
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
};

export default IndexPage;

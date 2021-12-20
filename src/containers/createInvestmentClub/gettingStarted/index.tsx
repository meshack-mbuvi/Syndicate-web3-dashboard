import React, { Dispatch, SetStateAction } from "react";
import { EmailSupport } from "@/components/emailSupport";
import { DiscordLink } from "@/components/DiscordLink";

const GettingStarted: React.FC<{
  setClubStep: Dispatch<SetStateAction<string>>;
}> = ({ setClubStep }) => {
  return (
    <div
      className="pt-8 pb-6 px-5 rounded-2-half bg-gray-syn8 w-100"
      style={{ marginTop: "78px" }}
    >
      <div>
        <div className="mx-5">
          <p className="uppercase text-sm leading-4 tracking-px text-white mb-8 font-bold">
            Getting Started
          </p>
          <div style={{ marginBottom: 72 }}>
            <ol className="space-y-6 overflow-hidden xs:hidden" role="menu">
              <div className="relative">
                <div
                  className={`ml-px absolute mt-3 top-2 left-2 w-0.5 bg-gray-syn6
                `}
                  style={{ height: "74px" }}
                  aria-hidden="true"
                />

                <div className="relative flex items-start group">
                  <span className=" h-6 flex items-center" aria-hidden="true">
                    <span
                      className={`relative z-5 w-5 h-5 flex items-center justify-center border-2 rounded-full border-blue
                   `}
                    >
                      <span className="h-full w-full rounded-full" />
                    </span>
                  </span>
                  <span className="ml-4 min-w-0 flex flex-col">
                    <span className="text-white text-base leading-6 font-light transition-all">
                      Create your on-chain investment club
                    </span>
                    <p className="text-gray-syn4 text-sm mt-1 leading-5.5">
                      Define the name &#38; rules around your fundraise that
                      will enable the on-chain cap table
                    </p>
                  </span>
                </div>
              </div>
              <div className="relative" style={{ marginTop: "1.25rem" }}>
                <div
                  className={`ml-px absolute mt-3 top-2 left-2 w-0.5 bg-gray-syn6
                `}
                  aria-hidden="true"
                  style={{ height: "31px" }}
                />

                <div className="relative flex items-start group">
                  <span className=" h-6 flex items-center" aria-hidden="true">
                    <span
                      className={`relative z-5 w-5 h-5 flex items-center justify-center border-2 rounded-full border-gray-syn6
                   `}
                    >
                      <span className="h-full w-full rounded-full" />
                    </span>
                  </span>
                  <span className="ml-4 min-w-0 flex justify-between w-full text-gray-syn5 text-base leading-6 font-light transition-all">
                    <span>Form a legal entity</span>
                    <span>Optional</span>
                  </span>
                </div>
              </div>
              <div className="relative">
                <div
                  className={`ml-px absolute mt-3 top-2 left-2 w-0.5 bg-gray-syn6
                `}
                  aria-hidden="true"
                  style={{ height: "31px" }}
                />

                <div className="relative flex items-start group">
                  <span className=" h-6 flex items-center" aria-hidden="true">
                    <span
                      className={`relative z-5 w-5 h-5 flex items-center justify-center border-2 rounded-full border-gray-syn6
                   `}
                    >
                      <span className="h-full w-full rounded-full" />
                    </span>
                  </span>
                  <span className="ml-4 min-w-0 flex justify-between w-full text-gray-syn5 text-base leading-6 font-light transition-all">
                    <span>Distribute &#38; sign legal agreements</span>
                    <span>Optional</span>
                  </span>
                </div>
              </div>
              <div className="relative">
                <div className="relative flex items-start group">
                  <span className=" h-6 flex items-center" aria-hidden="true">
                    <span
                      className={`relative z-5 w-5 h-5 flex items-center justify-center border-2 rounded-full border-gray-syn6
                   `}
                    >
                      <span className="h-full w-full rounded-full" />
                    </span>
                  </span>
                  <span className="ml-4 min-w-0 flex flex-col">
                    <span className="text-gray-syn5 text-base leading-6 font-light transition-all">
                      Collect funds &#38; invest together!
                    </span>
                  </span>
                </div>
              </div>
            </ol>
          </div>
          <button
            className="bg-green rounded-custom w-full flex items-center justify-center py-4"
            onClick={() => setClubStep("")}
          >
            <p className="text-black pr-1 whitespace-nowrap font-semibold">
              Create an investment club
            </p>
            <img
              src="/images/actionIcons/arrowRightBlack.svg"
              alt="arrow-right"
            />
          </button>
        </div>
        <div className="mt-10 mb-6 h-px bg-gray-syn6"></div>

        <p className="px-5 text-gray-syn4 text-sm leading-5.5">
          Questions? Contact us at <EmailSupport /> or on <DiscordLink />
        </p>
      </div>
    </div>
  );
};

export default GettingStarted;

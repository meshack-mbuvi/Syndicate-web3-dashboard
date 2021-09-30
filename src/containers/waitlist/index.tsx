import React, { FC, useState } from "react";
import Head from "src/components/syndicates/shared/HeaderTitle";

import TwitterProfile from "./twitterProfile";
import WaitlistForm from "./waitlistForm";

const mainCopy = (
  <>
    <div className="md:text-left">
      <img
        className="w-28 md:w-36 mx-auto md:mx-0 mb-5"
        src="/images/wordmark.svg"
        alt=""
      />
    </div>
    <div id="landing-title" className="mb-5">
      <p className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-center md:text-left font-whyte-light">
        Create an investing <br className="hidden md:block" /> syndicate for
        1000x less <br className="hidden md:block" /> time and money.
      </p>
    </div>
    <div
      id="welcome text"
      className="text-base text-opacity-80 text-center md:text-center opacity-80 font-normal"
    >
      <p>
        Syndicate is still in private beta. Join the waitlist for early access.
      </p>
    </div>
  </>
);

const successContent = (
  <>
    <div
      className="container h-screen flex flex-col justify-center items-start flex-1 w-4/6 font-whyte"
      id="left-column"
      style={{
        backgroundImage: "url(/images/social/waitlist-bg.svg)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        id="syndicate-logo"
        className="uppercase flex justify-start items-center mb-5"
      >
        <img alt="logo" src="/images/logo.svg" className="w-5 h-5 mr-1" />
        <span className="text-xl font-whyte">syndicate</span>
      </div>
      <div id="landing-title" className="mb-5">
        <p className="text-lg md:text-3xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
          You’re on the waitlist.
        </p>
      </div>
      <div id="welcome text" className="text-base text-opacity-80">
        <p>
          We’re excited for you to join Syndicate. <br />
          We’ll let you know when you’re in.
        </p>
      </div>
    </div>
  </>
);

const Waitlist: FC = () => {
  const [success, setSuccess] = useState(false);
  return (
    <div
      className="flex h-screen overflow-scroll"
      style={{
        backgroundImage: "url(/images/social/waitlist-bg.svg)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Head title={`${success ? "Waitlist confirmation" : "Waitlist"}`} />
      {success ? (
        successContent
      ) : (
        <>
          <div
            className="container h-screen hidden md:flex flex-col justify-center items-start flex-1 w-4/6 font-whyte-light"
            id="left-column"
          >
            {mainCopy}
          </div>
          <div
            id="right-column"
            className="flex flex-col items-center justify-center w-full md:w-2/6 bg-black bg-opacity-60 px-6 md:px-10 lg:px-16 transition-all overflow-scroll"
          >
            <div className="w-full px-6 sm:px-24 md:px-0 md:w-auto transition-all overflow-y-auto py-12">
              <div className="block md:hidden mb-16">{mainCopy}</div>
              <div id="twitter-profile" className="mb-10">
                <TwitterProfile />
              </div>
              <div id="waitlist-form" className="w-full">
                <WaitlistForm setSuccess={setSuccess} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Waitlist;

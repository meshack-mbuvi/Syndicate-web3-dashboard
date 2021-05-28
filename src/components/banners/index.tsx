import Link from "next/link";
import React, { useEffect, useState } from "react";
import { constants } from "src/components/syndicates/shared/Constants";
import { SyndicateInBetaBannerText } from "../syndicates/shared/Constants";

export const SyndicateInBetaBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  // this banner should be shown in V2
  useEffect(() => {
    const showBanner = JSON.parse(localStorage.getItem("showBanner"));
    const currentDate = new Date().getTime();

    if (showBanner == undefined || null) {
      // check whether current date is passed the timestamp
      setShowBanner(true);
    } else {
      if (currentDate > showBanner.timestamp) {
        setShowBanner(true);
        // clear the localStorage
        localStorage.removeItem("showBanner");
      } else {
        setShowBanner(false);
      }
    }

    return () => {
      setShowBanner(false);
    };
  }, [showBanner]);

  const hideBanner = () => {
    // hide the banner for the next 24 hours
    localStorage.setItem(
      "showBanner",
      JSON.stringify({
        show: "false",
        timestamp: new Date().getTime() + 60 * 60 * 24 * 1000,
      })
    );
    localStorage.setItem("timeUntilNextbanner", "false");
    setShowBanner(false);
  };

  return (
    <div
      className={`pl-4 pr-8 py-3 w-full relative bg-yellow-light text-black text-center ${
        showBanner ? "" : "hidden"
      }`}
      role="alert"
    >
      <p>
        <span className="block sm:inline">{SyndicateInBetaBannerText}</span>{" "}
        <Link href="#">
          <a>
            <strong>Learn more {">"}</strong>
          </a>
        </Link>
        <span className="absolute mx-3 py-1 cursor-pointer absolute right-0">
          <img src="/images/close.svg" alt="" onClick={hideBanner} />
        </span>
      </p>
    </div>
  );
};

// banner text to display at the top of the deposit page
const { depositBannerText } = constants;
export const DepositsPageBanner = () => {
  return (
    <div className="w-full bg-blue-dark px-4 py-4 text-center">
      <p className="text-sm font-extralight">
        <span className="font-medium">IMPORTANT: </span>
        {depositBannerText}
      </p>
    </div>
  );
};

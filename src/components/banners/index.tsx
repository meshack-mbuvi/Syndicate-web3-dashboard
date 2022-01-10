import React from "react";
import { useRouter } from "next/router";
import { SyndicateInBetaBannerText } from "src/components/syndicates/shared/Constants";

export const SyndicateInBetaBanner: React.FC = () => {
  const router = useRouter();
  const showCreateProgressBar =
    router.pathname === "/clubs/create/clubprivatebetainvite" ||
    router.pathname.includes("/legal/sign");
  return (
    <div
      className={`flex flex-wrap items-center justify-center flex-1 space-x-1 mx-auto ${
        showCreateProgressBar ? "bg-black" : ""
      }`}
    >
      <div className="rounded-full py-2 px-4 beta flex items-center justify-center bg-gray-syn7 mt-2">
        {SyndicateInBetaBannerText}
      </div>
    </div>
  );
};

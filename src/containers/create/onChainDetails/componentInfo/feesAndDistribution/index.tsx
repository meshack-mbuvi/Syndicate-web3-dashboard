import RightPlaceHolder from "@/components/rightPlaceholder";
import React from "react";

export const FeesAndDistributionInfo: React.FC = () => (
  <RightPlaceHolder
    title="Learn more about distributions share"
    body={[
      "Annual operating fees are the expenses incurred as a result of running the Syndicate DAO, not for investment advisory services unless the syndicate lead is registered as an investment advisor. Operating fees are assessed manually by the syndicate lead via the protocol.",
      "Share of distributions to the syndicate lead are automatically assessed when distributions are executed manually by the syndicate lead back to the depositors of the Syndicate DAO via the protocol.",
      "A nominal percentage of your choosing of the operating fees and distributions is shared to the Syndicate Protocol treasury to support the ongoing maintenance and development of its open source technology and network. Syndicate Protocol would not be possible without the support from its community and users.",
    ]}
  />
);

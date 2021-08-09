import RightPlaceHolder from "@/components/rightPlaceholder";
import React from "react";

export const DepositAndLimitInfo: React.FC = () => (
  <RightPlaceHolder
    title="Learn more about fees"
    body={[
      `Annual operating fees are the expenses incurred as a result of
            running the syndicate. To avoid being classified a financial
            advisory, it’s important that these fees aren’t compensation for
            investment decisions. Rather, these should be minimum expenses
            incurred in the course of normal operation.`,
    ]}
  />
);

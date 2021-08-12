import RightPlaceHolder from "@/components/rightPlaceholder";
import React from "react";

export const DepositTokenInfo: React.FC = () => (
  <RightPlaceHolder
    title="Learn more about choosing a deposit token"
    body={[
      `While Syndicate supports nearly every commonly used token, we strongly recommend that most syndicates use a stablecoin for deposits. Using a stablecoin avoids a potential ownership change during the investment period due to token price volatility. There are few circumstances in which a syndicate would want to use a non-stable (or at very least, relatively stable) token for deposits.`,
    ]}
  />
);

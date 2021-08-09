import RightPlaceHolder from "@/components/rightPlaceholder";
import React from "react";

export const AllowListInfo: React.FC = () => (
  <RightPlaceHolder
    title="Why should I use an allowlist?"
    body={[
      "Allowlists let you control who can invest in a Syndicate DAO. Without an allowlist, anyone with the Syndicate DAO’s address can deposit into it, which could expose you to risks.",
      "You should check with your counsel on the risks and considerations specific to  your jurisdiction.",
    ]}
  />
);

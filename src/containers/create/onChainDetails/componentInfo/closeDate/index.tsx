import RightPlaceHolder from "@/components/rightPlaceholder";
import React from "react";

export const CloseDateInfo: React.FC = () => (
  <RightPlaceHolder
    title="Why do syndicates need to close to deposits?"
    body={[
      "After the close date, deposits can no longer be made into the Syndicate DAO. This is important, because the deposits determine people’s ownership percentages. These ownership percentages automate distributions back to depositors in the future.",
      "To simulate open-ended or rolling funds, simply create multiple Syndicate DAOs with different close dates.",
    ]}
    link="#"
  />
);

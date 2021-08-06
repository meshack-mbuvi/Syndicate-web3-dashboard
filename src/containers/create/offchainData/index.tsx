import RightPlaceHolder from "@/components/rightPlaceholder";
import React from "react";

export { default as SyndicateType } from "./syndicateType";

export const OffChainDataInfo: React.FC = () => (
  <RightPlaceHolder
    title="When should I add a legal entity?"
    body={[
      "Syndicate DAOs with a legal entity can do things in the real world: invest in SAFEs and equity deals, buy non-crypto assets, get bank accounts, convert crypto to fiat, provide limited liability protection, and more.",
      "Syndicate provides legal entities for free depending on your needs.",
    ]}
  />
);

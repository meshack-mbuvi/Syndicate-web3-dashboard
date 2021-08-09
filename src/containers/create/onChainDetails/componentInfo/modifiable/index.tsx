import RightPlaceHolder from "@/components/rightPlaceholder";
import React from "react";

export const ModifiableInfo: React.FC = () => (
  <RightPlaceHolder
    title="What does it mean for a syndicate to be modifiable?"
    body={[
      "When a syndicate is modifiable, syndicate leads can manually change ownership percentages. This is necessary in particular if your syndicate will accept off-chain assets since you can only record such ownership stakes on-chain if the syndicate is modifiable.",
      "Modifiable syndicates involve a high degree of trust in the syndicate lead and among its members. In contrast, non-modifiable syndicates are best in cases where greater trustlessness, transparency, and efficiency are essential.",
    ]}
  />
);

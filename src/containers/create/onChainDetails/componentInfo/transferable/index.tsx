import RightPlaceHolder from "@/components/rightPlaceholder";
import React from "react";

export const TransferableInfo: React.FC = () => (
  <RightPlaceHolder
    title="What does it mean for a syndicate to be transferable?"
    body={[
      "When a syndicate is transferable, each member may transfer their ownership in the syndicate to any other address. If an allowlist is used, this new address must also be on the allowlist.",
      "Here, you’re setting permissions only for the member. If you chose to make this syndicate modifiable in the previous step, as a manager, you’ll still be able to modify or transfer ownership even if you choose to make the syndicate “not transferable” in this step.",
      "For US-based syndicates, the SEC imposes certain restrictions here. It’s the members responsibility to research and abide by these regulations.",      
    ]}
  />
);

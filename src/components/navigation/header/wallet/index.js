import React from "react";

import { TopBarIconWrapper } from "../topBarIconWrapper";
import Icon from "src/images/greenIcon.svg";

export const Wallet = () => {
  return (
    <TopBarIconWrapper>
      <img src={Icon} className="w-4 pr-1 wallet-icon  mr-2" />
      Loading...
    </TopBarIconWrapper>
  );
};

export default Wallet;

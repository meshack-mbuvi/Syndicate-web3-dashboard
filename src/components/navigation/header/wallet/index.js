import React from "react";

import { TopBarIconWrapper } from "../topBarIconWrapper";
import Icon from "../../../../images/greenIcon.svg";

import "./wallet.css";

export const Wallet = () => {
  return (
    <TopBarIconWrapper>
      <img src={Icon} className="wallet-icon mr-2" />
      Loading...
    </TopBarIconWrapper>
  );
};

export default Wallet;

import React from "react";

import { TopBarIconWrapper } from "../topBarIconWrapper";
import Icon from "src/images/greenIcon.svg";

import "./pendingTx.css";

export const PendingTransaction = () => {
  return (
    <TopBarIconWrapper>
      <img src={Icon} className="pending-tx-icon mr-2" />
      Loading...
    </TopBarIconWrapper>
  );
};

export default PendingTransaction;

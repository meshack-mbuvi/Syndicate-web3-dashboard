import React from "react";

import { TopBarIconWrapper } from "../topBarIconWrapper";
import AlertIcon from "src/images/alert.svg";

export const Notification = () => {
  return (
    <TopBarIconWrapper>
      <img src={AlertIcon} className="pr-1 mr-2" />
      Loading...
    </TopBarIconWrapper>
  );
};

export default Notification;

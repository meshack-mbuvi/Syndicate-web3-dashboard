import React from "react";

import { TopBarIconWrapper } from "../topBarIconWrapper";
// import Icon from "src/images/greenIcon.svg";

export const PendingTransaction = () => {
  return (
    <TopBarIconWrapper>
      {/* <img
        src={Icon}
        className="border-2 rounded-full border-white mr-2 w-4 mt-1 h-4"
      /> */}
      <p className="">Not connected</p>
    </TopBarIconWrapper>
  );
};

export default PendingTransaction;

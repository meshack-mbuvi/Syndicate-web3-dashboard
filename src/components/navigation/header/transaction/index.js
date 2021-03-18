import React from "react";

import TransactionIcon from "src/images/transactionIcon.png";

export const Refresh = () => {
  return (
    <div className="flex px-4 pt-3 mr-2 cursor-pointer">
      <img src={TransactionIcon} className="pr-1 mr-2 h-6 w-8" />
    </div>
  );
};

export default Refresh;

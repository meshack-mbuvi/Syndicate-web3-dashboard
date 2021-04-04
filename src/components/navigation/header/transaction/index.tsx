import React from "react";
<<<<<<< HEAD:src/components/navigation/header/transaction/index.tsx

export const Refresh = () => {
  return (
    <div className="flex px-4 pt-3 mr-2 cursor-pointer">
      <img src="/images/transactionIcon.png" className="pr-1 mr-2 h-6 w-8" />
=======
import TransactionIcon from "src/images/transactionIcon.png";

export const Refresh = () => {
  return (
    <div className="flex px-4 pt-1 mr-1 cursor-pointer">
      <img src={TransactionIcon} className="pr-1 mr-2 h-5 w-7" />
>>>>>>> Show totalDeposits, distributions, totalLpdeposits and lpWithdrawals on my syndicates screen.:src/components/navigation/header/transaction/index.js
    </div>
  );
};

export default Refresh;

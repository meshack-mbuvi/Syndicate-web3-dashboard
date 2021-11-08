import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import React from "react";
import { ifRows } from "./interfaces";

const GetMemberDeposits: React.FC<ifRows> = ({
  row: { depositERC20TokenSymbol, depositAmount },
}) => {
  return (
    <>
      {depositAmount.trim() !== "-"
        ? floatedNumberWithCommas(depositAmount)
        : depositAmount}{" "}
      {depositAmount.trim() !== "-" && depositERC20TokenSymbol}
    </>
  );
};

export default GetMemberDeposits;

import { getWeiAmount } from "@/utils/conversions";
import React, { useEffect, useState } from "react";
import { RootStateOrAny, useSelector } from "react-redux";
import { ifRows } from "./interfaces";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";

const GetMemberDeposits = ({
  row: { syndicateAddress, depositERC20TokenSymbol, tokenDecimals },
}: ifRows) => {
  const {
    web3Reducer: {
      web3: { account },
    },
    initializeContractsReducer: {
      syndicateContracts: { GetterLogicContract },
    },
    syndicatesReducer: { syndicate },
  } = useSelector((state: RootStateOrAny) => state);

  const [memberDeposits, setMemberDeposits] = useState("-");

  // Retrieve and convert member deposits
  const getMemberDeposits = async () => {
    // we need these to be able to access the syndicate contract
    if (!GetterLogicContract || !account) return;

    // Managers do not deposit into a syndicate they manage.
    if (syndicate?.managerCurrent === account) return "-";

    try {
      let { memberDeposit } = await GetterLogicContract.getMemberInfo(
        syndicateAddress,
        account,
      );

      memberDeposit = getWeiAmount(memberDeposit, tokenDecimals, false);

      setMemberDeposits(memberDeposit);
    } catch {
      setMemberDeposits("-");
    }
  };

  useEffect(() => {
    getMemberDeposits();
  }, [account, GetterLogicContract]);

  return (
    <>
      {memberDeposits.trim() !== "-"
        ? floatedNumberWithCommas(memberDeposits)
        : memberDeposits}{" "}
      {memberDeposits.trim() !== "-" && depositERC20TokenSymbol}
    </>
  );
};

export default GetMemberDeposits;

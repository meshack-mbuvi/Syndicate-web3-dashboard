import { getWeiAmount } from "@/utils/conversions";
import React, { useEffect, useState } from "react";
import { RootStateOrAny, useSelector } from "react-redux";
import { ifRows } from "./interfaces";

const GetMemberDeposits = ({
  row: { syndicateAddress, depositERC20TokenSymbol, tokenDecimals },
}: ifRows) => {
  const { web3: web3Wrapper } = useSelector(
    (state: RootStateOrAny) => state.web3Reducer
  );

  const { syndicateContractInstance, account } = web3Wrapper;

  const [memberDeposits, setMemberDeposits] = useState("-");

  const getMemberDeposits = async () => {
    // we need these to be able to access the syndicate contract
    if (!syndicateContractInstance || !account) return;

    // Managers do not deposit into a syndicate they manage.
    if (syndicateAddress === account) return "-";

    try {
      const syndicateMemberInfo = await syndicateContractInstance.methods
        .getMemberInfo(syndicateAddress, account)
        .call();

      const depositsMember = getWeiAmount(
        syndicateMemberInfo[0].toString(),
        tokenDecimals,
        false
      );
      setMemberDeposits(depositsMember);
    } catch (error) {
      setMemberDeposits("-");
      console.log({ error });
    }
  };

  useEffect(() => {
    getMemberDeposits();
  }, [account, syndicateContractInstance]);

  return (
    <>
      {memberDeposits}{" "}
      {memberDeposits.trim() !== "-" && depositERC20TokenSymbol}
    </>
  );
};

export default GetMemberDeposits;

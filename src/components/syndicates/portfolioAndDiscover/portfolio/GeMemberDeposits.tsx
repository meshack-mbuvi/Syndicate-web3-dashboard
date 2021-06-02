import React, { useEffect, useState } from "react";
import { RootStateOrAny, useSelector } from "react-redux";
import { ifRows } from "./interfaces";

const GetMemberDeposits = ({ row: { syndicateAddress } }: ifRows) => {
  const { web3: web3Wrapper } = useSelector(
    (state: RootStateOrAny) => state.web3Reducer
  );

  const { syndicateContractInstance, account, web3 } = web3Wrapper;

  const [memberDeposits, setMemberDeposits] = useState("0");

  const getMemberDeposits = async () => {
    // we need these to be able to access the syndicate contract
    if (!syndicateContractInstance || !account) return;
    try {
      const syndicateMemberInfo = await syndicateContractInstance.methods
        .getMemberInfo(syndicateAddress, account)
        .call();

      setMemberDeposits(web3.utils.fromWei(syndicateMemberInfo[0].toString()));
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    getMemberDeposits();
  }, [account, syndicateContractInstance]);
  return <>{memberDeposits}</>;
};

export default GetMemberDeposits;

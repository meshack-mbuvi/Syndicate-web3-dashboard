import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ifRows } from "./interfaces";

const GetLPDeposits = ({ row: { syndicateAddress } }: ifRows) => {
  const { web3: web3Wrapper } = useSelector(
    (state: RootState) => state.web3Reducer
  );

  const { syndicateInstance, account, web3 } = web3Wrapper;

  const [lpDeposits, setLpDeposits] = useState("0");

  const getLPDeposits = async () => {
    // we need these to be able to access the syndicate contract
    if (!syndicateInstance || !account) return;

    try {
      const syndicateLPInfo = await syndicateInstance.getSyndicateLPInfo(
        syndicateAddress,
        account
      );

      const lpDeposits = syndicateLPInfo[0];

      setLpDeposits(web3.utils.fromWei(lpDeposits.toString()));
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    getLPDeposits();
  }, [account, syndicateInstance]);
  return <>{lpDeposits}</>;
};

export default GetLPDeposits;

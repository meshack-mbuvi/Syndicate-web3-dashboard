import React, { useEffect, useState } from "react";
import { useSelector, RootStateOrAny } from "react-redux";
import { getTotalDistributions } from "@/helpers";
import { ifRows } from "./interfaces";

const GetDistributions = ({
  row: { syndicateAddress, depositERC20ContractAddress },
}: ifRows) => {
  const { web3: web3Wrapper } = useSelector(
    (state: RootStateOrAny) => state.web3Reducer
  );

  const { syndicateInstance, account, web3 } = web3Wrapper;

  const [totalDistributions, setTotalDistributions] = useState("0");

  /** when user account is loaded, let's find the eligible balance for this
   * contract */
  useEffect(() => {
    getTotalDistributions(
      syndicateInstance,
      syndicateAddress,
      depositERC20ContractAddress,
      account
    ).then((distributions) => {
      setTotalDistributions(web3.utils.fromWei(distributions.toString()));
    });
  }, [account, syndicateInstance]);
  return <>{totalDistributions}</>;
};

export default GetDistributions;

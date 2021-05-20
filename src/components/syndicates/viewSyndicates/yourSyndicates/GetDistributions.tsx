import { getTotalDistributions } from "@/helpers";
import React, { useEffect, useState } from "react";
import { RootStateOrAny, useSelector } from "react-redux";
import { ifRows } from "./interfaces";

const GetDistributions = ({
  row: { syndicateAddress, depositERC20ContractAddress },
}: ifRows) => {
  const { web3: web3Wrapper } = useSelector(
    (state: RootStateOrAny) => state.web3Reducer
  );
  const { syndicateContractInstance } = useSelector(
    (state: RootStateOrAny) => state.syndicateInstanceReducer
  );

  const { account, web3 } = web3Wrapper;

  const [totalDistributions, setTotalDistributions] = useState("0");

  /** when user account is loaded, let's find the eligible balance for this
   * contract */
  useEffect(() => {
    getTotalDistributions(
      syndicateContractInstance,
      syndicateAddress,
      depositERC20ContractAddress,
    ).then((distributions) => {
      setTotalDistributions(web3.utils.fromWei(distributions.toString()));
    });
  }, [account, syndicateContractInstance]);
  return <>{totalDistributions}</>;
};

export default GetDistributions;

import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ifRows } from "./interfaces";

const GetClaimedDistributions = ({ row: { syndicateAddress } }: ifRows) => {
  const { web3: web3Wrapper } = useSelector(
    (state: RootState) => state.web3Reducer
  );

  const { syndicateContractInstance, account, web3 } = web3Wrapper;

  const [claimedDistributions, setClaimedDistributions] = useState("0");
  const [syndicateLpInfo, setSyndicateLpInfo] = useState(null);

  const getSyndicateMemberInfo = async () => {
    if (!syndicateContractInstance) return;

    try {
      const syndicateLPInfo = await syndicateContractInstance.methods
        .getMemberInfo(syndicateAddress, account)
        .call();
      setSyndicateLpInfo(syndicateLPInfo);
    } catch (error) {
      console.log({ error });
    }
  };

  /**
   * when syndicateContractInstance is initialized fully, retrieve syndicate
   * memberInfo
   */
  useEffect(() => {
    getSyndicateMemberInfo();
  }, [syndicateContractInstance]);

  /**
   * when syndicateLpInfo is set, retrieve lpDeposits,
   * claimedDistributions(which are totalWithdrawals per erc20 token per lpAddress)
   */
  useEffect(() => {
    if (syndicateLpInfo) {
      setClaimedDistributions(
        web3.utils.fromWei(syndicateLpInfo[1].toString())
      );
    }
  }, [syndicateLpInfo]);

  return <>{claimedDistributions}</>;
};

export default GetClaimedDistributions;

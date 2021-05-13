import React, { useEffect, useState } from "react";
import { useSelector, RootStateOrAny } from "react-redux";
import { ifRows } from "./interfaces";

const GetClaimedDistributions = ({ row: { syndicateAddress } }: ifRows) => {
  const { web3: web3Wrapper } = useSelector(
    (state: RootStateOrAny) => state.web3Reducer
  );

  const { syndicateInstance, account, web3 } = web3Wrapper;

  const [claimedDistributions, setClaimedDistributions] = useState("0");
  const [syndicateLpInfo, setSyndicateLpInfo] = useState(null);

  const getSyndicateLPInfo = async () => {
    try {
      const syndicateLPInfo = await syndicateInstance.getSyndicateLPInfo(
        syndicateAddress,
        account
      );

      setSyndicateLpInfo(syndicateLPInfo);
    } catch (error) {
      console.log({ error });
    }
  };

  /**
   * when syndicateLpInfo is set, retrieve lpDeposits,
   * claimedDistributions(which are totalWithdrawals per erc20 token per lpAddress)
   */
  useEffect(() => {
    getSyndicateLPInfo();

    if (syndicateLpInfo && web3) {
      setClaimedDistributions(
        web3.utils.fromWei(syndicateLpInfo[1].toString())
      );
    }
  }, [syndicateLpInfo]);
  return <>{claimedDistributions}</>;
};

export default GetClaimedDistributions;

import WithdrawSyndicate from "@/components/syndicates/withdrawSyndicate";
import LayoutWithSyndicateDetails from "@/containers/layoutWithSyndicateDetails";
import { setSyndicateAction } from "@/redux/actions/web3Provider";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const SyndicateWithdrawalView = () => {
  // TODO: phase out syndicateActions from the store.
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch to indicate that this is a withdrawal
    // this will in turn load the correct components
    // on the syndicate details page
    const syndicateActions = {
      withdraw: true,
      deposit: false,
      managerView: false,
      generalView: false,
    };

    dispatch(setSyndicateAction(syndicateActions));
    return () => {
      // reset syndicate actions when the component is unmounted
      const syndicateActions = {
        withdraw: false,
        deposit: false,
        managerView: false,
        generalView: false,
      };
      dispatch(setSyndicateAction(syndicateActions));
    };
  });
  return (
    <LayoutWithSyndicateDetails>
      <WithdrawSyndicate />
    </LayoutWithSyndicateDetails>
  )
};

export default SyndicateWithdrawalView;

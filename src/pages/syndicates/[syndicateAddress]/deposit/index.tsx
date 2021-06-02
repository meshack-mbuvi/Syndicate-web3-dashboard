import SyndicateActions from "@/containers/syndicateActions";
import { setSyndicateAction } from "@/redux/actions/web3Provider";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const SyndicateDepositView = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch to indicate that this is a details view
    // this will in turn load the correct components
    // on the syndicate details page.
    const syndicateActions = {
      withdraw: false,
      deposit: true,
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
  return <SyndicateActions />;
};

export default SyndicateDepositView;

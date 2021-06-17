import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { setSyndicateAction } from "@/redux/actions/web3Provider";
import LayoutWithSyndicateDetails from "@/containers/layoutWithSyndicateDetails";
import DepositSyndicate from "@/components/syndicates/depositSyndicate";

const SyndicateDetailsView = () => {
  // TODO: phase out syndicateActions from the store.
  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch to indicate that this is a details view
    // this will in turn load the correct components
    // on the syndicate details page.
    const syndicateActions = {
      withdraw: false,
      deposit: false,
      managerView: false,
      generalView: true,
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
      <DepositSyndicate /> {/* TODO: what goes here? should it be deposits are unavaible?  */}
    </LayoutWithSyndicateDetails>
  )
};

export default connect(null, null)(SyndicateDetailsView);

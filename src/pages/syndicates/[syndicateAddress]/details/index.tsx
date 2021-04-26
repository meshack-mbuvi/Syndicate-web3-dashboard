import React, { useEffect } from "react";
import { connect } from "react-redux";
import SyndicateDeposits from "src/containers/syndicateDeposits";
import { setSyndicateAction } from "src/redux/actions/web3Provider";

const SyndicateDetailsView = (props) => {
  const { dispatch } = props;
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
  });
  return <SyndicateDeposits />;
};

export default connect(null, null)(SyndicateDetailsView);

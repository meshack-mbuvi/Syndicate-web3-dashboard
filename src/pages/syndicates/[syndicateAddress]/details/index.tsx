import React, { useEffect } from "react";
import { connect } from "react-redux";
import SyndicateActions from "@/containers/syndicateActions";
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
  return <SyndicateActions />;
};

export default connect(null, null)(SyndicateDetailsView);

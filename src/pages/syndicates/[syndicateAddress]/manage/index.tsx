import React, { useEffect } from "react";
import { connect } from "react-redux";
import { setSyndicateAction } from "src/redux/actions/web3Provider";
import SyndicateManage from "src/containers/syndicateManage";

/**
 * This page shows the manager component for a given syndicate address
 */
const ManageSyndicatePage = (props) => {
  const { dispatch } = props;
  useEffect(() => {
    // dispatch to indicate that this is a manager view
    // this will in turn load the correct components
    // on the syndicate details page for the current manager
    const syndicateActions = {
      withdraw: false,
      deposit: false,
      managerView: true,
      generalView: false,
    };

    dispatch(setSyndicateAction(syndicateActions));
  });
  return <SyndicateManage />;
};

export default connect(null, null)(ManageSyndicatePage);

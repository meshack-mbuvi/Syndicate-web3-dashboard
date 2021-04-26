import React, { useEffect } from "react";
import { connect } from "react-redux";
import SyndicateDeposits from "src/containers/syndicateDeposits";
import { setSyndicateAction } from "src/redux/actions/web3Provider";

const SyndicateWithdrawalView = (props) => {
  const { dispatch } = props;
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
  });
  return <SyndicateDeposits />;
};

export default connect(null, null)(SyndicateWithdrawalView);

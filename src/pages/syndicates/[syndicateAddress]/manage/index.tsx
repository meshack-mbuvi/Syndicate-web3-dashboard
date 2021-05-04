import SyndicateActions from "@/containers/syndicateActions";
import { setSyndicateAction } from "@/redux/actions/web3Provider";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";

/**
 * This page shows the manager component for a given syndicate address
 */
const ManageSyndicatePage = (props: { web3 }) => {
  const {
    web3: { account },
  } = props;
  const router = useRouter();
  const { syndicateAddress } = router.query;

  const dispatch = useDispatch();
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

    if (syndicateAddress !== undefined && account !== undefined) {
      if (syndicateAddress !== account) {
        router.replace(`/syndicates/${syndicateAddress}/deposit`);
      } else {
        dispatch(setSyndicateAction(syndicateActions));
      }
    }

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

const mapStateToProps = ({ web3Reducer }) => {
  const { web3 } = web3Reducer;
  return { web3 };
};

export default connect(mapStateToProps, null)(ManageSyndicatePage);

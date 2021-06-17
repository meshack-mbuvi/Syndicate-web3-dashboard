import LayoutWithSyndicateDetails from "@/containers/layoutWithSyndicateDetails";
import ManagerActions from "@/containers/managerActions";
import { setSyndicateAction } from "@/redux/actions/web3Provider";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

/**
 * This page shows the manager component for a given syndicate address
 */
const ManageSyndicatePage = () => {
  // TODO: phase out syndicateActions from the store.
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
        <ManagerActions />
    </LayoutWithSyndicateDetails>
  )
};

export default ManageSyndicatePage;

import LayoutWithSyndicateDetails from "@/containers/layoutWithSyndicateDetails";
import ManagerActions from "@/containers/managerActions";

/**
 * This page shows the manager component for a given syndicate address
 */
const ManageSyndicatePage = () => {
  return (
    <LayoutWithSyndicateDetails>
      <ManagerActions />
    </LayoutWithSyndicateDetails>
  );
};

export default ManageSyndicatePage;

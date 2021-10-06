import LayoutWithSyndicateDetails from "@/containers/layoutWithSyndicateDetails";
import ManagerActions from "@/containers/managerActions";
import { withLoggedInUser } from "@/lib/withAuth";

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

export default withLoggedInUser(ManageSyndicatePage);

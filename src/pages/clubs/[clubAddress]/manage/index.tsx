import LayoutWithSyndicateDetails from "@/containers/layoutWithSyndicateDetails";
import ManagerActions from "@/containers/managerActions";

/**
 * This page shows the manager component for a given syndicate address
 */
const ManageSyndicatePage: React.FC = () => {
  return (
    <LayoutWithSyndicateDetails managerSettingsOpen={false} >
      <ManagerActions />
    </LayoutWithSyndicateDetails>
  );
};

export default ManageSyndicatePage;

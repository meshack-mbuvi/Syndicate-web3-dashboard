import ManagerPending from "@/components/syndicates/managerPending";
import LayoutWithSyndicateDetails from "@/containers/layoutWithSyndicateDetails";
import withAuth from "@/lib/withAuth";
import { FC } from "react";

const SyndicateManagerPendingView: FC = () => {
  return (
    <LayoutWithSyndicateDetails>
      <ManagerPending />
    </LayoutWithSyndicateDetails>
  );
};

export default withAuth(SyndicateManagerPendingView);

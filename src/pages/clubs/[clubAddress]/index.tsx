import DepositSyndicate from "@/components/syndicates/depositSyndicate";
import LayoutWithSyndicateDetails from "@/containers/layoutWithSyndicateDetails";

const SyndicateDepositView: React.FC = () => {
  return (
    <LayoutWithSyndicateDetails>
      <DepositSyndicate />
    </LayoutWithSyndicateDetails>
  );
};

export default SyndicateDepositView;

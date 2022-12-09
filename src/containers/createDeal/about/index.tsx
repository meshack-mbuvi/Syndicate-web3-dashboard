import { DealsCreateAbout } from '@/features/deals/components/create/about';
import { useCreateDealContext } from '@/context/createDealContext';

export const AboutDeal: React.FC = () => {
  const {
    name,
    nameError,
    details,
    handleDetailsChange,
    handleNameChange,
    handleShuffle
  } = useCreateDealContext();

  return (
    <DealsCreateAbout
      {...{
        name,
        handleNameChange,
        details,
        handleDetailsChange,
        nameError,
        handleShuffle
      }}
    />
  );
};

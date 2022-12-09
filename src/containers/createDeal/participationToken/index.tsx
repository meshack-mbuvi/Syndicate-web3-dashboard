import { DealsCreateParticipation } from '@/features/deals/components/create/participation';
import { useCreateDealContext } from '@/context/createDealContext';

export const DealParticipationToken: React.FC = () => {
  const { tokenSymbol, handleTokenSymbolChange } = useCreateDealContext();

  return (
    <DealsCreateParticipation
      tokenSymbol={tokenSymbol ? tokenSymbol : ''}
      handleTokenSymbolChange={handleTokenSymbolChange}
    />
  );
};

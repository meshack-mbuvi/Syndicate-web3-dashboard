import {
  DealsCreateWindow,
  SelectedTimeWindow
} from '@/features/deals/components/create/window';
import { useCreateDealContext } from '@/context/createDealContext';

export const DealWindow: React.FC = () => {
  const {
    selectedTimeWindow,
    handleSelectedTimeWindowChange,
    customTime,
    handleCustomTimeChange,
    customDate,
    handleCustomDateChange
  } = useCreateDealContext();

  return (
    <DealsCreateWindow
      selectedTimeWindow={
        selectedTimeWindow ? selectedTimeWindow : SelectedTimeWindow.DAY
      }
      handleSelectedTimeWindowChange={handleSelectedTimeWindowChange}
      customDate={customDate}
      handleCustomDateChange={handleCustomDateChange}
      customTime={customTime}
      handleCustomTimeChange={handleCustomTimeChange}
    />
  );
};

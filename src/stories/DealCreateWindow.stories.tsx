import {
  DealsCreateWindow,
  SelectedTimeWindow
} from '@/features/deals/components/create/window';
import { useState } from 'react';

export default {
  title: '4. Organisms/Deals/Create/Window'
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Template = (args: any) => {
  const [selectedTimeWindow, setSelectedTimeWindow] =
    useState<SelectedTimeWindow | null>(null);
  const [customDate, setCustomDate] = useState<Date>();
  const [customTime, setCustomTime] = useState<string>();
  return (
    <DealsCreateWindow
      selectedTimeWindow={selectedTimeWindow}
      handleSelectedTimeWindowChange={setSelectedTimeWindow}
      customDate={customDate}
      handleCustomDateChange={setCustomDate}
      customTime={customTime}
      handleCustomTimeChange={setCustomTime}
      {...args}
    />
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {};

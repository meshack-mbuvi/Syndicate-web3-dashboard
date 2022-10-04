import PillTabs from '@/components/pillTabs/tabs';
import { useState } from 'react';

export default {
  title: '2. Atoms/Pill Tabs'
};

const Template = (args: any) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  return (
    <PillTabs
      tabs={args.tabs}
      activeIndex={activeTabIndex}
      handleTabChange={setActiveTabIndex}
    />
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  tabs: [{ name: 'Tab A' }, { name: 'Tab B' }, { name: 'Tab C' }]
};

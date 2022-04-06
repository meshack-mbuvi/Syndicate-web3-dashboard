import PillTabs from '@/components/pillTabs/tabs';
import { useState } from 'react';

export default {
  title: 'Atoms/Pill Tabs'
};

const Template = (args) => {
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
Default.args = {
  tabs: [{ name: 'Tab A' }, { name: 'Tab B' }, { name: 'Tab C' }]
};

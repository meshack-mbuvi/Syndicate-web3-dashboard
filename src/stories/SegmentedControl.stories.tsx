import IconGrid from '@/components/icons/grid';
import IconList from '@/components/icons/list';
import SegmentedControl from '@/components/segmentedControl/tabs';
import { useState } from 'react';

export default {
  title: '2. Atoms/Segmented Control'
};

const Template = (args: any) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  return (
    <SegmentedControl
      tabs={args.tabs}
      activeIndex={activeTabIndex}
      handleTabChange={setActiveTabIndex}
    />
  );
};

export const Text = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Text.args = {
  tabs: [{ label: 'Label 1' }, { label: 'Label 2' }, { label: 'Label 3' }]
};

export const Icons = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Icons.args = {
  tabs: [
    {
      label: (
        <IconGrid
          width={19}
          height={19}
          textColorClass="inherit"
          extraClasses="p-0.5"
        />
      )
    },
    {
      label: (
        <IconList
          width={19}
          height={19}
          textColorClass="inherit"
          extraClasses="p-0.5"
        />
      )
    }
  ]
};

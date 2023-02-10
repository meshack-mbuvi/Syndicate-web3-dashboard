import SegmentedControlAndContent from '@/components/segmentedControl/tabsAndContent';
import { useState } from 'react';

export default {
  title: "Molecules/Segmented Control w' Content"
};

const Template = (args: any) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const elementStyles =
    'mx-4 h-full border-dashed border border-gray-syn6 bg-gray-syn8 p-6 text-center uppercase tracking-px font-medium text-sm text-gray-syn5 rounded-lg';
  return (
    <SegmentedControlAndContent
      activeIndex={activeTabIndex}
      handleTabChange={setActiveTabIndex}
      {...args}
    >
      <div className={elementStyles}>
        <div className="vertically-center">Content A</div>
      </div>
      <div className={elementStyles}>
        <div className="vertically-center">Content B</div>
      </div>
      <div className={elementStyles}>
        <div className="vertically-center">Content C</div>
      </div>
    </SegmentedControlAndContent>
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  tabs: [{ label: 'Tab A' }, { label: 'Tab B' }, { label: 'Tab C' }]
};

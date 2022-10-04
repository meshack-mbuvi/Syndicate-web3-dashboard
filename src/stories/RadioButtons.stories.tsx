import { RadioButtons } from '@/components/buttons/radioButtons';
import { useState } from 'react';

export default {
  title: '2. Atoms/Radio Buttons'
};

const Template = (args: any) => {
  const [selectedIndex, setSelectedIndex] = useState();
  return (
    <RadioButtons
      activeIndex={selectedIndex}
      handleIndexChange={setSelectedIndex}
      {...args}
    />
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  options: ['Option 1', 'Option 2', 'Option 3']
};

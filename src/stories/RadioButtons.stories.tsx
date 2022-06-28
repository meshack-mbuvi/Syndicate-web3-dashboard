import { RadioButtons } from '@/components/buttons/radioButtons';
import { useState } from 'react';

export default {
  title: '2. Atoms/Radio Buttons'
};

const Template = (args) => {
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
Default.args = {
  options: ['Option 1', 'Option 2', 'Option 3']
};

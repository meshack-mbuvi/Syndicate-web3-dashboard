import { Accordion } from '@/components/accordion';
import { useState } from 'react';

export default {
  title: '3. Molecules/Accordion'
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Template = (args: any) => {
  const [index, setIndex] = useState(null);
  return (
    <Accordion
      visibleItemIndex={index}
      handleVisibleItemChange={setIndex}
      {...args}
    />
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  items: [
    { title: 'Title A', content: 'Content A' },
    { title: 'Title B', content: 'Content B' },
    { title: 'Title C', content: 'Content C' }
  ]
};

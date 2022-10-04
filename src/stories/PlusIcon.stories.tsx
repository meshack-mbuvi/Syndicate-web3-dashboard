import React from 'react';
import IconPlus from '@/components/icons/plusIcon';

export default {
  title: '2. Atoms/PlusIcon',
  component: IconPlus,
  argTypes: {
    fill: { control: 'color' },
    width: { control: 'number' },
    height: { control: 'number' }
  }
};

const Template = (args: any) => <IconPlus {...args} />;

export const BlueIconPlus = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
BlueIconPlus.args = {
  fill: '#4376FF',
  width: 16,
  height: 16
};

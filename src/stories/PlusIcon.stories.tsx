import React from 'react';
import IconCirclePlus from '@/components/icons/circlePlusIcon';

export default {
  title: '2. Atoms/PlusIcon',
  component: IconCirclePlus,
  argTypes: {
    fill: { control: 'color' },
    width: { control: 'number' },
    height: { control: 'number' }
  }
};

const Template = (args: any) => <IconCirclePlus {...args} />;

export const BlueIconCirclePlus = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
BlueIconCirclePlus.args = {
  fill: '#4376FF',
  width: 16,
  height: 16
};

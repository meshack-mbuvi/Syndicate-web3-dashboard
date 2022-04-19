import React from 'react';
import IconPlus from '@/components/icons/plusIcon';

export default {
  title: 'Atoms/PlusIcon',
  component: IconPlus,
  argTypes: {
    fill: { control: 'color' },
    width: { control: 'number' },
    height: { control: 'number' }
  }
};

const Template = (args) => <IconPlus {...args} />;

export const BlueIconPlus = Template.bind({});
BlueIconPlus.args = {
  fill: '#4376FF',
  width: 16,
  height: 16
};

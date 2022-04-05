import { PillButton } from '@/components/pillButtons';
import React from 'react';

export default {
  title: 'Atoms/Buttons/Pill Button/Regular',
  component: PillButton,
  argTypes: {
    isActive: {
      table: {
        type: { summary: 'boolean' }
      }
    }
  }
};

const Template = (args) => <PillButton {...args}></PillButton>;

export const Default = Template.bind({});
Default.args = {
  children: 'Label'
};

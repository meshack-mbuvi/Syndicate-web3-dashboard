import { PillButton } from '@/components/pillButtons';
import React from 'react';


export default {
  title: 'Atoms/Buttons/Pill Button',
  component: PillButton,
  argTypes: {
      isActive: {
        table: {
          type: { summary: 'boolean' },
        },
      }
  },
};

const Template = (args) => <PillButton {...args}></PillButton>;

export const Primary = Template.bind({});
Primary.args = {
  children: "Label"
};


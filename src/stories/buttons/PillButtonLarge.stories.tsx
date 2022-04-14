import { PillButton } from '@/components/pillButtons';
import { PillButtonLarge } from '@/components/pillButtons/pillButtonsLarge';
import React from 'react';

export default {
  title: 'Atoms/Buttons/Pill Button/Large',
  component: PillButton,
  argTypes: {
    isActive: {
      table: {
        type: { summary: 'boolean' }
      }
    },
    onClick: {
      action: 'clicked'
    }
  }
};

const Template = (args) => <PillButtonLarge {...args}></PillButtonLarge>;

export const Default = Template.bind({});
Default.args = {
  children: 'Label'
};

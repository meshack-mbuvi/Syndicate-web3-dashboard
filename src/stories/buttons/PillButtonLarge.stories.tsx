import { PillButton } from '@/components/pillButtons';
import { PillButtonLarge } from '@/components/pillButtons/pillButtonsLarge';
import React from 'react';

export default {
  title: '2. Atoms/Buttons/Pill Button/Large',
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

const Template = (args: any) => <PillButtonLarge {...args}></PillButtonLarge>;

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  children: 'Label'
};

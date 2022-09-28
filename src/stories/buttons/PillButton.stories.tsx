import { PillButton } from '@/components/pillButtons';
import React from 'react';

export default {
  title: '2. Atoms/Buttons/Pill Button/Regular',
  component: PillButton,
  argTypes: {
    isActive: {
      table: {
        type: { summary: 'boolean' }
      }
    }
  }
};

const Template = (args: any) => <PillButton {...args}></PillButton>;

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  children: 'Label'
};

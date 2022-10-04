import { NavButton, NavButtonType } from '@/components/buttons/navButton';
import React from 'react';

export default {
  title: '2. Atoms/Buttons/Navigation Button',
  component: null,
  argTypes: {
    type: {
      options: [
        NavButtonType.CLOSE,
        NavButtonType.VERTICAL,
        NavButtonType.UP,
        NavButtonType.DOWN
      ],
      control: { type: 'select' }
    },
    onClick: {
      action: 'Clicked'
    }
  }
};

const Template = (args: any) => <NavButton {...args} />;

export const Horizontal = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Horizontal.args = {
  type: NavButtonType.HORIZONTAL
};

export const Vertical = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Vertical.args = {
  type: NavButtonType.VERTICAL
};

export const Close = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Close.args = {
  type: NavButtonType.CLOSE
};

export const Up = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Up.args = {
  type: NavButtonType.UP
};

export const Down = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Down.args = {
  type: NavButtonType.DOWN
};

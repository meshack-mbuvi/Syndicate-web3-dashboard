import { NavButton, NavButtonType } from '@/components/buttons/navButton';
import React from 'react';

export default {
  title: 'Atoms/Buttons/Navigation Button',
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

const Template = (args) => <NavButton {...args} />;

export const Vertical = Template.bind({});
Vertical.args = {
  type: NavButtonType.VERTICAL
};

export const Close = Template.bind({});
Close.args = {
  type: NavButtonType.CLOSE
};

export const Up = Template.bind({});
Up.args = {
  type: NavButtonType.UP
};

export const Down = Template.bind({});
Down.args = {
  type: NavButtonType.DOWN
};

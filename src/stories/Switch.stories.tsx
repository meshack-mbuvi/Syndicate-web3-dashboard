import { Switch, SwitchType } from '@/components/switch';
import React from 'react';


export default {
  title: 'Atoms/Switch',
  component: Switch,
  argTypes: {
    isOn: {
      // description: 'Overwritten description',
      table: {
        type: { summary: 'boolean' },
      },
    },
    extraClasses: {
      table: {
        type: { summary: 'string' },
      },
      control: {
        type: 'text'
      }
    },
    onClick: {
      table: {
        type: { summary: 'function' },
      },
    }
  },
};

const Template = (args) => <Switch {...args}/>;

export const Default = Template.bind({});
Default.args = {
  isOn: true,
};

export const Explicit = Template.bind({});
Explicit.args = {
  isOn: true,
  type: SwitchType.EXPLICIT,
};
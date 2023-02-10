import { Switch, SwitchType } from '@/components/switch';
import React from 'react';

export default {
  title: 'Atoms/Switch',
  component: Switch,
  argTypes: {
    isOn: {
      // description: 'Overwritten description',
      table: {
        type: { summary: 'boolean' }
      }
    },
    extraClasses: {
      table: {
        type: { summary: 'string' }
      },
      control: {
        type: 'text'
      }
    },
    onClick: {
      table: {
        type: { summary: 'function' }
      }
    }
  }
};

const Template = (args: any) => <Switch {...args} />;

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  isOn: true
};

export const Explicit = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Explicit.args = {
  isOn: true,
  type: SwitchType.EXPLICIT
};

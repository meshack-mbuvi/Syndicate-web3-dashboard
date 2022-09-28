import { Callout, CalloutType } from '@/components/callout';
import React from 'react';

export default {
  title: '2. Atoms/Callout',
  component: Callout,
  parameters: {
    componentSubtitle: 'For calling attention'
  },
  argTypes: {
    children: {
      description: 'Inner contents of the callout.',
      table: {
        type: { summary: 'any' }
      },
      control: {
        type: 'text'
      }
    },
    extraClasses: {
      table: {
        type: { summary: 'string' }
      }
    }
  }
};

const Template = (args: any) => <Callout {...args}></Callout>;

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  children:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
};

export const Warning = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Warning.args = {
  type: CalloutType.WARNING,
  children:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
};

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

const Template = (args) => <Callout {...args}></Callout>;

export const Default = Template.bind({});
Default.args = {
  children:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
};

export const Warning = Template.bind({});
Warning.args = {
  type: CalloutType.WARNING,
  children:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
};

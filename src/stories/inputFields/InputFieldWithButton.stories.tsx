import { InputFieldWithAddOn } from '@/components/inputs/inputFieldWithAddOn';
import React from 'react';

export default {
  title: 'Atoms/Input Field/With Button',
  component: InputFieldWithAddOn,
  argTypes: {
    isButtonActive: {
      table: {
        type: { summary: 'boolean' }
      }
    }
  }
};

const Template = (args: any) => <InputFieldWithAddOn {...args} />;

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  value: null,
  placeholderLabel: 'Placeholder label',
  addOn: 'Button',
  extraClasses: ''
};

export const MoreInfo = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
MoreInfo.args = {
  value: null,
  placeholderLabel: 'Placeholder label',
  addOn: 'Button',
  infoLabel:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  extraClasses: ''
};

export const Error = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Error.args = {
  value: null,
  placeholderLabel: 'Placeholder label',
  addOn: 'Button',
  infoLabel:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  isInErrorState: true,
  extraClasses: ''
};

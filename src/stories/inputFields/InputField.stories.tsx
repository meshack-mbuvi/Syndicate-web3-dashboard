import { InputField } from '@/components/inputs/inputField';
import React from 'react';

export default {
  title: 'Atoms/Input Field/Regular',
  component: InputField
};

const Template = (args: any) => <InputField {...args} />;

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  value: null,
  placeholderLabel: 'Placeholder label',
  extraClasses: ''
};

export const MoreInfo = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
MoreInfo.args = {
  value: null,
  placeholderLabel: 'Placeholder label',
  infoLabel:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
  extraClasses: ''
};

export const Error = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Error.args = {
  value: null,
  placeholderLabel: 'Placeholder label',
  infoLabel:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
  isInErrorState: true,
  extraClasses: ''
};

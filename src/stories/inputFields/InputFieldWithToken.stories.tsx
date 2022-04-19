import { InputFieldWithButton } from '@/components/inputs/inputFieldWithButton';
import { InputFieldWithToken } from '@/components/inputs/inputFieldWithToken';
import React from 'react';

export default {
  title: 'Atoms/Input Field/With Token',
  component: InputFieldWithButton,
  argTypes: {
    token: {
      control: { type: 'select' }
    }
  }
};

const Template = (args) => <InputFieldWithToken {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholderLabel: 'Placeholder label'
};

export const MoreInfo = Template.bind({});
MoreInfo.args = {
  placeholderLabel: 'Placeholder label',
  infoLabel:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
};

export const Error = Template.bind({});
Error.args = {
  placeholderLabel: 'Placeholder label',
  infoLabel:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  isInErrorState: true
};

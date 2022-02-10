import { InputFieldWithButton } from '@/components/inputs/inputFieldWithButton';
import { InputFieldWithToken, TokenType } from '@/components/inputs/inputFieldWithToken';
import React from 'react';

export default {
  title: "Atoms/Input Field/With Token",
  component: InputFieldWithButton,
  argTypes: {
    token: {
      options: [TokenType.USDC],
      control: { type: 'select' },
    },
  },
};

const Template = (args) => <InputFieldWithToken {...args}/>;

export const Default = Template.bind({});
Default.args = {
  placeholderLabel: "Placeholder label",
  token: TokenType.USDC
};

export const MoreInfo = Template.bind({});
MoreInfo.args = {
  placeholderLabel: "Placeholder label",
  infoLabel: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  token: TokenType.USDC
};

export const Error = Template.bind({});
Error.args = {
  placeholderLabel: "Placeholder label",
  infoLabel: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  isInErrorState: true,
  token: TokenType.USDC,
};

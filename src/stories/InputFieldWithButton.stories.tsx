import { InputFieldWithButton } from '@/components/inputs/inputFieldWithButton';
import React from 'react';

export default {
  title: "Atoms/Input Field/With Button",
  component: InputFieldWithButton,
  argTypes: {
      isButtonActive: {
        table: {
          type: { summary: 'boolean' },
        },
      }
  },
};

const Template = (args) => <InputFieldWithButton {...args}/>;

export const Default = Template.bind({});
Default.args = {
  value: null,
  placeholderLabel: "Placeholder label",
  buttonLabel: "Button",
  extraClasses: ""
};

export const MoreInfo = Template.bind({});
MoreInfo.args = {
  value: null,
  placeholderLabel: "Placeholder label",
  buttonLabel: "Button",
  infoLabel: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  extraClasses: ""
};

export const Error = Template.bind({});
Error.args = {
  value: null,
  placeholderLabel: "Placeholder label",
  buttonLabel: "Button",
  infoLabel: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  isInErrorState: true,
  extraClasses: ""
};

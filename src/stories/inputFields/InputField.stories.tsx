import { InputField } from '@/components/inputs/inputField';
import React from 'react';

export default {
  title: "Atoms/Input Field/Regular",
  component: InputField,
};

const Template = (args) => <InputField {...args}/>;

export const Default = Template.bind({});
Default.args = {
  value: null,
  placeholderLabel: "Placeholder label",
  extraClasses: ""
};

export const MoreInfo = Template.bind({});
MoreInfo.args = {
  value: null,
  placeholderLabel: "Placeholder label",
  infoLabel: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
  extraClasses: ""
};

export const Error = Template.bind({});
Error.args = {
  value: null,
  placeholderLabel: "Placeholder label",
  infoLabel: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
  isInErrorState: true,
  extraClasses: ""
};

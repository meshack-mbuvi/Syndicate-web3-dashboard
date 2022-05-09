import { InputField } from '@/components/inputs/inputField';
import { InputFieldWithDate } from '@/components/inputs/inputFieldWithDate';
import { ComponentStory } from '@storybook/react';
import React, { useState } from 'react';
import '/node_modules/react-datepicker/dist/react-datepicker.css';
import '/src/styles/custom-datepicker.css';

export default {
  title: '2. Atoms/Input Field/With Date',
  component: InputFieldWithDate
};

const Template: ComponentStory<typeof InputField> = (args) => {
  const [currentDate, setCurrentDate] = useState(null);
  return (
    <InputFieldWithDate
      {...args}
      selectedDate={currentDate}
      onChange={(date) => {
        setCurrentDate(date);
      }}
    />
  );
};

export const Default = Template.bind({});
Default.args = {};

export const MoreInfo = Template.bind({});
MoreInfo.args = {
  infoLabel:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
};

export const Error = Template.bind({});
Error.args = {
  infoLabel:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
  isInErrorState: true
};

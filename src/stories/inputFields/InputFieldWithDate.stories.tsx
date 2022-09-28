import { InputField } from '@/components/inputs/inputField';
import { InputFieldWithDate } from '@/components/inputs/inputFieldWithDate';
import { ComponentStory } from '@storybook/react';
import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/custom-datepicker.css';

export default {
  title: '2. Atoms/Input Field/With Date',
  component: InputFieldWithDate
};

const Template: ComponentStory<typeof InputField> = (args) => {
  const [currentDate, setCurrentDate] = useState(null);
  return (
    <InputFieldWithDate
      {...args}
      // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'Date | unde... Remove this comment to see the full error message
      selectedDate={currentDate}
      onChange={(date) => {
        // @ts-expect-error TS(2345): Argument of type 'Date | null' is not assignable t... Remove this comment to see the full error message
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

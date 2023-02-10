import { PillButtonOutlined } from '@/components/pillButtons/pillButtonOutlined';
import React from 'react';

export default {
  title: 'Atoms/Buttons/Pill Button/Outlined'
};

const Template = (args: any) => (
  <PillButtonOutlined {...args}></PillButtonOutlined>
);

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  children: 'Label'
};

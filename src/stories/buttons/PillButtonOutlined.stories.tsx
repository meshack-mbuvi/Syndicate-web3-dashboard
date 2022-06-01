import { PillButtonOutlined } from '@/components/pillButtons/pillButtonOutlined';
import React from 'react';

export default {
  title: '2. Atoms/Buttons/Pill Button/Outlined'
};

const Template = (args) => <PillButtonOutlined {...args}></PillButtonOutlined>;

export const Default = Template.bind({});
Default.args = {
  children: 'Label'
};

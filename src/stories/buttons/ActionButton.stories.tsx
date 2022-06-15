import { ActionButton } from '@/components/actionButton';
import React from 'react';

export default {
  title: '2. Atoms/Buttons/Action Button',
  component: ActionButton
};

const Template = (args) => <ActionButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  icon: '/images/edit-circle-blue.svg',
  label: 'Edit distribution'
};

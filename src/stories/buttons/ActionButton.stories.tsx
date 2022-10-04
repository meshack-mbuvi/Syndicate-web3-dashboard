import { ActionButton } from '@/components/actionButton';
import React from 'react';

export default {
  title: '2. Atoms/Buttons/Action Button',
  component: ActionButton
};

const Template = (args: any) => <ActionButton {...args} />;

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  icon: '/images/edit-circle-blue.svg',
  label: 'Edit distribution'
};

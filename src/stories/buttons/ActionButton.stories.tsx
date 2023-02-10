import { ActionButton, ActionButtonType } from '@/components/actionButton';
import React from 'react';

export default {
  title: 'Atoms/Buttons/Action Button',
  component: ActionButton
};

const Template = (args: any) => <ActionButton {...args} />;

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  children: 'Button'
};

export const Icon = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Icon.args = {
  icon: '/images/edit-circle-blue.svg',
  children: 'Edit distribution'
};

export const Chevron = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Chevron.args = {
  children: 'Learn more',
  type: ActionButtonType.CHEVRON
};

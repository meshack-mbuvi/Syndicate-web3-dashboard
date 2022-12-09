import { CTAButton, CTAStyle, CTAType } from '@/components/CTAButton';
import React from 'react';

export default {
  title: '2. Atoms/Buttons/CTA/Dark'
};

const Template = (args: any) => <CTAButton {...args}>{args.label}</CTAButton>;

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  type: CTAType.PRIMARY,
  style: CTAStyle.DARK,
  rounded: false,
  label: 'Button',
  fullWidth: false
};

export const Disabled = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Disabled.args = {
  type: CTAType.DISABLED,
  style: CTAStyle.DARK,
  disabled: true,
  rounded: false,
  label: 'Button',
  fullWidth: false
};

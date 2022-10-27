import { CTAButton, CTAStyle, CTAType } from '@/components/CTAButton';
import React from 'react';

export default {
  title: '2. Atoms/Buttons/CTA/Regular'
};

const Template = (args: any) => (
  // <button className={args.className}>{args.label}</button>
  <CTAButton {...args}>{args.label}</CTAButton>
);

export const White = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
White.args = {
  type: CTAType.PRIMARY,
  style: CTAStyle.REGULAR,
  rounded: false,
  label: 'Button',
  fullWidth: false
};

export const Transactional = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Transactional.args = {
  type: CTAType.TRANSACTIONAL,
  style: CTAStyle.REGULAR,
  rounded: false,
  label: 'Button',
  fullWidth: false
};

export const Warning = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Warning.args = {
  type: CTAType.WARNING,
  style: CTAStyle.REGULAR,
  rounded: false,
  label: 'Button',
  fullWidth: false
};

export const InvestmentClub = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
InvestmentClub.args = {
  type: CTAType.INVESTMENT_CLUB,
  style: CTAStyle.REGULAR,
  rounded: false,
  label: 'Button',
  fullWidth: false
};

export const Collective = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Collective.args = {
  type: CTAType.COLLECTIVE,
  style: CTAStyle.REGULAR,
  rounded: false,
  label: 'Button',
  fullWidth: false
};

export const Disabled = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Disabled.args = {
  type: CTAType.DISABLED,
  style: CTAStyle.REGULAR,
  disabled: true,
  rounded: false,
  label: 'Button',
  fullWidth: false
};

export const Error = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Error.args = {
  type: CTAType.ERROR,
  style: CTAStyle.REGULAR,
  disabled: true,
  rounded: false,
  label: 'Button',
  fullWidth: false
};

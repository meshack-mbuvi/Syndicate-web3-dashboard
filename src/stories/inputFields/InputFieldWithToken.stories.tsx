import {
  InputFieldWithToken,
  SymbolDisplay
} from '@/components/inputs/inputFieldWithToken';
import React from 'react';

export default {
  title: 'Atoms/Input Field/With Token',
  argTypes: {
    token: {
      control: { type: 'select' }
    }
  }
};

const Template = (args: any) => <InputFieldWithToken {...args} />;

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  placeholderLabel: 'Placeholder label',
  symbolDisplayVariant: SymbolDisplay.LOGO_AND_SYMBOL,
  depositTokenSymbol: 'TOKN'
};

export const MoreInfo = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
MoreInfo.args = {
  placeholderLabel: 'Placeholder label',
  infoLabel:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  symbolDisplayVariant: SymbolDisplay.LOGO_AND_SYMBOL,
  depositTokenSymbol: 'TOKN'
};

export const Error = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Error.args = {
  placeholderLabel: 'Placeholder label',
  infoLabel:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  isInErrorState: true,
  symbolDisplayVariant: SymbolDisplay.LOGO_AND_SYMBOL,
  depositTokenSymbol: 'TOKN'
};

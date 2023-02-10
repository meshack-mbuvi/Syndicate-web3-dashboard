import {
  Callout,
  CalloutIconPosition,
  CalloutType
} from '@/components/callout';
import IconSignature from '@/components/icons/signature';
import React from 'react';

export default {
  title: 'Atoms/Callout',
  component: Callout,
  parameters: {
    componentSubtitle: 'For calling attention'
  },
  argTypes: {
    children: {
      description: 'Inner contents of the callout.',
      table: {
        type: { summary: 'any' }
      },
      control: {
        type: 'text'
      }
    },
    extraClasses: {
      table: {
        type: { summary: 'string' }
      }
    }
  }
};

const Template = (args: any) => {
  let icon;
  if (
    args.type === CalloutType.REGULAR &&
    args.iconPosition === CalloutIconPosition.INLINE
  ) {
    icon = <IconSignature />;
  } else if (
    args.type === CalloutType.WARNING &&
    args.iconPosition === CalloutIconPosition.INLINE
  ) {
    icon = <IconSignature />;
  } else if (
    args.type === CalloutType.OUTLINE &&
    args.iconPosition === CalloutIconPosition.INLINE
  ) {
    icon = <IconSignature />;
  }
  return <Callout {...args} icon={icon} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  type: CalloutType.REGULAR,
  children:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
};

export const Inline = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Inline.args = {
  type: CalloutType.REGULAR,
  iconPosition: CalloutIconPosition.INLINE,
  children:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
};

export const Top = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Top.args = {
  type: CalloutType.REGULAR,
  iconPosition: CalloutIconPosition.TOP,
  children:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
};

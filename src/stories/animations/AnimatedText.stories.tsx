import { AnimatedText } from '@/components/animatedText';
import React from 'react';

export default {
  title: '1. Quarks/Animated Text',
  component: AnimatedText
};

const Template = (args: any) => (
  <AnimatedText {...args} text="An example of animated text" />
);

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {};

import { AnimatedText } from '@/components/animatedText';
import React from 'react';

export default {
  title: 'Quarks/Animated Text',
  component: AnimatedText
};

const Template = (args) => (
  <AnimatedText {...args} text="An example of animated text" />
);

export const Default = Template.bind({});
Default.args = {};

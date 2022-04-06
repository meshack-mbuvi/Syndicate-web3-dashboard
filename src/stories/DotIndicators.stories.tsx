import { DotIndicators } from '@/components/dotIndicators';
import React from 'react';

export default {
  title: 'Atoms/Dot Indicators'
};

const Template = (args) => <DotIndicators {...args} />;

export const Default = Template.bind({});
Default.args = {
  options: ['Name & Identity', 'Select Option', 'Membership'],
  activeIndex: 1
};

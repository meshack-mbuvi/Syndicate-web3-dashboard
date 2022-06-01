import {
  DotIndicators,
  DotIndicatorsOrientation
} from '@/components/dotIndicators';
import React from 'react';

export default {
  title: '2. Atoms/Dot Indicators',
  argTypes: {
    orientation: {
      options: [
        DotIndicatorsOrientation.VERTICAL,
        DotIndicatorsOrientation.HORIZONTAL
      ],
      control: { type: 'select' }
    }
  }
};

const Template = (args) => <DotIndicators {...args} />;

export const Vertical = Template.bind({});
Vertical.args = {
  options: ['Name & Identity', 'Select Option', 'Membership'],
  activeIndex: 1,
  orientation: DotIndicatorsOrientation.VERTICAL
};

export const Horizontal = Template.bind({});
Horizontal.args = {
  options: ['Name & Identity', 'Select Option', 'Membership'],
  activeIndex: 1,
  orientation: DotIndicatorsOrientation.HORIZONTAL
};

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

const Template = (args: any) => <DotIndicators {...args} />;

export const Vertical = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Vertical.args = {
  options: ['Name & Identity', 'Select Option', 'Membership'],
  activeIndex: 1,
  orientation: DotIndicatorsOrientation.VERTICAL
};

export const Horizontal = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Horizontal.args = {
  options: ['Name & Identity', 'Select Option', 'Membership'],
  activeIndex: 1,
  orientation: DotIndicatorsOrientation.HORIZONTAL
};

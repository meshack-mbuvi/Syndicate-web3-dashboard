import { ICBrandedWrapper } from '@/components/icBrandedWrapper';
import React from 'react';

export default {
  title: '3. Molecules/IC Branded Wrapper'
};

const Template = (args: any) => <ICBrandedWrapper {...args} />;

export const BottomTitle = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
BottomTitle.args = {
  bottomTitle: 'When will deposits close?',
  customClasses: 'w-11/12 mx-auto mt-6',
  children: (
    <div className="h-40 border-dashed border border-gray-syn6 bg-gray-syn8 p-6 text-center uppercase tracking-px font-medium text-sm text-gray-syn5 rounded-lg">
      <div className="vertically-center">Content</div>
    </div>
  )
};

export const Wrapped = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Wrapped.args = {
  customClasses: 'w-11/12 mx-auto mt-6',
  children: (
    <div className="h-40 border-dashed border border-gray-syn6 bg-gray-syn8 p-6 text-center uppercase tracking-px font-medium text-sm text-gray-syn5 rounded-lg">
      <div className="vertically-center">Content</div>
    </div>
  )
};

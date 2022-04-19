import { ICBrandedWrapper } from '@/components/icBrandedWrapper';
import React from 'react';

export default {
  title: 'Molecules/IC Branded Wrapper'
};

const Template = (args) => <ICBrandedWrapper {...args} />;

export const BottomTitle = Template.bind({});
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
Wrapped.args = {
  customClasses: 'w-11/12 mx-auto mt-6',
  children: (
    <div className="h-40 border-dashed border border-gray-syn6 bg-gray-syn8 p-6 text-center uppercase tracking-px font-medium text-sm text-gray-syn5 rounded-lg">
      <div className="vertically-center">Content</div>
    </div>
  )
};

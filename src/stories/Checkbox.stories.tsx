import { Checkbox } from '@/components/inputs/simpleCheckbox';
import React, { useState } from 'react';

export default {
  title: '2. Atoms/Checkbox'
};

const Template = (args: any) => {
  const [isActive, setIsActive] = useState(true);
  return <Checkbox {...args} isActive={isActive} onChange={setIsActive} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {};

export const Partial = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Partial.args = {
  usePartialCheck: true
};

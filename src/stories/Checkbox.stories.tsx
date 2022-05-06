import { Checkbox } from '@/components/inputs/simpleCheckbox';
import React, { useState } from 'react';

export default {
  title: '2. Atoms/Checkbox'
};

const Template = (args) => {
  const [isActive, setIsActive] = useState(true);
  return <Checkbox {...args} isActive={isActive} onChange={setIsActive} />;
};

export const Default = Template.bind({});
Default.args = {};

export const Partial = Template.bind({});
Partial.args = {
  usePartialCheck: true
};

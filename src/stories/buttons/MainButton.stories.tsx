import React from 'react';

export default {
  title: 'Atoms/Buttons/Main Button',
  component: null,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
};

const Template = (args) => (
  <button className={args.className}>{args.label}</button>
);

export const Primary = Template.bind({});
Primary.args = {
  className: 'primary-CTA',
  label: 'Button'
};

export const Advance = Template.bind({});
Advance.args = {
  className: 'green-CTA',
  label: 'Button'
};

export const Warning = Template.bind({});
Warning.args = {
  className: 'orange-CTA',
  label: 'Button'
};

export const Disabled = Template.bind({});
Disabled.args = {
  className: 'primary-CTA-disabled',
  label: 'Button'
};

Primary.parameters = {
  docs: {
    storyDescription: 'Use class `primary-CTA`.'
  }
};

Advance.parameters = {
  docs: {
    storyDescription: 'Use class `green-CTA`.'
  }
};

Warning.parameters = {
  docs: {
    storyDescription: 'Use class `orange-CTA`.'
  }
};

Disabled.parameters = {
  docs: {
    storyDescription: 'Use class `primary-CTA`.'
  }
};

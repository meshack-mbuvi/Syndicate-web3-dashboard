import React from 'react';

export default {
  title: '2. Atoms/Buttons/CTA Button',
  component: null,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
};

const Template = (args: any) => (
  <button className={args.className}>{args.label}</button>
);

export const Primary = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Primary.args = {
  className: 'primary-CTA',
  label: 'Button'
};

export const Advance = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Advance.args = {
  className: 'green-CTA',
  label: 'Button'
};

export const Warning = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Warning.args = {
  className: 'orange-CTA',
  label: 'Button'
};

export const Disabled = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Disabled.args = {
  className: 'primary-CTA-disabled',
  label: 'Button'
};

// @ts-expect-error TS(2339): Property 'parameters' does not exist on type '(arg... Remove this comment to see the full error message
Primary.parameters = {
  docs: {
    storyDescription: 'Use class `primary-CTA`.'
  }
};

// @ts-expect-error TS(2339): Property 'parameters' does not exist on type '(arg... Remove this comment to see the full error message
Advance.parameters = {
  docs: {
    storyDescription: 'Use class `green-CTA`.'
  }
};

// @ts-expect-error TS(2339): Property 'parameters' does not exist on type '(arg... Remove this comment to see the full error message
Warning.parameters = {
  docs: {
    storyDescription: 'Use class `orange-CTA`.'
  }
};

// @ts-expect-error TS(2339): Property 'parameters' does not exist on type '(arg... Remove this comment to see the full error message
Disabled.parameters = {
  docs: {
    storyDescription: 'Use class `primary-CTA`.'
  }
};

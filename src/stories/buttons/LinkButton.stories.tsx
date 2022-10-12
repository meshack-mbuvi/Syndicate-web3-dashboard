import { LinkButton, LinkType } from '@/components/linkButtons';
import React from 'react';

export default {
  title: '2. Atoms/Buttons/Link Button',
  component: LinkButton,
  argTypes: {
    type: {
      options: [LinkType.CALENDAR, LinkType.MEMBER],
      control: { type: 'select' }
    }
  }
};

const Template = (args: any) => <LinkButton {...args} />;

export const Primary = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Primary.args = {
  type: LinkType.CALENDAR,
  label: 'Button'
};

export const AddMember = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
AddMember.args = {
  type: LinkType.MEMBER,
  label: 'Button'
};

export const Link = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Link.args = {
  children: 'Learn more',
  URL: 'https://storybook.syndicate.io'
};

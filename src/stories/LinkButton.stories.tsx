import { LinkButton, LinkType } from '@/components/linkButtons';
import React from 'react';


export default {
  title: 'Atoms/Buttons/Link Button',
  component: LinkButton,
  argTypes: {
    type: {
      options: [LinkType.CALENDAR],
      control: { type: 'select' },
    },
  },
};

const Template = (args) => <LinkButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  type: LinkType.CALENDAR,
  label: "Button"
};

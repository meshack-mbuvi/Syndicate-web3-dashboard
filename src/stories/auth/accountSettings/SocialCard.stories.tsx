import SocialCard, {
  AuthType
} from '@/features/auth/components/AccountSetting/SocialCard';
import React from 'react';

export default {
  title: '3. Molecules/Auth/Social Card',
  argTypes: {
    authType: {
      options: [AuthType.Discord, AuthType.Twitter],
      control: { type: 'select' }
    }
  }
};

const Template = (args: any) => <SocialCard {...args} />;

export const Discord = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Discord.args = {
  username: 'Victor#1234',
  authType: AuthType.Discord
};

export const Twitter = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Twitter.args = {
  username: '@alex',
  profileIcon: '/images/collectives/alex.jpg',
  authType: AuthType.Twitter
};

export const Unlinked = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Unlinked.args = {
  username: ''
};

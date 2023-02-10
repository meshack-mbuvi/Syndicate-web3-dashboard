import SocialAccounts from '@/features/auth/components/settings/SocialAccounts';
import { AuthType } from '@/features/auth/components/settings/SocialCard';
import React from 'react';

export default {
  title: 'Organisms/Auth/Social Accounts',
  argTypes: {
    authType: {
      options: [AuthType.Discord, AuthType.Twitter],
      control: { type: 'select' }
    },
    handleAccountLink: {
      action: 'Action clicked'
    }
  }
};

const Template = (args: any) => <SocialAccounts {...args} />;

export const Discord = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Discord.args = {
  username: 'Mutai#1234',
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
  username: '',
  authType: AuthType.Discord
};

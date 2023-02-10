import AccountInfoWithAvatar from '@/features/auth/components/settings/AccountInfoWithAvatar';
import { AuthType } from '@/features/auth/components/settings/SocialCard';

export default {
  title: 'Molecules/Auth/Wallet Address With Avatar'
};

const Template = (args: any) => {
  return <AccountInfoWithAvatar {...args} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  ens: 'mutai.eth',
  address: '0x81887984c1B741dE34CeC428A2a464430306Dc53'
};

export const WithoutEns = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
WithoutEns.args = {
  ens: '',
  address: '0x81887984c1B741dE34CeC428A2a464430306Dc53'
};

export const Warning = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Warning.args = {
  ens: 'mutai.eth',
  address: '0x81887984c1B741dE34CeC428A2a464430306Dc53',
  warning: true
};

export const Discord = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Discord.args = {
  warning: true,
  authType: AuthType.Discord,
  username: 'Bertie#1234'
};

export const Twitter = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Twitter.args = {
  warning: true,
  authType: AuthType.Twitter,
  username: '@alex',
  avatar: '/images/collectives/alex.jpg'
};

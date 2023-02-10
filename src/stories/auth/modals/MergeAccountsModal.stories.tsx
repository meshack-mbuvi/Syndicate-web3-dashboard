import { AuthType } from '@/features/auth/components/settings/SocialCard';
import MergeAccountsModal from '@/features/auth/components/modals/MergeAccountsModal';
import { useState } from '@storybook/addons';

export default {
  title: 'Organisms/Auth/Modal/Merge Accounts'
};

const Template = (args: any) => {
  const [showModal, closeModal] = useState(true);
  return (
    <MergeAccountsModal
      showModal={showModal}
      closeModal={closeModal as any}
      {...args}
    />
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  socialAccounts: [
    {
      username: 'Bertie#1234',
      authType: AuthType.Discord
    }
  ],
  newWalletAddress: '0x0936544BDD45DBC4E26771aFe038Bf9C17ae5162',
  walletAccounts: ['0x81887984c1B741dE34CeC428A2a464430306Dc53']
};

export const MultipleWallets = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
MultipleWallets.args = {
  socialAccounts: [
    {
      username: 'Bertie#1234',
      authType: AuthType.Discord
    }
  ],
  newWalletAddress: '0x0936544BDD45DBC4E26771aFe038Bf9C17ae5162',
  walletAccounts: [
    '0x81887984c1B741dE34CeC428A2a464430306Dc53',
    '0x2274156925a2c4e46410dd8D956302d8c415eEF6'
  ]
};

export const Twitter = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Twitter.args = {
  socialAccounts: [
    {
      username: '@alex',
      authType: AuthType.Twitter,
      avatar: '/images/collectives/alex.jpg'
    }
  ],
  newWalletAddress: '0x0936544BDD45DBC4E26771aFe038Bf9C17ae5162',
  walletAccounts: ['0x2274156925a2c4e46410dd8D956302d8c415eEF6']
};

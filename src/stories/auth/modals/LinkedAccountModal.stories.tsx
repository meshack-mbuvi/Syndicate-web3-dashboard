import { AuthType } from '@/features/auth/components/settings/SocialCard';
import LinkedAccountModal, {
  ModalAction
} from '@/features/auth/components/modals/LinkedAccountModal';
import { useState } from '@storybook/addons';

export default {
  title: 'Organisms/Auth/Modal/Linked Account',
  argTypes: {
    authType: {
      options: [AuthType.Discord, AuthType.Twitter],
      control: { type: 'select' }
    },
    modalAction: {
      options: [
        ModalAction.MergeAccounts,
        ModalAction.LinkedSocial,
        ModalAction.LinkedWallet
      ],
      control: { type: 'select' }
    }
  }
};

const Template = (args: any) => {
  const [showModal, closeModal] = useState(true);
  return (
    <LinkedAccountModal
      showModal={showModal}
      closeModal={closeModal as any}
      {...args}
    />
  );
};

export const MergeAccounts = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
MergeAccounts.args = {
  ens: 'bertie.eth',
  address: '0x81887984c1B741dE34CeC428A2a464430306Dc53',
  modalAction: ModalAction.MergeAccounts
};

export const LinkedSocialAccount = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
LinkedSocialAccount.args = {
  ens: 'bertie.eth',
  address: '0x81887984c1B741dE34CeC428A2a464430306Dc53',
  modalAction: ModalAction.LinkedSocial,
  authType: AuthType.Discord,
  username: 'Bertie#1234',
  avatar: '/images/collectives/alex.jpg'
};

export const LinkedWalletAccount = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
LinkedWalletAccount.args = {
  ens: '',
  address: '0x81887984c1B741dE34CeC428A2a464430306Dc53',
  modalAction: ModalAction.LinkedWallet
};

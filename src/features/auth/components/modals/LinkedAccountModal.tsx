import React from 'react';
import Modal, { ModalStyle } from '@/components/modal';
import { H4, B2 } from '@/components/typography';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import AccountInfoWithAvatar from '../settings/AccountInfoWithAvatar';
import { AuthType } from '../settings/SocialCard';
import { CTAButton, CTAStyle, CTAType } from '@/components/CTAButton';

export enum ModalAction {
  MergeAccounts = 'Merge Accounts',
  LinkedWallet = 'Linked Wallet',
  LinkedSocial = 'Linked Social'
}

interface ILinkedAccountModal {
  showModal: boolean;
  closeModal: () => void;
  address: string;
  ens: string;
  warning?: boolean;
  modalAction?: ModalAction;
  authType?: AuthType;
  username?: string;
  avatar?: string;
}

const actions = {
  [ModalAction.MergeAccounts]: {
    title: 'This wallet is already linked to a different Syndicate account',
    desc: 'To add this wallet to the account you’re currently signed in to, either merge them from here or sign in to the other account and unlink it manually.',
    btn: 'Merge accounts'
  },
  [ModalAction.LinkedWallet]: {
    title: 'This wallet is already linked to a different Syndicate account',
    desc: 'To add this wallet to the account you’re currently signed in to, you’ll have to manually unlink it from the other account first.',
    btn: 'Sign out'
  },
  [ModalAction.LinkedSocial]: {
    title:
      'This social account is already linked to a different Syndicate account',
    desc: 'To add this social account to the account you’re currently signed in to, you’ll have to manually unlink it from the other account first.',
    btn: 'Sign out'
  }
};

const LinkedAccountModal: React.FC<ILinkedAccountModal> = ({
  showModal,
  closeModal,
  ens,
  authType,
  username,
  avatar,
  address = '',
  warning = true,
  modalAction = ModalAction.MergeAccounts
}) => {
  const handleMerge = (): void => {
    // TODO: [Auth] unlink Stych
  };

  return (
    <Modal
      modalStyle={ModalStyle.DARK}
      show={showModal}
      closeModal={closeModal}
      showCloseButton={false}
      outsideOnClick={true}
      showHeader={false}
      overflow="overflow-x-visible"
      overflowYScroll={false}
      isMaxHeightScreen={false}
      overflowXScroll={false}
      maxHeight={false}
      customWidth="max-w-120"
      customClassName="p-10"
    >
      <div className="flex flex-col max-w-120">
        <AccountInfoWithAvatar
          {...{ ens, address, warning, authType, username, avatar }}
        />
        <H4 extraClasses="text-center mt-8">{actions[modalAction].title}</H4>
        <B2 extraClasses="text-gray-syn3 mt-4 mb-8 text-center">
          {actions[modalAction].desc}
        </B2>

        <CTAButton
          style={CTAStyle.REGULAR}
          type={CTAType.PRIMARY}
          extraClasses="mt-4 py-4"
          onClick={handleMerge}
        >
          {actions[modalAction].btn}
        </CTAButton>

        <CTAButton
          style={CTAStyle.BLANK}
          type={CTAType.PRIMARY}
          extraClasses="mt-4 flex flex-row items-center space-x-2 self-center text-gray-syn4"
          onClick={handleMerge}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>
            Add a different&nbsp;
            {modalAction === ModalAction.LinkedSocial ? 'social ' : ''}
            wallet
          </span>
        </CTAButton>
      </div>
    </Modal>
  );
};

export default LinkedAccountModal;

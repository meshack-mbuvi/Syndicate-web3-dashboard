import React from 'react';
import Modal, { ModalStyle } from '@/components/modal';
import { E2, H4, L2 } from '@/components/typography';
import DiscordIcon from '@/components/icons/social/discord';
import { formatAddress } from '@/utils/formatAddress';
import { AuthType } from '../settings/SocialCard';
import { CTAButton, CTAStyle, CTAType } from '@/components/CTAButton';

const MergeAccountsModal: React.FC<{
  showModal: boolean;
  closeModal: () => void;
  newWalletAddress: string;
  socialAccounts: {
    username: string;
    authType: AuthType;
    avatar?: string;
  }[];
  walletAccounts: string[];
}> = ({
  showModal,
  closeModal,
  newWalletAddress,
  socialAccounts,
  walletAccounts
}) => {
  return (
    <Modal
      modalStyle={ModalStyle.DARK}
      show={showModal}
      closeModal={closeModal}
      showCloseButton={true}
      outsideOnClick={true}
      showHeader={false}
      overflow="overflow-x-visible"
      overflowYScroll={false}
      isMaxHeightScreen={false}
      overflowXScroll={false}
      maxHeight={false}
      customWidth="w-120"
      customClassName="pt-6 px-5 pb-8"
      closeButtonPosition="top-6 right-10"
    >
      <div className="flex flex-col">
        <L2 extraClasses="pl-5">Merge accounts</L2>
        <div className="mb-8 mt-6 pt-4 pb-5 border border-gray-syn6 rounded-1.5lg">
          <H4 extraClasses="px-5" regular>
            This account
          </H4>
          <div className="flex flex-col space-y-4 mt-4 px-5">
            <div className="flex flex-col space-y-3">
              <E2 extraClasses="text-gray-syn4">social accounts</E2>
              {socialAccounts.map((acc) => (
                <div key={acc.username} className="flex flex-row space-x-2">
                  {AuthType.Discord === acc.authType ? (
                    <DiscordIcon height={24} width={24} />
                  ) : (
                    <img
                      src={acc.avatar}
                      alt="avator"
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span>{acc.username}</span>
                  <span className="text-gray-syn4">
                    {acc.authType.toString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-col space-y-3">
              <E2 extraClasses="text-gray-syn4">wallets</E2>
              {walletAccounts.map((wallet) => (
                <div className="flex flex-row space-x-2" key={wallet}>
                  <img
                    src="/images/jazzicon.png"
                    alt="avator"
                    className="w-6 h-6"
                  />
                  <span>
                    <span className="text-gray-syn4">0x</span>
                    <span className="inline-block">
                      {formatAddress(wallet.slice(2), 4, 4)}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative border-b border-gray-syn6 w-full my-5">
            <div className="absolute flex justify-center items-center w-7 h-7 border border-gray-syn6 rounded-1.5lg sm:right-52 right-1/2 -top-3.5 bg-gray-syn8">
              <img src="/images/plus-gray.svg" alt="add" className="w-3 h-3" />
            </div>
          </div>

          <H4 extraClasses="px-5" regular>
            Merging with
          </H4>
          <div className="flex flex-col space-y-4 mt-4 px-5">
            <div className="flex flex-row space-x-2">
              <img
                src="/images/jazzicon.png"
                alt="avator"
                className="w-6 h-6"
              />
              <span>
                <span className="text-gray-syn4">0x</span>
                <span className="inline-block">
                  {formatAddress(newWalletAddress.slice(2), 4, 4)}
                </span>
              </span>
            </div>
          </div>
        </div>

        <CTAButton
          style={CTAStyle.REGULAR}
          type={CTAType.PRIMARY}
          extraClasses="py-4"
        >
          Merge accounts
        </CTAButton>
      </div>
    </Modal>
  );
};

export default MergeAccountsModal;

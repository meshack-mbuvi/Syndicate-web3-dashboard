import { CTAButton, CTAStyle, CTAType } from '@/components/CTAButton';
import Modal, { ModalStyle } from '@/components/modal';
import { H4, B2 } from '@/components/typography';
import React from 'react';

interface IUnlinkLastAccountModal {
  showModal: boolean;
  closeModal: () => void;
}

const UnlinkLastAccountModal: React.FC<IUnlinkLastAccountModal> = ({
  showModal,
  closeModal
}) => {
  const handleUnlink = (): void => {
    // TODO: [Auth] delete Stych
  };

  const handleLink = (): void => {
    // TODO: [Auth] link Stych
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
      <div className="flex flex-col max-w-120 justify-center">
        <img
          src="/images/syndicateStatusIcons/warning-triangle-gray.svg"
          alt="avator"
          className="w-16 h-16 self-center"
        />
        <H4 extraClasses="text-center mt-8">
          You’re required to have at least one social account or wallet linked
        </H4>

        <B2 extraClasses="text-center text-gray-syn3 pt-4 pb-8">
          <span className="flex flex-col space-y-2">
            <span>
              Before unlinking this social account, you need to link another
              social account or wallet to preserve your Syndicate account.
            </span>
            <span>This is to ensure you always have a way to login.</span>
          </span>
        </B2>

        <CTAButton
          style={CTAStyle.REGULAR}
          type={CTAType.PRIMARY}
          extraClasses="py-4"
          onClick={handleLink}
        >
          Link another social account or wallet
        </CTAButton>

        <CTAButton
          style={CTAStyle.BLANK}
          type={CTAType.PRIMARY}
          extraClasses="mt-4 text-red-error"
          onClick={handleUnlink}
        >
          Unlink anyway and delete account
        </CTAButton>
      </div>
    </Modal>
  );
};

export default UnlinkLastAccountModal;

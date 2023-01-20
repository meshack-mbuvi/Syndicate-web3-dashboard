import { Accordion } from '@/components/accordion';
import { CTAButton, CTAStyle, CTAType } from '@/components/CTAButton';
import Modal, { ModalStyle } from '@/components/modal';
import { H4 } from '@/components/typography';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import React, { useState } from 'react';
import AccountInfoWithAvatar from '../settings/AccountInfoWithAvatar';

interface IUnlinkAccountModal {
  showModal: boolean;
  closeModal: () => void;
  address: string;
  ens: string;
}

const UnlinkAccountModal: React.FC<IUnlinkAccountModal> = ({
  showModal,
  closeModal,
  ens,
  address = ''
}) => {
  const [visibleDrawerIndex, setVisibleDrawerIndex] = useState<number | null>(
    null
  );

  const handleUnlink = (): void => {
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
        <AccountInfoWithAvatar ens={ens} address={address} />
        <H4 extraClasses="text-center mt-8">
          Unlink this wallet from your Syndicate account?
        </H4>
        <div className="my-8">
          <Accordion
            visibleItemIndex={visibleDrawerIndex}
            handleVisibleItemChange={setVisibleDrawerIndex}
            titleClassName="text-sm tracking-0.1px"
            items={[
              {
                title:
                  'What will happen to the Investment Clubs or Collectives associated with this wallet?',
                content:
                  'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s'
              },
              {
                title: 'Can I continue using this wallet on Syndicate?',
                content:
                  'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s'
              }
            ]}
          />
        </div>

        <CTAButton
          style={CTAStyle.REGULAR}
          type={CTAType.PRIMARY}
          extraClasses="py-4"
          onClick={handleUnlink}
        >
          Yes, unlink wallet
        </CTAButton>

        <CTAButton
          style={CTAStyle.BLANK}
          type={CTAType.PRIMARY}
          extraClasses="mt-4 flex flex-row items-center space-x-2 self-center text-gray-syn3"
          onClick={closeModal}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>No, go back</span>
        </CTAButton>
      </div>
    </Modal>
  );
};

export default UnlinkAccountModal;

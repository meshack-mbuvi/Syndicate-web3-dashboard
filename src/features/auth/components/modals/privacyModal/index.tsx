import { Drawers } from '@/components/drawers';
import IconUserPrivacy from '@/components/icons/userPrivacy';
import Modal, { ModalStyle } from '@/components/modal';
import { B3, H4 } from '@/components/typography';
import { useState } from 'react';

interface Props {
  show: boolean;
  closeModal: () => void;
}

export const DataStoragePrivacyModal: React.FC<Props> = ({
  show,
  closeModal
}) => {
  const [visibleDrawerIndex, setVisibleDrawerIndex] = useState<number | null>(
    null
  );
  return (
    <Modal
      show={show}
      closeModal={closeModal}
      modalStyle={ModalStyle.DARK}
      customClassName="p-8 max-w-120"
      showHeader={false}
    >
      <>
        <div className="flex space-x-2 items-center mb-3">
          <IconUserPrivacy width={32} height={32} />
          <H4>How is my data stored?</H4>
        </div>
        <B3 extraClasses="text-gray-syn3 mb-6">
          Syndicate does not currently store or sell any data. Linkages between
          your social accounts and wallets are stored by{' '}
          <a
            href="https://stytch.com/"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Stytch
          </a>
          , a third-party provider.
        </B3>
        <Drawers
          items={[
            {
              title: 'Wallets + social accounts',
              content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident'
            },
            {
              title: 'Investment clubs + collectives',
              content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint'
            },
            {
              title: 'Activity + assets',
              content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
            }
          ]}
          visibleItemIndex={visibleDrawerIndex}
          handleVisibleItemChange={setVisibleDrawerIndex}
        />
      </>
    </Modal>
  );
};

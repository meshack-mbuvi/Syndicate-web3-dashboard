import React from 'react';
import Modal, { ModalStyle } from '@/components/modal';
import { CTAButton } from '@/components/CTAButton';
import { useRouter } from 'next/router';

interface INavToClubSettingsModal {
  showMintNavToClubSettings: boolean;
  setShowMintNavToClubSettings: (status: boolean) => void;
}

const NavToClubSettingsModal: React.FC<INavToClubSettingsModal> = ({
  showMintNavToClubSettings,
  setShowMintNavToClubSettings
}): React.ReactElement => {
  const router = useRouter();
  const { clubAddress } = router.query;
  return (
    <Modal
      {...{
        show: showMintNavToClubSettings,
        modalStyle: ModalStyle.DARK,
        showCloseButton: false,
        customWidth: 'w-full max-w-480',
        outsideOnClick: true,
        closeModal: () => {
          setShowMintNavToClubSettings(false);
        },
        customClassName: 'pt-8 pb-10 px-10',
        showHeader: false,
        overflowYScroll: false,
        overflow: 'overflow-visible'
      }}
    >
      <div className="text-center">
        <div className="space-y-2 mb-8">
          <p className="text-md md:text-xl text-white pt-2">
            Your club is currently closed to deposits.
          </p>
          <p className="text-gray-syn4 text-base font-whyte leading-6">
            To add new members, you need to open your club to deposits from your
            club settings.
          </p>
          <div className="w-full flex justify-center items-center">
            <a
              href="https://guide.syndicate.io/en/products/investment-clubs/modify-club-settings"
              className="flex items-center justify-center"
              target="_blank"
              rel="noreferrer"
            >
              <span className="text-blue mr-2">Learn more</span>
              <img
                className="w-3 h-3"
                src="/images/externalLink.svg"
                alt="external-link"
              />
            </a>
          </div>
        </div>
        <CTAButton
          fullWidth={false}
          onClick={() => {
            // push to localstorage to show specific details on the settings page and also later on in the
            // club details page.
            localStorage.setItem(
              'mintingForClosedClub',
              JSON.stringify({
                mintingForClosedClub: true,
                clubAddress
              })
            );
            router.replace(`/clubs/${clubAddress}/modify`);
          }}
        >
          <span className="text-black">Go to club settings</span>
        </CTAButton>
      </div>
    </Modal>
  );
};

export default NavToClubSettingsModal;

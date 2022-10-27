import React, { useState } from 'react';
import Modal, { ModalStyle } from '@/components/modal';
import { B2, B3 } from '@/components/typography';
import CopyToClipboard from 'react-copy-to-clipboard';
import TrashIcon from '@/components/icons/TrashIcon';
import {
  CopyToClipboardIcon,
  ExternalLinkColor,
  ExternalLinkIcon
} from '@/components/iconWrappers';
import { formatAddress } from '@/utils/formatAddress';
import OnlineIcon from '@/components/icons/social/online';

interface IWalletSheetMobileModal {
  showModal: boolean;
  closeModal: () => void;
  linkedAddress: string;
  ens: string;
  walletInfo: string;
  isConnectedWallet: boolean;
  blockExplorerLink: string;
}

const WalletSheetMobileModal: React.FC<IWalletSheetMobileModal> = ({
  showModal,
  closeModal,
  linkedAddress = '',
  ens = '',
  walletInfo = '',
  isConnectedWallet,
  blockExplorerLink
}) => {
  const [showCopyState, setShowCopyState] = useState(false);

  const updateAddressCopyState = (): void => {
    setShowCopyState(true);
    setTimeout(() => setShowCopyState(false), 1000);
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
      customWidth="w-full"
      customClassName="px-5 pt-4"
      margin=""
      mobileModal={true}
    >
      <div className="flex flex-col w-full justify-center">
        <div className="flex flex-row items-center">
          <div className="pr-3 relative">
            <div className="w-8 h-8 bg-green rounded-full">
              <img
                src="/images/collectives/collectiveMemberAvatar.svg"
                alt="avator"
              />
            </div>
            <div className="absolute top-0 right-2.5">
              {isConnectedWallet && <OnlineIcon />}
            </div>
          </div>
          {ens ? (
            <div className="flex flex-row space-x-2">
              <B2>{ens}</B2>
              <B2 extraClasses="text-gray-syn4">
                {formatAddress(linkedAddress, 6, 4)}
              </B2>
            </div>
          ) : (
            <B2 extraClasses="break-all">
              <span className="text-gray-syn4">0x</span>
              <span className="">{linkedAddress.substring(2)}</span>
            </B2>
          )}
        </div>
        <B3 extraClasses="text-gray-syn3 pt-3 pb-1">{walletInfo}</B3>
        <div className="flex flex-col text-left divide-y-1 divide-gray-syn7">
          <CopyToClipboard text={linkedAddress} onCopy={updateAddressCopyState}>
            <div className="relative cursor-pointer flex items-center py-4 space-x-3">
              <CopyToClipboardIcon color="text-white" />
              <B2>Copy address</B2>
              {showCopyState && (
                <span className="absolute text-xs top-12 left-1">copied</span>
              )}
            </div>
          </CopyToClipboard>

          <a
            href={blockExplorerLink}
            target="_blank"
            rel="noreferrer"
            className="py-4 flex items-center space-x-3"
          >
            <ExternalLinkIcon
              height={14}
              width={14}
              iconcolor={ExternalLinkColor.WHITE}
            />
            <B2>View on Etherscan</B2>
          </a>

          <button
            className="flex items-center space-x-3 py-4"
            onClick={(): null => null /* TODO: [Auth] handle unlink */}
          >
            <TrashIcon fill="#FFF" />
            <B2>Unlink wallet</B2>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default WalletSheetMobileModal;

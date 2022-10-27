import Modal, { ModalStyle } from '@/components/modal';
import { Spinner } from '@/components/shared/spinner';
import { B2, H3, H4 } from '@/components/typography';
import React from 'react';
import { WalletAddress } from '../settings/AccountInfoWithAvatar';
import ExternalLinkIcon from '@/components/icons/externalLink';
import { CTAButton, CTAStyle, CTAType } from '@/components/CTAButton';

interface IWalletProgressModal {
  showModal: boolean;
  closeModal: () => void;
  txnProgress: TxnProgress;
}

export enum TxnProgress {
  Success = 'Success',
  Confirm = 'Confirm',
  Signing = 'Signing'
}

const WalletProgressModal: React.FC<IWalletProgressModal> = ({
  showModal,
  closeModal,
  txnProgress
}) => {
  const handleDone = (): void => {
    // TODO: [Auth]
  };

  const modalContext = {
    [TxnProgress.Signing]: {
      header: (
        <div className="-mt-8">
          <Spinner height="h-16" width="w-16" />
        </div>
      ),
      title: (
        <H3 extraClasses="text-center">
          Sign the message in your wallet to continue
        </H3>
      ),
      body: null,
      footer: (
        <B2 extraClasses="text-gray-syn3 text-center mt-4">
          Signing the message in your wallet verifies you as the owner of this
          address.
        </B2>
      )
    },
    [TxnProgress.Confirm]: {
      header: (
        <img
          src="/images/MetaMask.svg"
          alt="metamask"
          className="w-16 h-16 self-center"
        />
      ),
      title: (
        <H3 extraClasses="text-center mt-8">Open MetaMask and switch to</H3>
      ),
      body: (
        <H3 extraClasses="pb-6 pt-2 self-center items-center flex space-x-2">
          <WalletAddress
            ens="mutai.eth"
            address="0x0936544BDD45DBC4E26771aFe038Bf9C17ae5162"
            extraClassName="h-8 w-8"
            textColor="text-white"
          />
        </H3>
      ),
      footer: (
        <a
          href="https://metamask.zendesk.com/hc/en-us/articles/360061346311-Switching-accounts-in-MetaMask"
          target="_blank"
          rel="noreferrer"
          className="text-gray-syn3 flex space-x-2 items-center self-center"
        >
          <B2>Learn how to do this</B2>
          <ExternalLinkIcon width={14} height={14} fill="#B8BDC7" />
        </a>
      )
    },
    [TxnProgress.Success]: {
      header: (
        <img
          src="/images/checkCircleGreen.svg"
          alt="success"
          className="w-16 h-16 self-center"
        />
      ),
      title: (
        <H4 extraClasses="text-center mt-8">Accounts successfully merged</H4>
      ),
      body: (
        <B2 extraClasses="text-center text-gray-syn3 pt-4 pb-8">
          <span className="block">
            <span>Your wallet</span>
            <span>
              {/* TODO: [Auth] too hacky */}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <span className="relative">
              <WalletAddress
                ens=""
                address="0x81887984c1B741dE34CeC428A2a464430306Dc53"
                extraClassName="w-6 h-6 absolute top-0 -left-8"
                textColor="text-white"
              />
            </span>
            <span>&nbsp;has been added to your Syndicate account.</span>
          </span>
        </B2>
      ),
      footer: (
        <CTAButton
          style={CTAStyle.REGULAR}
          type={CTAType.PRIMARY}
          extraClasses="py-4"
          onClick={handleDone}
        >
          Done
        </CTAButton>
      )
    }
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
      customWidth="w-120"
      customClassName="p-10"
    >
      <div className="flex flex-col max-w-120 justify-center">
        {modalContext[txnProgress].header}
        {modalContext[txnProgress].title}
        {modalContext[txnProgress].body}
        {modalContext[txnProgress].footer}
      </div>
    </Modal>
  );
};

export default WalletProgressModal;

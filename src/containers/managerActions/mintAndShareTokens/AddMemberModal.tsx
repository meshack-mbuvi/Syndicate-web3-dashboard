import React, { useEffect, useState, SetStateAction, Dispatch } from 'react';
import Modal, { ModalStyle } from '@/components/modal';
import CopyLink from '@/components/shared/CopyLink';
import { useRouter } from 'next/router';

interface IAddMemberModal {
  showModal: boolean;
  closeModal: () => void;
  mintTokens: Dispatch<SetStateAction<boolean>>;
}

const AddMemberModal: React.FC<IAddMemberModal> = ({
  showModal,
  closeModal,
  mintTokens
}) => {
  const router = useRouter();
  const { clubAddress } = router.query;
  const [showDepositLinkCopyState, setShowDepositLinkCopyState] =
    useState<boolean>(false);
  const updateDepositLinkCopyState = () => {
    setShowDepositLinkCopyState(true);
    setTimeout(() => setShowDepositLinkCopyState(false), 1000);
  };

  const [clubDepositLink, setClubDepositLink] = useState<string>('');
  useEffect(() => {
    setClubDepositLink(`${window.location.origin}/clubs/${clubAddress}/`);
  }, [clubAddress]);
  return (
    <Modal
      modalStyle={ModalStyle.DARK}
      show={showModal}
      closeModal={() => {
        closeModal();
      }}
      customWidth="max-w-480"
      customClassName="px-10 pb-10 pt-8"
      showCloseButton={true}
      outsideOnClick={true}
      showHeader={false}
      overflow="overflow-x-visible"
      overflowYScroll={false}
      isMaxHeightScreen={false}
      overflowXScroll={false}
      maxHeight={false}
    >
      <div className="space-y-4">
        <p className="text-sm leading-4 tracking-px text-white font-whyte font-bold uppercase pb-4">
          Add member
        </p>
        <div>
          <p className="text-base leading-4 text-white">Invite to deposit</p>
          <p className="text-sm text-gray-syn4 leading-5 mt-2">
            Invite a member by sharing your club’s deposit link with them.
          </p>
        </div>
        <CopyLink
          link={clubDepositLink}
          updateCopyState={updateDepositLinkCopyState}
          showCopiedState={showDepositLinkCopyState}
        />
        <div className="py-3 flex text-gray-syn4 items-center">
          <div className="border-b-1 w-1/2 border-gray-syn6 mr-1"></div>
          <p className="text-gray-syn4 text-sm">or</p>
          <div className="border-b-1 w-1/2 border-gray-syn6 ml-1"></div>
        </div>
        <div>
          <p className="text-base leading-4 text-white">Manually add member</p>
          <p className="text-sm text-gray-syn4 leading-5 mt-2">
            Add a member to this club without requiring them to deposit first.
            You can also mint club tokens to them.
          </p>
        </div>

        <button
          className="bg-white rounded-custom w-full flex items-center justify-center py-4 px-8"
          onClick={() => {
            closeModal();
            mintTokens(true);
          }}
        >
          <p className="text-black whitespace-nowrap text-base font-whyte font-bold">
            Add member manually
          </p>
        </button>
      </div>
    </Modal>
  );
};

export default AddMemberModal;

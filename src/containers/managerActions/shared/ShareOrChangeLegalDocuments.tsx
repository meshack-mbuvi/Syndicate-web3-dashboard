import { amplitudeLogger, Flow } from '@/components/amplitude';
import { COPY_SEND_FOR_SIGNATURES_LINK } from '@/components/amplitude/eventNames';
import Modal, { ModalStyle } from '@/components/modal';
import CopyLink from '@/components/shared/CopyLink';
import { AppState } from '@/state';
import { generateMemberSignURL } from '@/utils/generateMemberSignURL';
import { useRouter } from 'next/router';
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import { useSelector } from 'react-redux';

interface ILinkModal {
  showShareOrChangeDocs: boolean;
  setShowShareOrChangeDocsModal: Dispatch<SetStateAction<boolean>>;
  handleChangeLegalDocument;
}

const ShareOrChangeLegalDocuments: FC<ILinkModal> = ({
  showShareOrChangeDocs,
  setShowShareOrChangeDocsModal,
  handleChangeLegalDocument
}) => {
  const router = useRouter();
  const { clubAddress } = router.query;

  const {
    legalInfoReducer: {
      clubInfo,
      walletSignature: { signature }
    }
  } = useSelector((state: AppState) => state);

  const [clubLegalAgreementSignageLink, setClubLegalAgreementSignageLink] =
    useState('');

  const [adminSignDate, setAdminSignDate] = useState('');

  const [
    showLegalAgreementSignageLinkCopyState,
    setShowLegalAgreementSignageCopyState
  ] = useState(false);

  const handleClick = () => {
    router.push(`/clubs/${clubAddress}/manage`);
    setShowShareOrChangeDocsModal(false);
  };

  const updateLegalAgreementSignageLinkCopyState = () => {
    setShowLegalAgreementSignageCopyState(true);
    setTimeout(() => setShowLegalAgreementSignageCopyState(false), 1000);
    amplitudeLogger(COPY_SEND_FOR_SIGNATURES_LINK, {
      flow: Flow.LEGAL_ENTITY_FLOW
    });
  };

  useEffect(() => {
    const legal = JSON.parse(localStorage.getItem('legal') || '{}');

    if (clubAddress && legal[`${clubAddress}`]) {
      setAdminSignDate(legal[`${clubAddress}`]?.clubData?.adminSignDate);
    }

    const memberSignURL = generateMemberSignURL(
      clubAddress as string,
      clubInfo,
      signature
    );
    setClubLegalAgreementSignageLink(memberSignURL);
  }, [signature, clubAddress, clubInfo, clubAddress]);

  return (
    <Modal
      {...{
        modalStyle: ModalStyle.DARK,
        show: showShareOrChangeDocs,
        closeModal: () => {
          setShowShareOrChangeDocsModal(false);
        },
        customWidth: 'w-100',
        customClassName: 'pt-8 px-5 pb-5',
        showCloseButton: false,
        outsideOnClick: true,
        showHeader: false,
        alignment: 'align-top',
        margin: 'mt-48'
      }}
    >
      <>
        <div className=" px-5 -mb-1">
          <div className="body font-medium">
            Legal agreements prepared {adminSignDate}
          </div>
          <div className=" text-base text-gray-syn4 mt-2">
            Invite members to sign the legal agreements via the link below.
            You’ll receive a copy via email once both parties have signed.
          </div>
          <div className="mt-4">
            <div className="py-2 pr-2 flex">
              <div
                className="flex items-center justify-between w-full"
                style={{ width: '400px' }}
              >
                <CopyLink
                  link={clubLegalAgreementSignageLink}
                  updateCopyState={updateLegalAgreementSignageLinkCopyState}
                  showCopiedState={showLegalAgreementSignageLinkCopyState}
                  borderColor="border-gray-syn6"
                />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              className=" bg-white rounded-custom w-full flex items-center justify-center py-4 mb-4"
              onClick={handleClick}
            >
              <p className="text-black pr-1 whitespace-nowrap font-whyte-medium">
                Back to club dashboard
              </p>
            </button>
          </div>

          <div className="mt-2">
            <button
              className="rounded-custom w-full flex items-center justify-center py-4 mb-4"
              onClick={handleChangeLegalDocument}
            >
              <p className="pr-1 whitespace-nowrap font-whyte-medium">
                Reset and prepare again
              </p>
            </button>
          </div>
        </div>
      </>
    </Modal>
  );
};

export default ShareOrChangeLegalDocuments;

import { amplitudeLogger, Flow } from "@/components/amplitude";
import { COPY_SEND_FOR_SIGNATURES_LINK } from "@/components/amplitude/eventNames";
import Modal, { ModalStyle } from "@/components/modal";
import CopyLink from "@/components/shared/CopyLink";
import { AppState } from "@/state";
import { generateMemberSignURL } from "@/utils/generateMemberSignURL";
import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";

interface ILinkModal {
  showSendForSignaturesModal: boolean;
  setShowSendForSignaturesModal: Dispatch<SetStateAction<boolean>>;
}

const SendForSignatures: FC<ILinkModal> = ({
  showSendForSignaturesModal,
  setShowSendForSignaturesModal,
}) => {
  const router = useRouter();
  const { clubAddress } = router.query;

  const {
    legalInfoReducer: {
      clubInfo,
      walletSignature: { signature },
    },
  } = useSelector((state: AppState) => state);

  const [clubLegalAgreementSignageLink, setClubLegalAgreementSignageLink] =
    useState("");

  const [
    showLegalAgreementSignageLinkCopyState,
    setShowLegalAgreementSignageCopyState,
  ] = useState(false);

  const handleClick = () => {
    router.push(`/clubs/${clubAddress}/manage`);
  };

  const updateLegalAgreementSignageLinkCopyState = () => {
    setShowLegalAgreementSignageCopyState(true);
    setTimeout(() => setShowLegalAgreementSignageCopyState(false), 1000);
    amplitudeLogger(COPY_SEND_FOR_SIGNATURES_LINK, {
      flow: Flow.LEGAL_ENTITY_FLOW,
    });
  };

  useEffect(() => {
    const memberSignURL = generateMemberSignURL(
      clubAddress as string,
      clubInfo,
      signature,
    );
    setClubLegalAgreementSignageLink(memberSignURL);
  }, [signature, clubAddress, clubInfo]);

  return (
    <Modal
      {...{
        modalStyle: ModalStyle.DARK,
        show: showSendForSignaturesModal,
        closeModal: () => {
          setShowSendForSignaturesModal(false);
        },
        customWidth: "w-100",
        customClassName: "pt-8 px-5 pb-5",
        showCloseButton: false,
        outsideOnClick: true,
        showHeader: false,
        alignment: "align-top",
        margin: "mt-48",
      }}
    >
      <>
        <div className=" px-5 -mb-1">
          <div className=" text-sm font-medium">SEND FOR SIGNATURES</div>
          <div className=" text-base text-gray-syn4 mt-8">
            Invite members to sign the legal agreements and deposit via the link
            below. Retrieve this link anytime from the club dashboard.
          </div>
          <div className=" mt-4">
            <div className=" py-2 pr-2 flex">
              <div
                className="flex items-center justify-between w-full"
                style={{ width: "400px" }}
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
          <div className=" mt-4">
            <div className="flex flex-row mt-4 text-yellow-warning bg-brown-dark rounded-1.5lg py-3 px-4">
              <p className=" text-sm">
                Do not publicize or you may violate an investment club's
                regulatory requirements. Only share links with trusted &
                qualified people.&nbsp;
                <a
                  className="underline"
                  rel="noreferrer"
                  href="https://www.sec.gov/reportspubs/investor-publications/investorpubsinvclubhtm.html"
                  target="_blank"
                >
                  Learn more
                  <ArrowNarrowRightIcon className="h-4 w-4 inline-block no-underline ml-1" />
                </a>
              </p>
            </div>
          </div>
          <div className=" mt-8">
            <button
              className=" bg-white rounded-custom w-full flex items-center justify-center py-4 mb-4"
              onClick={handleClick}
            >
              <p className="text-black pr-1 whitespace-nowrap font-whyte-medium">
                Back to club dashboard
              </p>
            </button>
          </div>
        </div>
      </>
    </Modal>
  );
};

export default SendForSignatures;

import Modal, { ModalStyle } from "@/components/modal";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Dispatch, FC, SetStateAction, useEffect } from "react";
import { ExternalLinkIcon, RightArrow } from "src/components/iconWrappers";
import { setWalletSignature } from "@/state/legalInfo";
import { useDispatch } from "react-redux";

interface ILinkModal {
  setDocSigned: Dispatch<SetStateAction<boolean>>;
  setShowGenerateLinkModal: Dispatch<SetStateAction<boolean>>;
  showGenerateLinkModal: boolean;
  setCopyLinkCTA: Dispatch<SetStateAction<string>>;
}

const GenerateDepositLink: FC<ILinkModal> = ({
  setDocSigned,
  setShowGenerateLinkModal,
  showGenerateLinkModal,
  setCopyLinkCTA,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { clubAddress } = router.query;

  const startDocumentSigning = (option: string) => {
    if (option === "no") {
      const legal = JSON.parse(localStorage.getItem("legal") || "{}");
      localStorage.setItem(
        "legal",
        JSON.stringify({
          ...legal,
          [`${clubAddress}`]: { signaturesNeeded: false },
        }),
      );
      setShowGenerateLinkModal(false);
      // change link component border to green momentarily as a call to action
      setCopyLinkCTA("border-green-semantic");
      setTimeout(() => {
        setCopyLinkCTA("border-gray-syn6");
      }, 800);
    } else {
      dispatch(setWalletSignature({ signature: "", timeSigned: new Date() }));
    }
  };

  useEffect(() => {
    const legalData = JSON.parse(localStorage.getItem("legal") || "{}");
    if (legalData[clubAddress as string]) {
      setDocSigned(true);
    }
  }, [showGenerateLinkModal]);

  return (
    <Modal
      {...{
        modalStyle: ModalStyle.DARK,
        show: showGenerateLinkModal,
        closeModal: () => {
          setShowGenerateLinkModal(false);
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
        <div className="px-5 -mb-1">
          <div className="leading-6">
            Would you like members to sign Operating & Subscription Agreements
            before they deposit?
          </div>
          <div className="text-sm text-gray-syn4 mt-4 mb-6">
            To adapt our templates to your needs,{" "}
            <a
              href="https://syndicatedao.gitbook.io/syndicate-wiki/web3-investment-clubs/create-a-legal-entity/template-legal-docs"
              className="text-blue cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>make a copy</span>
              <ExternalLinkIcon
                style={{ position: "relative", top: -1, marginLeft: 4 }}
                className="text-blue w-3.5 inline"
              />
            </a>
          </div>
          <div className="space-y-4">
            <Link href={`/clubs/${clubAddress}/manage/legal/prepare`}>
              <div
                className="border-1 border-gray-syn6 hover:border-blue cursor-pointer p-8 rounded-1.5lg flex justify-between items-center svgBlueHover"
                onClick={() => startDocumentSigning("yes")}
              >
                <div>
                  <div className="leading-6">Yes, use LLC template</div>
                  <div className="text-sm leading-4 text-gray-syn3 mt-1">
                    Requires an existing LLC
                  </div>
                </div>
                <RightArrow />
              </div>
            </Link>
            <button
              className="border-1 w-full border-gray-syn6 hover:border-blue cursor-pointer p-8 rounded-1.5lg"
              onClick={() => startDocumentSigning("no")}
            >
              <p className="leading-6 text-left">No</p>
              <p className="text-sm text-left leading-4 text-gray-syn3 mt-1">
                I will handle legal documents separately
              </p>
            </button>
          </div>
        </div>
        <div className="mt-14 mb-6 h-px bg-gray-syn6"></div>
        <p className="px-5 text-gray-syn4 text-sm leading-5.5 text-center pb-2">
          Help me{" "}
          <a
            className="text-blue cursor-pointer"
            href="https://syndicatedao.gitbook.io/syndicate-wiki/web3-investment-clubs/create-a-legal-entity/form-your-legal-entity"
            target="_blank"
            rel="noopener noreferrer"
          >
            form a legal entity
          </a>{" "}
          first
        </p>
      </>
    </Modal>
  );
};

export default GenerateDepositLink;

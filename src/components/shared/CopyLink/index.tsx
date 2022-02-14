import React, { FC } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  CopiedLinkIcon,
  CopyLinkIcon,
  LockIcon,
} from "src/components/iconWrappers";

interface Props {
  link: string;
  updateCopyState: () => void;
  showCopiedState: boolean;
  creatingSyndicate?: boolean;
  syndicateSuccessfullyCreated?: boolean;
  showConfettiSuccess?: boolean;
  borderColor?: string;
}
const CopyLink: FC<Props> = ({
  link,
  updateCopyState,
  showCopiedState,
  creatingSyndicate = false,
  syndicateSuccessfullyCreated = false,
  showConfettiSuccess = false,
  borderColor = "border-gray-syn6",
}) => {
  // show greyed out content when syndicate is being created.
  const creatingSyndicateContent = (
    <div
      className={`w-full border-1 border-gray-syn6 bg-gray-syn8 rounded pl-4 py-2 pr-2 flex`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex-grow-1 -mr-2">
          <LockIcon color="text-gray-syn7" />
        </div>

        <div className="overflow-hidden bg-gray-syn7 rounded-lg h-4.5 sm:w-60 w-1/2"></div>
        <div
          className={`flex-grow-1 px-3 bg-gray-syn6 h-10 flex justify-center items-center rounded`}
        >
          <CopyLinkIcon color="text-gray-syn4" />
          <span className="ml-3 font-whyte-medium text-gray-syn4 sm:text-base text-sm">
            Copy
          </span>
        </div>
      </div>
    </div>
  );

  // content to display after completion of the syndicate creation process.
  const defaultContent = (
    <div
      className={`w-full border-1 ${borderColor} bg-gray-syn8 hover:bg-gray-syn7 transition-all duration-300 rounded flex ${
        syndicateSuccessfullyCreated && showConfettiSuccess
          ? "p-4"
          : "pl-4 py-2 pr-2"
      }`}
    >
      <CopyToClipboard text={link}>
        <button
          className="overflow-hidden flex items-center"
          onClick={updateCopyState}
        >
          <div className="flex-grow-1 mr-2">
            <LockIcon />
          </div>

          <span
            className={`line-clamp-1 overflow-hidden flex-grow-1 text-sm ${
              syndicateSuccessfullyCreated && showConfettiSuccess
                ? "text-green"
                : "text-transparent bg-clip-text bg-gradient-to-r from-green"
            }`}
          >
            {link}
          </span>
          {!(syndicateSuccessfullyCreated && showConfettiSuccess) && (
            <div
              className={`flex-grow-1 px-3 ${
                showCopiedState ? "border-transparent" : "bg-green"
              } text-black flex h-10 justify-center items-center rounded`}
            >
              {showCopiedState ? <CopiedLinkIcon /> : <CopyLinkIcon />}
              <span
                className={`ml-3 font-whyte-medium sm:text-base text-sm ${
                  showCopiedState && "text-green"
                }`}
              >
                {showCopiedState ? "Copied" : "Copy"}
              </span>
            </div>
          )}
        </button>
      </CopyToClipboard>
    </div>
  );

  return creatingSyndicate ? creatingSyndicateContent : defaultContent;
};

export default CopyLink;

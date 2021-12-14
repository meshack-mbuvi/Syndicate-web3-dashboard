import React, { Dispatch, SetStateAction } from "react";
import { ExternalLinkIcon } from "src/components/iconWrappers";

const ByInvitationOnly: React.FC<{ showByInvitationOnly: Dispatch<SetStateAction<boolean>> }> =
  ({ showByInvitationOnly }) => {
    return (
      <div className="py-8 px-10 rounded-2-half bg-gray-syn8 w-100">
        <p className="uppercase text-sm text-white pb-6 text-center font-bold">
          Welcome to Syndicate
        </p>
        <p className="pb-8">
          Syndicate is currently in private beta and is by invitation only. If
          you were not directed to this page by Syndicate, you are not
          authorized to access our platform at this time. By clicking below, you
          agree to these conditions in addition to our standard{" "}
          <a
            href="https://docs.google.com/document/d/1U5D6AtmZXrxmgBeobyvHaXTs7p7_wq6V"
            className="text-blue flex items-center justify-start"
            target="_blank" rel="noreferrer"
          >
            <p>Terms of Service</p>{" "}
            <ExternalLinkIcon className="ml-1 w-4 text-blue" />{" "}
          </a>
        </p>
        <button
          className="green-CTA w-full flex items-center justify-center"
          onClick={() => showByInvitationOnly(false)}
        >
          <p className="text-black pr-1 whitespace-nowrap">I agree</p>
          <img
            src="/images/actionIcons/arrowRightBlack.svg"
            alt="arrow-right"
          />
        </button>
      </div>
    );
  };

export default ByInvitationOnly;

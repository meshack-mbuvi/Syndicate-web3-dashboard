import { amplitudeLogger, Flow } from "@/components/amplitude";
import React, { Dispatch, SetStateAction } from "react";
import { ExternalLinkIcon } from "src/components/iconWrappers";
import { CLICK_I_AGREE } from "@/components/amplitude/eventNames";

const ByInvitationOnly: React.FC<{
  setClubStep: Dispatch<SetStateAction<string>>;
}> = ({ setClubStep }) => {
  return (
    <div
      className="py-8 px-10 rounded-2-half bg-gray-syn8 w-100"
      style={{ marginTop: "179px" }}
    >
      <p className="uppercase text-sm leading-4 tracking-px text-white pb-6 font-bold">
        Getting Started
      </p>
      <p className="pb-8">
        Syndicate is currently in private beta and is by invitation only. If you
        were not directed to this page by Syndicate, you are not authorized to
        access our platform at this time. By clicking below, you agree to these
        conditions in addition to our standard{" "}
        <a
          href="https://www.notion.so/syndicateprotocol/Syndicate-Terms-of-Service-04674deec934472e88261e861cdcbc7c"
          className="text-blue inline-flex w-fit-content items-center justify-start"
          target="_blank"
          rel="noreferrer"
        >
          <p>Terms of Service</p>{" "}
          <ExternalLinkIcon className="ml-1 w-4 text-blue" />{" "}
        </a>
      </p>
      <button
        className="bg-white rounded-custom w-full flex items-center justify-center py-4"
        onClick={() => {
          setClubStep("start");
          amplitudeLogger(CLICK_I_AGREE, {
            flow: Flow.CLUB_CREATION,
          });
        }}
      >
        <p className="text-black pr-1 whitespace-nowrap">I agree</p>
        <img src="/images/actionIcons/arrowRightBlack.svg" alt="arrow-right" />
      </button>
    </div>
  );
};

export default ByInvitationOnly;

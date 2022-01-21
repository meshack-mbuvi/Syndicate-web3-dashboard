import React, { Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
import { OpenExternalLinkIcon } from "src/components/iconWrappers";
import AccountPill from "@/components/shared/accountPill";
import { AppState } from "@/state";
import useClubERC20s from "@/hooks/useClubERC20s";
import { SkeletonLoader } from "src/components/skeletonLoader";

const ByInvitationOnly: React.FC<{
  setClubStep: Dispatch<SetStateAction<string>>;
}> = ({ setClubStep }) => {
  const {
    clubERC20sReducer: { myClubERC20s, loading },
  } = useSelector((state: AppState) => state);

  useClubERC20s();

  const totalClubs = myClubERC20s.length;
  const getWarningText = () => {
    if (totalClubs === 1) {
      return `${myClubERC20s[0].clubName}`;
    }
    if (totalClubs > 1) {
      return `${myClubERC20s[0].clubName} and ${totalClubs - 1} other clubs`;
    }
  };
  const hasClubsWarningText = `By using the same wallet as ${getWarningText()}, assets will be
  co-mingled and activity will be visible across clubs. We recommend
  using a separate wallet for each investment club for ease of
  management.`;

  return (
    <div
      className="py-8 px-10 rounded-2-half bg-gray-syn8 w-100"
      style={{ marginTop: "179px" }}
    >
      {loading ? (
        <div className="flex flex-col space-y-6">
          <div>
            <SkeletonLoader width="1/2" height="4" borderRadius="rounded-md" />
          </div>
          <div>
            <SkeletonLoader width="full" height="4" borderRadius="rounded-md" />
            <SkeletonLoader width="full" height="4" borderRadius="rounded-md" />
            <SkeletonLoader width="full" height="4" borderRadius="rounded-md" />
          </div>
          <div className="flex justify-center">
            <SkeletonLoader width="48" height="8" borderRadius="rounded-2xl" />
          </div>
          <div>
            <SkeletonLoader width="full" height="4" borderRadius="rounded-md" />
            <SkeletonLoader width="full" height="4" borderRadius="rounded-md" />
          </div>
          <div>
            <SkeletonLoader
              width="full"
              height="14"
              borderRadius="rounded-lg"
            />
          </div>
        </div>
      ) : (
        <>
          <p className="uppercase text-sm leading-4 tracking-px text-white pb-6 font-bold">
            Welcome to Syndicate
          </p>
          <p className="pb-6">
            Confirm the connected wallet or create a new wallet for this
            investment club. Deposits will be collected in this wallet, and any
            existing assets in this wallet will be visible to all club members.
            <div className="flex justify-center my-6">
              <AccountPill />
            </div>
            {totalClubs >= 1 && (
              <p className="text-yellow-warning mb-6">{hasClubsWarningText}</p>
            )}
            By clicking below, you agree to our standard{" "}
            <a
              href="https://www.notion.so/syndicateprotocol/Syndicate-Terms-of-Service-04674deec934472e88261e861cdcbc7c"
              className="text-gray-syn4 w-fit-content items-center justify-start"
              target="_blank"
              rel="noreferrer"
            >
              Terms of Service{" "}
              <OpenExternalLinkIcon className="ml-1 text-gray-syn4 w-3 h-3 inline-flex" />{" "}
            </a>
          </p>
          <button
            className="bg-green rounded-custom w-full flex items-center justify-center py-4"
            onClick={() => setClubStep("start")}
          >
            <p className="text-black pr-1 whitespace-nowrap font-semibold">
              I agree
            </p>
            <img
              src="/images/actionIcons/arrowRightBlack.svg"
              alt="arrow-right"
            />
          </button>
        </>
      )}
    </div>
  );
};

export default ByInvitationOnly;

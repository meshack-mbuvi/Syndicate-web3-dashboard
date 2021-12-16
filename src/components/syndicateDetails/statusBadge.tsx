import { Spinner } from "@/components/shared/spinner";
import { SkeletonLoader } from "@/components/skeletonLoader";
import { AppState } from "@/state";
import React from "react";
import { useSelector } from "react-redux";
import useFetchMerkleProof from "@/hooks/useMerkleProof";
import useFetchTokenClaim from "@/hooks/useTokenClaim";

interface Props {
  isManager?: boolean;
  depositsEnabled?: boolean;
  depositExceedTotal?: boolean;
  claimEnabled?: boolean;
  // investment club creation loading states
  creatingSyndicate?: boolean;
  syndicateSuccessfullyCreated?: boolean;
  syndicateCreationFailed?: boolean;
  showConfettiSuccess?: boolean;
}

const StatusBadge = (props: Props): JSX.Element => {
  const {
    depositsEnabled,
    depositExceedTotal,
    isManager = false,
    claimEnabled,
    creatingSyndicate,
    syndicateSuccessfullyCreated,
    syndicateCreationFailed,
    showConfettiSuccess,
  } = props;

  const {
    erc20TokenSliceReducer: {
      erc20Token: { loading },
    },
  } = useSelector((state: AppState) => state);

  const { loading: merkleLoading } = useFetchMerkleProof();
  const { loading: claimLoading, refetch: refetchTokenClaim } =
    useFetchTokenClaim();

  let badgeBackgroundColor = "bg-blue-darker";
  let badgeIcon: string | React.ReactNode = "depositIcon.svg";
  let titleText = "Open to deposits";
  if (claimEnabled) {
    badgeBackgroundColor = "bg-green-phthalo-green";
    badgeIcon = "claimToken.svg";
    titleText = isManager ? "Airdrop Enabled" : "Claim club tokens";
  } else if (!depositsEnabled) {
    badgeBackgroundColor = "bg-green-dark";
    badgeIcon = "active.svg";
    titleText = "Active";
  } else if (depositExceedTotal) {
    badgeBackgroundColor = "bg-blue-darker";
    badgeIcon = "depositReachedIcon.svg";
    titleText = "Fully deposited";
  } else if (depositsEnabled) {
    badgeBackgroundColor = "bg-blue-midnightExpress";
  }

  // states to track club creating process
  if (creatingSyndicate) {
    badgeBackgroundColor = "bg-gray-syn8";
    badgeIcon = <Spinner width="w-6" height="h-6" margin="m-0" />;
    titleText = "Creating investment club";
  } else if (syndicateSuccessfullyCreated && showConfettiSuccess) {
    badgeBackgroundColor = "bg-green bg-opacity-10";
    badgeIcon = "logo.svg";
    titleText = "Club successfully created";
  } else if (syndicateCreationFailed) {
    badgeBackgroundColor = "bg-red-error bg-opacity-10";
    badgeIcon = "warning-triangle.svg";
    titleText = "Club creation failed";
  }

  return (
    <div className="h-fit-content rounded-3xl bg-gray-syn8">
      <div
        className={`h-20 ring ring-black w-full px-8 py-4 rounded-2xl ${badgeBackgroundColor} flex flex-shrink-0 justify-between items-center`}
      >
        {loading || merkleLoading || claimLoading ? (
          <SkeletonLoader width="2/3" height="7" borderRadius="rounded-full" />
        ) : (
          <div className="flex items-center space-x-4">
            {typeof badgeIcon === "string" ? (
              <div className="w-6 h-6">
                <img
                  src={`/images/syndicateStatusIcons/${badgeIcon}`}
                  alt={titleText}
                  style={{ height: "100%", width: "100%" }}
                />
              </div>
            ) : (
              <div className="m-0">{badgeIcon}</div>
            )}
            <p className="text-sm sm:text-lg leading-snug ml-4">{titleText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusBadge;

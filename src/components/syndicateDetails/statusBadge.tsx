import { Spinner } from '@/components/shared/spinner';
import { SkeletonLoader } from '@/components/skeletonLoader';
import { useDemoMode } from '@/hooks/useDemoMode';
import useFetchMerkleProof from '@/hooks/useMerkleProof';
import useFetchTokenClaim from '@/hooks/useTokenClaim';
import { AppState } from '@/state';
import { getCountDownDays } from '@/utils/dateUtils';
import React from 'react';
import { useSelector } from 'react-redux';
import Tooltip from 'react-tooltip-lite';
import { getFormattedDateTimeWithTZ } from 'src/utils/dateUtils';
import { B2, H4 } from '../typography';

interface Props {
  isManager?: boolean;
  depositsEnabled?: boolean;
  depositExceedTotal?: boolean;
  claimEnabled?: boolean;
  // collectives
  isCollective?: boolean;
  numberOfMembers?: number;
  isOpenToNewMembers?: boolean;
  // investment club creation loading states
  creatingSyndicate?: boolean;
  syndicateSuccessfullyCreated?: boolean;
  syndicateCreationFailed?: boolean;
  showConfettiSuccess?: boolean;
  isDistributing?: boolean;
  isWaitingForSelection?: boolean;
}

const StatusBadge = (props: Props): JSX.Element => {
  const {
    depositsEnabled,
    depositExceedTotal,
    isManager = false,
    claimEnabled,
    isCollective,
    numberOfMembers,
    creatingSyndicate,
    syndicateSuccessfullyCreated,
    syndicateCreationFailed,
    showConfettiSuccess,
    isDistributing,
    isWaitingForSelection,
    isOpenToNewMembers
  } = props;

  const {
    erc20TokenSliceReducer: {
      erc20Token: { loading, endTime }
    }
  } = useSelector((state: AppState) => state);

  const isDemoMode = useDemoMode();

  const { loading: merkleLoading } = useFetchMerkleProof(isDemoMode);
  const { loading: claimLoading } = useFetchTokenClaim(isDemoMode);

  let badgeBackgroundColor = 'bg-blue-darker';
  let badgeIcon: string | React.ReactNode = 'depositIcon.svg';

  let titleText = 'Open to deposits';
  let subTitleText = '';

  if (claimEnabled) {
    badgeBackgroundColor = 'bg-green-phthalo-green';
    badgeIcon = 'claimToken.svg';
    titleText = isManager ? 'Airdrop Enabled' : 'Claim club tokens';
  } else if (isDistributing) {
    badgeBackgroundColor = 'bg-green-phthalo-green';
    titleText = 'Distributing';
    badgeIcon = 'distributeIcon.svg';
  } else if (isCollective) {
    badgeBackgroundColor = 'bg-cyan-collective';
    titleText = numberOfMembers
      ? `${numberOfMembers} member${numberOfMembers > 1 ? 's' : ''}`
      : 'Members';
    badgeIcon = 'collectiveIcon.svg';

    if (isOpenToNewMembers) {
      subTitleText = 'Open to new members';
    } else {
      subTitleText = '';
    }
  } else if (!depositsEnabled) {
    badgeBackgroundColor = 'bg-green-dark';
    badgeIcon = 'active.svg';
    titleText = 'Active';
  } else if (depositExceedTotal) {
    badgeBackgroundColor = 'bg-blue-darker';
    badgeIcon = 'depositReachedIcon.svg';
    titleText = 'Fully deposited';
  } else if (depositsEnabled) {
    badgeBackgroundColor = 'bg-blue-midnightExpress';
  }

  // states to track club creating process
  if (creatingSyndicate) {
    badgeBackgroundColor = 'bg-gray-syn8';
    badgeIcon = <Spinner width="w-6" height="h-6" margin="m-0" />;
    titleText = 'Creating investment club';
  } else if (syndicateSuccessfullyCreated && showConfettiSuccess) {
    badgeBackgroundColor = 'bg-green bg-opacity-10';
    badgeIcon = 'logo.svg';
    titleText = 'Club successfully created';
  } else if (syndicateCreationFailed) {
    badgeBackgroundColor = 'bg-red-error bg-opacity-10';
    badgeIcon = 'warning-triangle.svg';
    titleText = 'Club creation failed';
  } else if (isDistributing && isWaitingForSelection) {
    titleText = 'Waiting for selection...';
  }

  return (
    <div className="h-fit-content rounded-3xl bg-gray-syn8">
      <div
        className={`h-20 ring ring-black w-full px-8 py-4 rounded-2xl ${badgeBackgroundColor} flex flex-shrink-0 justify-between items-center`}
      >
        {loading || merkleLoading || claimLoading ? (
          <SkeletonLoader width="2/3" height="7" borderRadius="rounded-full" />
        ) : (
          <div className="flex items-center justify-between space-x-4 w-full">
            <div className="flex items-center space-x-4 w-full">
              {typeof badgeIcon === 'string' ? (
                <div className="w-6 h-6">
                  <img
                    src={`/images/syndicateStatusIcons/${badgeIcon}`}
                    alt={titleText}
                    style={{ height: '100%', width: '100%' }}
                  />
                </div>
              ) : (
                <div className="m-0">{badgeIcon}</div>
              )}
              {/* <p className="h3 sm:text-xl">{titleText}</p> */}
              <div className="flex justify-between w-full leading-snug ml-4">
                <H4>{titleText}</H4> <B2>{subTitleText}</B2>
              </div>
            </div>
            {depositsEnabled &&
            !syndicateCreationFailed &&
            !showConfettiSuccess ? (
              <div className="flex flex-shrink-0">
                <Tooltip
                  content={
                    <span className="w-200 flex-shrink-0">
                      {`Closing to deposits on ${getFormattedDateTimeWithTZ(
                        endTime
                      )}`}
                    </span>
                  }
                  arrow={false}
                  tipContentClassName="actionsTooltip"
                  background="#232529"
                  padding="12px 16px"
                  distance={8}
                >
                  <div className="flex-shrink-0">
                    <span className="font-whyte-light">{`Closes in ${getCountDownDays(
                      endTime.toString()
                    )}`}</span>
                  </div>
                </Tooltip>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusBadge;

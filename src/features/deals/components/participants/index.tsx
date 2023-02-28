import IconEtherscan from '@/components/icons/etherscan';
import IconInvest from '@/components/icons/invest';
import IconRosette from '@/components/icons/rosette';
import IconVerified from '@/components/icons/verified';
import {
  AddressLayout,
  DisplayAddressWithENS
} from '@/components/shared/ensAddress/display';
import { StatusChip } from '@/components/statusChip';
import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';
import { B2 } from '@/components/typography';
import { ParticipantStatus } from '@/hooks/deals/types';
import { IPrecommit } from '@/hooks/deals/useDealPrecommits';
import { getFormattedDateTimeWithTZ } from '@/utils/dateUtils';
import ReactTooltip from 'react-tooltip';

interface Props {
  participants: IPrecommit[] | undefined;
  addressOfLeader?: string;
}

export const DealsParticipants: React.FC<Props> = ({
  participants,
  addressOfLeader
}) => {
  // Deal leader
  const filteredParticipantsByLeader = addressOfLeader
    ? participants?.map((participant, index) => {
        if (participant.userAddress === addressOfLeader) {
          return index;
        } else {
          return undefined;
        }
      })
    : undefined;
  const indexOfDealLeader: number | undefined = filteredParticipantsByLeader
    ? filteredParticipantsByLeader[0]
    : undefined;

  // Largest backer
  let indexOfLargestBacker = 0;
  let largestBackingAmountHasDuplicates = false; // if this is true we don't want to show the badge
  const numberOfParticipants = participants?.length ?? 0;
  // Find the largest backer
  for (let index = 0; index < numberOfParticipants; index++) {
    const currentParticipantAmount = Number(participants?.[index].amount);
    const largestParticipantAmount = Number(
      participants?.[indexOfLargestBacker].amount
    );

    if (currentParticipantAmount > largestParticipantAmount) {
      indexOfLargestBacker = index;
      largestBackingAmountHasDuplicates = false;
    }
    if (currentParticipantAmount === largestParticipantAmount && index !== 0) {
      largestBackingAmountHasDuplicates = true;
    }
  }

  return (
    <div>
      <B2 extraClasses="text-gray-syn4 mb-2">
        {participants?.length ?? 0 > 0 ? 'Backers' : 'No backers yet'}
      </B2>
      {participants?.map((participant, index) => {
        const showFirstBackerBadge =
          indexOfDealLeader === 0 ? index === 1 : index === 0;
        const showDealLeaderBadge =
          participants[index].userAddress === addressOfLeader;
        const showLargestBackerBadge =
          indexOfLargestBacker !== undefined &&
          index === indexOfLargestBacker &&
          !largestBackingAmountHasDuplicates;
        const isAnyBadgeVisible =
          showFirstBackerBadge || showDealLeaderBadge || showLargestBackerBadge;
        return (
          <div key={`${index}-${participant.userAddress}`}>
            <div
              key={index}
              className={`inline-flex space-x-2 mt-2 visibility-container`}
              data-tip
              data-for={`deal-participant-${index}`}
            >
              <DisplayAddressWithENS
                name={participant.ensName}
                address={participant.userAddress}
                layout={AddressLayout.ONE_LINE}
                onlyShowOneOfNameOrAddress={true}
              />

              {/* Badges */}
              {isAnyBadgeVisible && (
                <div className="flex space-x-1 items-center -my-1">
                  {showDealLeaderBadge && (
                    <StatusChip
                      status={ParticipantStatus.CUSTOM}
                      customLabel="Deal leader"
                      customIcon={<IconVerified textColorClass="text-white" />}
                    />
                  )}
                  {showFirstBackerBadge && (
                    <StatusChip
                      status={ParticipantStatus.CUSTOM}
                      customLabel="First backer"
                      customIcon={<IconRosette textColorClass="text-white" />}
                    />
                  )}
                  {showLargestBackerBadge && (
                    <StatusChip
                      status={ParticipantStatus.CUSTOM}
                      customLabel="Largest backer"
                      customIcon={<IconInvest textColorClass="text-white" />}
                    />
                  )}
                </div>
              )}

              {participant?.userAddress ? (
                <BlockExplorerLink
                  resourceId={participant?.userAddress}
                  noIconOrText={true}
                >
                  <div
                    className="w-7.5 h-7.5 rounded-full bg-white bg-opacity-10 flex items-center justify-center invisible visibility-hover"
                    style={{}}
                  >
                    <IconEtherscan textColorClass="text-white" />
                  </div>
                </BlockExplorerLink>
              ) : null}
            </div>
            <br />

            {participant.createdAt && (
              <ReactTooltip
                id={`deal-participant-${index}`}
                place="top"
                effect="solid"
                className="actionsTooltip"
                arrowColor="#222529"
                backgroundColor="#222529"
              >
                <span>Joined on</span>{' '}
                <span>
                  {getFormattedDateTimeWithTZ(
                    Number(participant.createdAt) * 1000
                  )}
                </span>
              </ReactTooltip>
            )}
          </div>
        );
      })}
    </div>
  );
};

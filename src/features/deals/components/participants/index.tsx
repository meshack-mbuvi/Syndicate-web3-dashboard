import {
  AddressLayout,
  DisplayAddressWithENS
} from '@/components/shared/ensAddress/display';
import { B2 } from '@/components/typography';
import ReactTooltip from 'react-tooltip';
import { getFormattedDateTimeWithTZ } from '@/utils/dateUtils';
import { StatusChip } from '@/components/statusChip';
import IconVerified from '@/components/icons/verified';
import IconRosette from '@/components/icons/rosette';
import IconInvest from '@/components/icons/invest';
import IconEtherscan from '@/components/icons/etherscan';
import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';
import { ParticipantStatus } from '@/hooks/deals/types';

export interface DealParticipant {
  dealAddress: string;
  address: string;
  ensName?: string;
  createdAt: string;
  amount: string;
  status: string;
}

interface Props {
  participants: DealParticipant[];
  addressOfLeader?: string;
}

export const DealsParticipants: React.FC<Props> = ({
  participants,
  addressOfLeader
}) => {
  // Deal leader
  const filteredParticipantsByLeader = addressOfLeader
    ? participants.map((participant: DealParticipant, index) => {
        if (participant.address === addressOfLeader) {
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
  // Find the largest backer
  for (let index = 0; index < participants.length; index++) {
    const currentParticipant = participants[index];
    const largestParticipant = participants[indexOfLargestBacker];
    if (currentParticipant.amount > largestParticipant.amount) {
      indexOfLargestBacker = index;
      largestBackingAmountHasDuplicates = false;
    }
    if (
      currentParticipant.amount === largestParticipant.amount &&
      index !== 0
    ) {
      largestBackingAmountHasDuplicates = true;
    }
  }
  return (
    <div>
      <B2 extraClasses="text-gray-syn4 mb-2">
        {participants.length > 0 ? 'Backers' : 'No backers yet'}
      </B2>
      {participants.map((participant, index) => {
        const showFirstBackerBadge =
          indexOfDealLeader === 0 ? index === 1 : index === 0;
        const showDealLeaderBadge =
          participants[index].address === addressOfLeader;
        const showLargestBackerBadge =
          indexOfLargestBacker !== undefined &&
          index === indexOfLargestBacker &&
          !largestBackingAmountHasDuplicates;
        const isAnyBadgeVisible =
          showFirstBackerBadge || showDealLeaderBadge || showLargestBackerBadge;
        return (
          <div key={`${index}-${participant.address}`}>
            <div
              key={index}
              className={`inline-flex space-x-2 mt-2 visibility-container`}
              data-tip
              data-for={`deal-participant-${index}`}
            >
              <DisplayAddressWithENS
                name={participant.ensName}
                address={participant.address}
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

              <BlockExplorerLink
                resourceId={participant.address}
                noIconOrText={true}
              >
                <div
                  className="w-7.5 h-7.5 rounded-full bg-white bg-opacity-10 flex items-center justify-center invisible visibility-hover"
                  style={{}}
                >
                  <IconEtherscan textColorClass="text-white" />
                </div>
              </BlockExplorerLink>
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

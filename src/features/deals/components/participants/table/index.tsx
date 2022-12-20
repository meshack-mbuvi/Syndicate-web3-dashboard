import { CTAButton, CTAStyle } from '@/components/CTAButton';
import { DisplayAddressWithENS } from '@/components/shared/ensAddress/display';
import { StatusChip, Status } from '@/components/statusChip';
import TransitionInChildren from '@/components/transition/transitionInChildren';
import { H4 } from '@/components/typography';
import {
  floatedNumberWithCommas,
  formatInputValueWithCommas
} from '@/utils/formattedNumbers';
import { useState } from 'react';

export interface Participant {
  ensName?: string;
  address?: string;
  joinedDate: string;
  status: Status;
  contributionAmount: number;
}

interface Props {
  totalParticipantsAmount: number;
  tokenSymbol: string;
  tokenLogo: string;
  participants: Participant[];
  handleParticipantRejectionClick: (index: number) => void;
  handleParticipantAcceptanceClick: (index: number) => void;
}

export const DealsParticipantsTable: React.FC<Props> = ({
  totalParticipantsAmount,
  tokenSymbol,
  tokenLogo,
  participants,
  handleParticipantRejectionClick,
  handleParticipantAcceptanceClick
}) => {
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);
  const leftColumnClasses = 'flex-grow flex items-center space-x-4';
  const middleColumnClasses = 'w-3/12';
  const rightColumnClasses = 'w-3/12 text-right';

  return (
    <div>
      <div className="flex justify-between space-x-2">
        <div className={leftColumnClasses}>
          <H4 regular>
            {participants.length} Backer{participants.length > 1 ? 's' : ''}
          </H4>
        </div>
        <div className={middleColumnClasses}>
          <H4 regular>Backer status</H4>
        </div>
        <div className={rightColumnClasses}>
          <H4 regular>Contribution</H4>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 w-full divide-y">
        {participants.map((participant, index) => {
          return (
            // Table row
            <div
              key={index}
              className="border-gray-syn7 overflow-hidden hover:bg-gray-syn9 visibility-container"
            >
              <div
                className="flex justify-between items-center space-x-2 h-14 cursor-pointer"
                onClick={() => {
                  if (expandedRowIndex === index) {
                    setExpandedRowIndex(null);
                  } else {
                    setExpandedRowIndex(index);
                  }
                }}
              >
                {/* Left column */}
                <div className={leftColumnClasses}>
                  <div className="flex space-x-1 items-center">
                    <DisplayAddressWithENS
                      address={participant.address}
                      name={participant.ensName}
                      onlyShowOneOfNameOrAddress={true}
                    />
                    <div>
                      <span className="text-gray-syn4">joined</span>{' '}
                      {participant.joinedDate}
                    </div>
                  </div>
                  <img
                    src="/images/ellipsis.svg"
                    alt="More actions"
                    className="visibility-hover invisible"
                  />
                </div>

                {/* Middle column */}
                <div className={middleColumnClasses}>
                  <StatusChip status={participant.status} />
                </div>

                {/* Right column */}
                <div
                  className={`${rightColumnClasses} ${
                    participant.status === Status.REJECTED
                      ? 'opacity-50'
                      : 'opacity-100'
                  } flex justify-end items-center space-x-2`}
                >
                  <div>
                    {formatInputValueWithCommas(
                      String(participant.contributionAmount)
                    )}
                  </div>
                  <div className="space-x-1 flex items-center">
                    <img src={tokenLogo} alt="Token" className="w-5 h-5" />
                    <div>{tokenSymbol}</div>
                  </div>
                  <div className="text-gray-syn4">
                    {floatedNumberWithCommas(
                      (participant.contributionAmount /
                        totalParticipantsAmount) *
                        100
                    )}
                    %
                  </div>
                </div>
              </div>

              {/* Expanding row - extra actions */}
              <TransitionInChildren isChildVisible={expandedRowIndex === index}>
                <div className="flex items-center py-2 space-x-3">
                  <CTAButton rounded disabled>
                    Adjust contribution
                  </CTAButton>
                  <CTAButton rounded disabled>
                    Message
                  </CTAButton>
                  <CTAButton
                    rounded
                    style={
                      participant.status === Status.ACCEPTED
                        ? CTAStyle.DARK_OUTLINED
                        : CTAStyle.REGULAR
                    }
                    onClick={() => {
                      if (participant.status === Status.ACCEPTED) {
                        handleParticipantRejectionClick(index);
                      }
                      if (participant.status === Status.REJECTED) {
                        handleParticipantAcceptanceClick(index);
                      }
                    }}
                  >
                    {participant.status === Status.ACCEPTED
                      ? 'Reject'
                      : 'Accept'}{' '}
                    backer
                  </CTAButton>
                </div>
              </TransitionInChildren>
            </div>
          );
        })}
      </div>
    </div>
  );
};

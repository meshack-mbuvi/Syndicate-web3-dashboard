import {
  AddressLayout,
  DisplayAddressWithENS
} from '@/components/shared/ensAddress/display';
import { H1, H3, H4 } from '@/components/typography';
import ReactTooltip from 'react-tooltip';
import { getFormattedDateTimeWithTZ } from '@/utils/dateUtils';

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
}

export const DealsParticipants: React.FC<Props> = ({ participants }) => {
  return (
    <div>
      <H4 regular extraClasses="text-gray-syn4 mb-4">
        {participants.length > 0 ? 'Participants' : 'No participants yet'}
      </H4>
      {participants.map((participant, index) => {
        return (
          <>
            {/* Large participants - 1st, 2nd, 3rd */}
            {index === 0 || index === 1 || index === 2 ? (
              <>
                <LargeBadge num={index + 1} participant={participant} />
                {index === 2 && <br />}
              </>
            ) : (
              <>
                {/* Small participants - 4th, 5th, ... */}
                <div
                  key={index}
                  className={`inline-flex space-x-2 ${
                    index === 3 ? 'mt-4' : 'mt-2'
                  }`}
                  data-tip
                  data-for={`deal-participant-${index}`}
                >
                  <DisplayAddressWithENS
                    name={participant.ensName}
                    address={participant.address}
                    layout={AddressLayout.ONE_LINE}
                    onlyShowOneOfNameOrAddress={true}
                  />
                  <div>
                    <span className="text-gray-syn4">joined </span>
                    {index + 1}th
                  </div>
                </div>
                <br />
              </>
            )}
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
          </>
        );
      })}

      {/* Empty badges if no participants */}
      {participants.length === 0 && (
        <div>
          <LargeBadge num={1} />
          <LargeBadge num={2} />
          <LargeBadge num={3} />
        </div>
      )}
    </div>
  );
};

interface LargeBadgeProps {
  num: number;
  participant?: { address: string; ensName?: string; createdAt: string };
}

const LargeBadge: React.FC<LargeBadgeProps> = ({ num, participant }) => {
  return (
    <div
      className="inline-flex space-x-4 px-4 py-2 mb-2 bg-gray-syn8 mr-2 rounded-2.5xl"
      data-tip
      data-for={`deal-participant-${num - 1}`}
    >
      <div className="flex items-end">
        <H1>{num}</H1>
        <H3 extraClasses="relative -top-1 text-gray-syn4">
          {num === 1 ? 'st' : num === 2 ? 'nd' : num === 3 ? 'rd' : ''}
        </H3>
      </div>
      {participant && (
        <DisplayAddressWithENS
          name={participant.ensName}
          address={participant.address}
          layout={AddressLayout.ONE_LINE}
          customTailwindXSpacingUnit={2}
          onlyShowOneOfNameOrAddress={true}
        />
      )}
    </div>
  );
};

import {
  AddressLayout,
  DisplayAddressWithENS
} from '@/components/shared/ensAddress/display';
import StatusBadge from '@/components/syndicateDetails/statusBadge';
import { B2, H2 } from '@/components/typography';
import { formatInputValueWithCommas } from '@/utils/formattedNumbers';

interface Props {
  leaderEnsName?: string;
  leaderAddress: string;
  numberOfParticipants: number;
  totalAllocatedAmount: number;
  tokenSymbol: string;
  tokenIcon: string;
  dealEndTime: number;
  isReviewingCommittments?: boolean;
}

export const DealsAllocations: React.FC<Props> = ({
  leaderEnsName,
  leaderAddress,
  numberOfParticipants,
  totalAllocatedAmount,
  tokenSymbol,
  tokenIcon,
  dealEndTime,
  isReviewingCommittments = false
}) => {
  return (
    <div className="space-y-8">
      <StatusBadge
        isDeal={true}
        isOpenToAllocations={true}
        dealEndTime={dealEndTime}
        isReviewingDealCommittments={isReviewingCommittments}
      />

      {isReviewingCommittments ? null : (
        <div className="flex justify-between w-10/12">
          <div>
            <B2 extraClasses="mb-3 text-gray-syn4">Deal leader</B2>
            <DisplayAddressWithENS
              name={leaderEnsName}
              address={leaderAddress}
              layout={AddressLayout.ONE_LINE}
              onlyShowOneOfNameOrAddress={true}
            />
          </div>
          <div>
            <B2 extraClasses="mb-1 text-gray-syn4">Participants</B2>
            <H2>{numberOfParticipants}</H2>
          </div>
          <div>
            <B2 extraClasses="mb-1 text-gray-syn4">Total allocated</B2>
            <div className="flex items-center space-x-1.5">
              <img src={tokenIcon} className="w-6 h-6" alt="Token icon" />
              <H2>
                {formatInputValueWithCommas(String(totalAllocatedAmount))}
              </H2>
              <div className="text-gray-syn4">{tokenSymbol}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

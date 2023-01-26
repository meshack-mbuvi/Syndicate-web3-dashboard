import { AddressLayout } from '@/components/shared/ensAddress';
import { DisplayAddressWithENS } from '@/components/shared/ensAddress/display';
import { B2, H1, H2 } from '@/components/typography';
import { getWeiAmount } from '@/utils/conversions';
import { formatInputValueWithCommas } from '@/utils/formattedNumbers';
import { DealMilestoneType } from '../create/milestone/types';
import { StatusChip } from '@/components/statusChip';
import { DealStatus } from '@/hooks/deals/types';
interface Props {
  dealName: string;
  dealDetails: string;
  dealDetailsTextColorClass?: string;
  ensName?: string;
  destinationAddress?: string;
  commitmentGoalAmount?: string;
  commitmentGoalTokenSymbol?: string;
  commitmentGoalTokenLogo?: string;
  milestoneType?: DealMilestoneType;
}

export const DealsOverview: React.FC<Props> = ({
  dealName,
  dealDetails,
  dealDetailsTextColorClass = 'text-white',
  ensName,
  destinationAddress,
  commitmentGoalAmount,
  commitmentGoalTokenSymbol,
  commitmentGoalTokenLogo,
  milestoneType = DealMilestoneType.CREATED
}) => {
  return (
    <div>
      {/* Title */}
      <H1 extraClasses="mb-3">{dealName} Deal</H1>

      {/* Details */}
      <B2 extraClasses={`${dealDetailsTextColorClass}`}>{dealDetails}</B2>

      <div className="md:flex md:space-x-14 space-y-4 md:space-y-0 mt-4">
        {(milestoneType === DealMilestoneType.CREATED ||
          milestoneType === DealMilestoneType.EXECUTED) && (
          <>
            {/* Destination */}
            <div>
              <B2 extraClasses="text-gray-syn4 mb-1">
                {milestoneType === DealMilestoneType.CREATED && 'Destination'}
                {milestoneType === DealMilestoneType.EXECUTED && 'Recipient'}
              </B2>
              <DisplayAddressWithENS
                name={ensName}
                address={destinationAddress}
                layout={AddressLayout.ONE_LINE}
                extraClasses="px-4 py-2.5 rounded-full border border-gray-syn7"
              />
            </div>

            {/* Goal */}
            <div>
              <B2 extraClasses="text-gray-syn4 mb-1">
                {milestoneType === DealMilestoneType.CREATED && 'Goal'}
                {milestoneType === DealMilestoneType.EXECUTED && 'Transferred'}
              </B2>
              <div className="flex items-center space-x-1">
                <img
                  src={commitmentGoalTokenLogo}
                  alt="Token logo"
                  className="w-6 h-6"
                />
                <H2>
                  {commitmentGoalAmount
                    ? formatInputValueWithCommas(
                        getWeiAmount(commitmentGoalAmount, 6, false)
                      )
                    : null}
                </H2>
                <B2 extraClasses="text-gray-syn4">
                  {commitmentGoalTokenSymbol}
                </B2>
              </div>
            </div>
          </>
        )}
        {milestoneType === DealMilestoneType.DISSOLVED && (
          <div className="flex flex-col">
            <B2 extraClasses="text-gray-syn4 mb-1">Status</B2>
            <StatusChip status={DealStatus.DISSOLVED} />
          </div>
        )}
      </div>
    </div>
  );
};

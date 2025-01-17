import { InputFieldWithDate } from '@/components/inputs/inputFieldWithDate';
import { InputFieldWithTime } from '@/components/inputs/inputFieldWithTime';
import { DetailedTile } from '@/components/tile/detailedTile';

export enum TimeWindow {
  DAY = 0,
  WEEK = 1,
  MONTH = 2,
  CUSTOM = 3
}

interface Props {
  closeDate?: Date;
  handleCloseDateChange?: (newDate: Date) => void;
  closeTime?: string;
  handleCloseTimeChange?: (newTime: string) => void;
  selectedTimeWindow?: number;
  handleTimeWindowChange?: (newTimeWindowIndex: number) => void;
}

export const InputTimeWindow: React.FC<Props> = ({
  closeDate,
  handleCloseDateChange,
  closeTime,
  handleCloseTimeChange,
  selectedTimeWindow,
  handleTimeWindowChange
}) => {
  return (
    <>
      <DetailedTile
        activeIndex={selectedTimeWindow ?? 0}
        onClick={(newTimeWindowIndex: number): void => {
          if (handleTimeWindowChange) {
            handleTimeWindowChange(newTimeWindowIndex);
          }
        }}
        options={[
          { title: '24 hours' },
          { title: '1 week' },
          { title: '1 month' },
          { title: 'Custom' }
        ]}
        customClasses="mt-2"
        alwaysUseHorizontalLayout={true}
      />
      <div
        className={`${
          selectedTimeWindow === TimeWindow.CUSTOM
            ? 'max-h-102 md:max-h-68 mt-8 opacity-100'
            : 'max-h-0 mt-0 opacity-0'
        } transition-all duration-500 space-y-5 md:space-y-0 space-x-0 md:space-x-5 md:flex overflow-hidden`}
      >
        <div className="md:w-1/2">
          <div>Close date</div>
          <InputFieldWithDate
            selectedDate={closeDate}
            onChange={(newDate): void => {
              if (handleCloseDateChange && newDate) {
                handleCloseDateChange(newDate);
              }
            }}
            extraClasses="mt-2"
          />
        </div>
        <div className="md:w-1/2">
          <div>Close time</div>
          <InputFieldWithTime
            value={closeTime}
            onChange={(e): void => {
              if (handleCloseTimeChange) {
                handleCloseTimeChange(e.target.value);
              }
            }}
            extraClasses="mt-2"
          />
        </div>
      </div>
    </>
  );
};

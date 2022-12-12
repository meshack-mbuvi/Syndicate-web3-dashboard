import { CreateFlowStepTemplate } from '..';
import { InputFieldWithDate } from '@/components/inputs/inputFieldWithDate';
import { DetailedTile } from '@/components/tile/detailedTile';
import TransitionBetweenChildren from '@/components/transition/transitionBetweenChildren';
import { InputFieldWithTime } from '@/components/inputs/inputFieldWithTime';

interface Props {
  selectedTimeWindow: SelectedTimeWindow | null;
  handleSelectedTimeWindowChange?: (newWindow: SelectedTimeWindow) => void;
  customDate?: Date;
  handleCustomDateChange?: (newDate: Date) => void;
  customTime?: string;
  handleCustomTimeChange?: (newTime: string) => void;
}

export enum SelectedTimeWindow {
  DAY = 0,
  WEEK = 1,
  MONTH = 2,
  CUSTOM = 3
}

export const DealsCreateWindow: React.FC<Props> = ({
  selectedTimeWindow,
  handleSelectedTimeWindowChange,
  customDate,
  handleCustomDateChange,
  customTime,
  handleCustomTimeChange
}) => {
  const showCustomTimeSelector =
    selectedTimeWindow === SelectedTimeWindow.CUSTOM;

  return (
    <CreateFlowStepTemplate
      title="What is the pre-commitment window?"
      activeInputIndex={0}
      inputs={[
        {
          input: (
            <TransitionBetweenChildren
              visibleChildIndex={showCustomTimeSelector ? 1 : 0}
            >
              <DetailedTile
                activeIndex={selectedTimeWindow as number}
                onClick={(index) => {
                  handleSelectedTimeWindowChange
                    ? handleSelectedTimeWindowChange(index)
                    : null;
                  if (index === SelectedTimeWindow.DAY) {
                    handleSelectedTimeWindowChange
                      ? handleSelectedTimeWindowChange(index)
                      : null;
                  }
                }}
                options={[
                  { title: '24 hours' },
                  { title: '1 week' },
                  { title: '1 month' },
                  { title: 'Custom' }
                ]}
              />
              <div className="flex space-x-2">
                <div className="md:w-1/2">
                  <InputFieldWithDate
                    selectedDate={customDate}
                    onChange={(newDate) => {
                      if (handleCustomDateChange && newDate) {
                        handleCustomDateChange(newDate);
                      }
                    }}
                  />
                </div>
                <div className="md:w-1/2">
                  <InputFieldWithTime
                    value={customTime}
                    onChange={(e) => {
                      if (handleCustomTimeChange) {
                        handleCustomTimeChange(e.target.value);
                      }
                    }}
                    placeholderLabel="Time"
                  />
                </div>
              </div>
            </TransitionBetweenChildren>
          ),
          label: `Commitment window ends ${
            showCustomTimeSelector ? 'on' : 'in'
          }`,
          info: `${
            showCustomTimeSelector
              ? 'This is the window when participants are able to pre-commit capital to the deal. You will have to finalize the deal manually though in order to close'
              : 'Participants are able to pre-commit capital to the deal until this day. You cannot extend this date but you can close early'
          }`
        }
      ]}
    />
  );
};

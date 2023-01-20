import { InputFieldWithDate } from '@/components/inputs/inputFieldWithDate';

import { DetailedTile } from '@/components/tile/detailedTile';
import TransitionBetweenChildren from '@/components/transition/transitionBetweenChildren';
import { CreateFlowStepTemplate } from '..';
import { default as _moment } from 'moment-timezone';
import { TimeInputField } from '@/components/inputs/timeInputField';

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

  const now = new Date();
  const timeZoneString = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const tz = _moment(now).tz(timeZoneString).format('zz');

  return (
    <CreateFlowStepTemplate
      title="How long is this deal active?"
      activeInputIndex={0}
      inputs={[
        {
          input: (
            <div className="space-y-4">
              <DetailedTile
                activeIndex={selectedTimeWindow as number}
                onClick={(index): void => {
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
                minimumButtonWidthPx={120}
              />
              <TransitionBetweenChildren
                visibleChildIndex={showCustomTimeSelector ? 0 : 1}
              >
                <div className="flex space-x-2">
                  <div className="md:w-1/2">
                    <InputFieldWithDate
                      selectedDate={customDate}
                      onChange={(newDate): void => {
                        if (handleCustomDateChange && newDate) {
                          handleCustomDateChange(newDate);
                        }
                      }}
                    />
                  </div>
                  <div className="md:w-1/2">
                    <TimeInputField
                      placeholderLabel="11:59PM"
                      onChange={(e): void => {
                        if (handleCustomTimeChange) {
                          handleCustomTimeChange(e.target.value);
                        }
                      }}
                      extraClasses={`flex w-full min-w-0 text-base font-whyte flex-grow dark-input-field-advanced`}
                      value={customTime}
                      currentTimeZone={tz}
                    />
                  </div>
                </div>
                {/* empty child to not show date picker before custom date is selected  */}
                <></>
              </TransitionBetweenChildren>
            </div>
          ),
          label: `Window ends ${showCustomTimeSelector ? 'on' : 'in'}`,
          info: `${
            showCustomTimeSelector
              ? 'This is the window when participants are able to back the deal. You will have to finalize the deal manually though in order to close'
              : 'Participants are able to back the deal until this day. You cannot extend this date but you can close early'
          }`
        }
      ]}
    />
  );
};

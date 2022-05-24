import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '@/state';
import { TimeInputField } from '@/components/inputs/timeInputField';
import { default as _moment } from 'moment-timezone';

interface TimeFieldProps {
  handleTimeChange: (timeValue: string) => void;
}

const TimeField: React.FC<TimeFieldProps> = ({
  handleTimeChange
}): React.ReactElement => {
  const {
    createInvestmentClubSliceReducer: { mintSpecificEndTime }
  } = useSelector((state: AppState) => state);
  const [time, setTime] = useState(mintSpecificEndTime);

  const onChange = (timeValue: string) => {
    setTime(timeValue);
    handleTimeChange(timeValue);
  };

  console.log({ time });

  const error = false;

  const now = new Date();
  const timeZoneString = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const tz = _moment(now).tz(timeZoneString).format('zz');

  return (
    <TimeInputField
      placeholderLabel="11:59PM"
      onChange={(e) => {
        onChange(e.target.value);
      }}
      extraClasses={`flex w-full min-w-0 text-base font-whyte ${
        error ? 'border border-red-500 focus:border-red-500' : ''
      } flex-grow dark-input-field-advanced`}
      value={time}
      currentTimeZone={tz}
    />
  );
};

export default TimeField;

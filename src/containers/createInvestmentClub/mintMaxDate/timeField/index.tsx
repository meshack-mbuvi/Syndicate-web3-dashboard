import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { AppState } from '@/state';
import { TimeInputField } from '@/components/inputs/timeInputField';
import { default as _moment } from 'moment-timezone';
import moment from 'moment';

interface TimeFieldProps {
  handleTimeChange: (timeValue: string) => void;
}

const TimeField: React.FC<TimeFieldProps> = ({
  handleTimeChange
}): React.ReactElement => {
  const {
    createInvestmentClubSliceReducer: { mintSpecificEndTime },
    erc20TokenSliceReducer: {
      erc20Token: { endTime }
    }
  } = useSelector((state: AppState) => state);
  const router = useRouter();

  // using this to set the correct default time based on whether we're
  // on the create flow page or the settings page.
  const isClubCreationPage = router.pathname === '/clubs/create';
  const [time, setTime] = useState(
    isClubCreationPage ? mintSpecificEndTime : moment(endTime).format('HH:mm')
  );

  const onChange = (timeValue: string) => {
    setTime(timeValue);
    handleTimeChange(timeValue);
  };

  const now = new Date();
  const timeZoneString = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const tz = _moment(now).tz(timeZoneString).format('zz');

  return (
    <TimeInputField
      placeholderLabel="11:59PM"
      onChange={(e) => {
        onChange(e.target.value);
      }}
      extraClasses={`flex w-full min-w-0 text-base font-whyte flex-grow dark-input-field-advanced`}
      value={time}
      currentTimeZone={tz}
    />
  );
};

export default TimeField;

import { InputFieldWithDate } from '@/components/inputs/inputFieldWithDate';
import { TimeInputField } from '@/components/inputs/timeInputField';
import { AppState } from '@/state';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { default as _moment } from 'moment-timezone';
import moment from 'moment';

const EditCollectiveMintTime: React.FC = () => {
  const {
    collectiveDetailsReducer: {
      details: { mintEndTime }
    }
  } = useSelector((state: AppState) => state);

  const _time = new Date(+mintEndTime * 1000);
  const [closeDate, setCloseDate] = useState(_time.toString());
  const [closeTime, setCloseTime] = useState(moment(_time).format('HH:mm'));

  const now = new Date();
  const timeZoneString = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const tz = _moment(now).tz(timeZoneString).format('zz');

  return (
    <div className="flex flex-col sm:flex-row flex-shrink-0 sm:space-x-5">
      <div className="sm:w-1/2 flex-shrink-0">
        <InputFieldWithDate
          selectedDate={new Date(closeDate)}
          onChange={(date) => setCloseDate(date.toString())}
          // isInErrorState={false} // TODO
        />
      </div>
      <div className="mt-4 sm:mt-0 sm:w-1/2">
        <TimeInputField
          placeholderLabel="11:59PM"
          onChange={(e) => {
            setCloseTime(e.target.value);
          }}
          extraClasses={`flex w-full min-w-0 text-base font-whyte flex-grow dark-input-field-advanced`}
          value={closeTime}
          currentTimeZone={tz}
          // isInErrorState={isInErrorState} // TODO
          // infoLabel={error} // TODO
        />
      </div>
    </div>
  );
};

export default EditCollectiveMintTime;

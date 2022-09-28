import { InputFieldWithDate } from '@/components/inputs/inputFieldWithDate';
import { TimeInputField } from '@/components/inputs/timeInputField';
import { AppState } from '@/state';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { default as _moment } from 'moment-timezone';
import moment from 'moment';
import { setMintEndTime } from '@/state/collectiveDetails';
import { B2 } from '@/components/typography';

const EditCollectiveMintTime: React.FC = () => {
  const {
    collectiveDetailsReducer: {
      details: { mintEndTime }
    }
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();

  const _time = new Date(+mintEndTime * 1000);
  const [closeDate, setCloseDate] = useState(_time);
  const [closeTime, setCloseTime] = useState(
    moment(_time.getTime()).format('HH:mm')
  );

  const now = new Date();
  const timeZoneString = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const tz = _moment(now).tz(timeZoneString).format('zz');

  useEffect(() => {
    if (!closeDate || !closeTime) return;
    let targetDate;
    if (closeTime && closeDate) {
      const dateString = new Date(closeDate).toDateString();
      targetDate = moment(dateString + ' ' + closeTime).valueOf();
      dispatch(setMintEndTime(String(targetDate / 1000)));
    }
  }, [closeDate, closeTime]);

  return (
    <div className="flex flex-col sm:flex-row flex-shrink-0 sm:space-x-5">
      <div className="sm:w-1/2 flex-shrink-0">
        <B2 className="mb-2">Close Date</B2>
        <InputFieldWithDate
          selectedDate={new Date(closeDate)}
          onChange={(date) => {
            // @ts-expect-error TS(2345): Argument of type 'Date | null' is not assig... Remove this comment to see the full error message
            setCloseDate(date);
          }}
          // isInErrorState={false} // TODO
        />
      </div>
      <div className="mt-4 sm:mt-0 sm:w-1/2">
        <B2 className="mb-2">Time</B2>
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

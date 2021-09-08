import { setCloseDateAndTime } from "@/redux/actions/createSyndicate/syndicateOnChainData/closeDateAndTime";
import { RootState } from "@/redux/store";
import { TWO_WEEKS_IN_MS } from "@/utils/constants";
import { getLocaleObject } from "@/utils/dateUtils";
import generateTimeIntervals from "@/utils/generateTimeIntervals";
import ct from "countries-and-timezones";
import React, { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { ContentTitle } from "../../shared";
import { CustomSelectInput } from "@/containers/create/shared/customSelectInput";

// we get user's locale
const localeString = new Intl.NumberFormat().resolvedOptions().locale;

// pass the locale string dateUtils to get locale object
const locale = getLocaleObject(localeString);

const TimeAndDatePicker: React.FC = () => {
  const {
    closeDateAndTimeReducer: {
      createSyndicate: {
        closeDateAndTime: {
          selectedDate: storedSelectedDate,
          selectedTimeValue: storedSelectedTimeValue,
          selectedTimezone: storedSelectedTimezone,
        },
      },
    },
  } = useSelector((state: RootState) => state);

  const timeIntervals = useMemo(() => generateTimeIntervals(), []);

  const [selectedDate, setSelectedDate] = useState(storedSelectedDate);

  const [selectedTimeValue, setSelectedTimeValue] = useState(
    storedSelectedTimeValue,
  );
  const [selectedTimezone, setSelectedTimezone] = useState<
    Record<"label" | "value" | "timezone", string>
  >(storedSelectedTimezone);

  const dispatch = useDispatch();

  // used as the default date for a syndicates closure
  // close date is set to +2 weeks from current date
  const startDate = new Date(Date.now() + TWO_WEEKS_IN_MS);

  useEffect(() => {
    dispatch(
      setCloseDateAndTime({
        selectedDate,
        selectedTimeValue,
        selectedTimezone,
      }),
    );
  }, [selectedDate, selectedTimeValue, selectedTimezone, dispatch]);

  const storeSelectedTimezone = (timezone: any) => {
    setSelectedTimezone(timezone);
  };

  const storeSelectedTimeValue = (timeValue: any) => {
    setSelectedTimeValue(timeValue.replaceAll("_", " "));
  };

  const timezones = ct.getAllTimezones();

  const formattedTimezones = useMemo(
    () =>
      Object.keys(timezones).map((timezone) => ({
        label: timezones[timezone]?.name,
        value: timezones[timezone]?.name,
        timezone: timezones[timezone]?.utcOffsetStr,
      })),
    [timezones],
  );

  return (
    <div className="flex flex-col">
      <ContentTitle>When should this syndicate close to deposits?</ContentTitle>

      <div className="flex flex-col">
        <p>Close time</p>
        <div className="flex mt-2 space-x-6 justify-between items-center w-full">
          <div className="w-5/12 flex flex-1">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              startDate={startDate}
              placeholderText={startDate?.toLocaleDateString()}
              minDate={new Date()}
              todayButton="Go to Today"
              locale={locale}
              dateFormat="P"
              formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 1)}
              showPopperArrow={false}
              dropdownMode="select"
            />
          </div>

          <div className="flex justify-center">
            <p>at</p>
          </div>
          <div className="flex-1">
            <CustomSelectInput
              selectOptions={timeIntervals}
              isSearchable={false}
              placeholder="Choose time"
              selectedValue={selectedTimeValue.replaceAll("_", " ")}
              storeSelectedOption={storeSelectedTimeValue}
            />
          </div>
        </div>
        <p className="mt-7">Time zone</p>
        <div className="w-full mt-2">
          <CustomSelectInput
            selectOptions={formattedTimezones}
            isSearchable={true}
            placeholder="Choose your timezone"
            selectedValue={selectedTimezone}
            storeSelectedOption={storeSelectedTimezone}
            showMoreInfo={true}
            usingTimezone={true}
          />
        </div>
      </div>
      <div className="mt-5">
        <p className="text-gray-3">
          By default, this value is set by your computer’s local timezone. The
          specified close time is stored as UTC in the smart contract so it’ll
          close at the same moment everywhere in the world, regardless of
          location.
        </p>
      </div>
    </div>
  );
};

export default TimeAndDatePicker;

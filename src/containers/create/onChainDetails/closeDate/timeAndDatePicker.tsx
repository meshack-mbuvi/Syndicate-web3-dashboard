import Select from "@/components/inputs/select";
import { setCloseDateAndTime } from "@/redux/actions/createSyndicate/syndicateOnChainData/closeDateAndTime";
import { RootState } from "@/redux/store";
import { TWO_WEEKS_IN_MS } from "@/utils/constants";
import { getLocaleObject } from "@/utils/dateUtils";
import generateTimeIntervals from "@/utils/generateTimeIntervals";
import ct from "countries-and-timezones";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import ReactSelect, { components, SingleValueProps } from "react-select";
import { ContentTitle } from "../../shared";
import { useCreateSyndicateContext } from "@/context/CreateSyndicateContext";

// we get user's locale
const localeString = new Intl.NumberFormat().resolvedOptions().locale;
// pass the locale string dateUtils to get locale object
const locale = getLocaleObject(localeString);

const IndicatorSeparator = (props) => {
  return <span {...props.innerProps} />;
};

const SingleValue = ({ children, ...props }) => {
  const { currentTemplateSubstep } =
    useCreateSyndicateContext();
  const router = useRouter();
  const templateInUse = router.pathname.includes("template") && !currentTemplateSubstep.length;
  
  return (
    <components.SingleValue
      {...(props as SingleValueProps<{ [key: string]: string }>)}
    >
      <div
        className={`flex ${
          templateInUse ? "justify-start" : "justify-between"
        } items-center`}
      >
        {templateInUse ? (
          <span>{children.replaceAll("_", " ").split("/")[1]}</span>
        ) : (
          <span>{children.replaceAll("_", " ")}</span>
        )}
        {templateInUse ? (
          <span className="pr-1 text-sm">(UTC {props?.data?.timezone})</span>
        ) : (
          <span className="text-gray-49">UTC {props?.data?.timezone}</span>
        )}
      </div>
    </components.SingleValue>
  );
};

const Input = (props) => {
  if (props.isHidden) {
    return <components.Input {...props} />;
  }
  return (
    <div>
      <components.Input
        className="text-white text-sm font-whyte border-none"
        {...props}
      />
    </div>
  );
};

const Option = (props) => {
  // hide UTC data when using templates because the content will be too squeezed.
  const { currentTemplateSubstep } =
    useCreateSyndicateContext();
  const router = useRouter();
  const templateInUse = router.pathname.includes("template") && !currentTemplateSubstep.length;

  return (
    <components.Option {...props}>
      <div className="flex justify-between">
        <span className="text-sm">{props.children.replaceAll("_", " ")}</span>
        {!templateInUse && (
          <span className="text-gray-49 text-sm">
            UTC {props.data.timezone}
          </span>
        )}
      </div>
    </components.Option>
  );
};

const customStyles = {
  control: (base) => ({
    ...base,
    background: "#000000",
    borderRadius: "5px",
    paddingTop: "0.375rem",
    paddingBottom: "0.375rem",
    paddingLeft: "0.2rem",
    border: "1px solid #3D3D3D",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#ffffff",
    width: "98%",
  }),
  input: (base) => ({
    ...base,
    "& input": {
      fontFamily: "ABC Whyte Regular",
      "&:focus": {
        boxShadow: "none",
        border: "none !important",
      },
    },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "0.375rem",
    color: "#fffff",
    background: "#151618",
    marginTop: "8px",
  }),
  menuList: (base) => ({
    ...base,
    padding: "16px",
    borderRadius: "0.375rem",
  }),
  option: (base, state) => ({
    ...base,
    paddingTop: "8px",
    paddingBottom: "8px",
    paddingLeft: "16px",
    paddingRight: "16px",
    background: state.isFocused ? "#2C2C2F" : "#151618",
    color: state.isFocused ? "white" : "white",
    borderRadius: "0.375rem",
    "&:hover": {
      color: "white",
      background: "#2C2C2F",
    },
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#6b7280",
  }),
};

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
    // TO BE USED IN THE CONTRACT
    // const isoDateString = `${
    //   selectedDate.toISOString().split("T")[0]
    // }T${convertTime12to24(selectedTimeValue)}:00${selectedTimezone.timezone}`;
    // getUnixTimeFromDate(new Date(isoDateString)

    dispatch(
      setCloseDateAndTime({
        selectedDate,
        selectedTimeValue,
        selectedTimezone,
      }),
    );
  }, [selectedDate, selectedTimeValue, selectedTimezone, dispatch]);

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
            <Select
              data={timeIntervals}
              value={selectedTimeValue.replaceAll("_", " ")}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSelectedTimeValue(e.target.value.replaceAll("_", " "))
              }
              name="time"
            />
          </div>
        </div>
        <p className="mt-7">Time zone</p>
        <div className="w-full mt-2">
          <ReactSelect
            options={formattedTimezones}
            isSearchable
            name="timezone"
            placeholder="Choose your timezone"
            className="bg-black"
            styles={customStyles}
            components={{ IndicatorSeparator, Input, Option, SingleValue }}
            onChange={(selectedValue) => setSelectedTimezone(selectedValue)}
            value={selectedTimezone}
          />
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
    </div>
  );
};

export {
  TimeAndDatePicker,
  IndicatorSeparator,
  Input,
  Option,
  SingleValue,
  customStyles,
};

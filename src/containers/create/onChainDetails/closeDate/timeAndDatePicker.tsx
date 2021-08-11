import Select from "@/components/inputs/select";
import { setCloseDateAndTime } from "@/redux/actions/createSyndicate/syndicateOnChainData/closeDateAndTime";
import { RootState } from "@/redux/store";
import { TWO_WEEKS_IN_MS } from "@/utils/constants";
import generateTimeIntervals from "@/utils/generateTimeIntervals";
import ct from "countries-and-timezones";
import React, { forwardRef, useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import ReactSelect, { components, SingleValueProps } from "react-select";

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

  const InputWithCalendar = forwardRef<
    HTMLInputElement,
    {
      value?: string;
      onClick?: (val: unknown) => void;
    }
  >(({ value, onClick }, ref) => (
    <div className="relative flex px-1">
      <input
        type="text"
        className="block text-lg text-white bg-black border border-gray-24 rounded-md shadow-sm font-whyte h-14 px-4 py-5 relative w-full focus:outline-none  focus:border-gray-24 flex-grow hover:border-blue-50"
        defaultValue={value}
        onClick={onClick}
        readOnly={true}
        ref={ref}
      />
    </div>
  ));

  InputWithCalendar.displayName = "InputWithCalendar";

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

  const IndicatorSeparator = (props) => {
    return <span {...props.innerProps} />;
  };

  const SingleValue = ({ children, ...props }) => {
    return (
      <components.SingleValue
        {...(props as SingleValueProps<{ [key: string]: string }>)}
      >
        <div className="flex justify-between">
          <span>{children.replaceAll("_", " ")}</span>
          <span className="text-gray-49">UTC {props?.data?.timezone}</span>
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
          className="text-white text-lg font-whyte border-none"
          {...props}
        />
      </div>
    );
  };

  const Option = (props) => {
    return (
      <components.Option {...props}>
        <div className="flex justify-between">
          <span>{props.children.replaceAll("_", " ")}</span>
          <span className="text-gray-49">UTC {props.data.timezone}</span>
        </div>
      </components.Option>
    );
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      background: "#000000",
      borderRadius: "5px",
      height: "56px",
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
      borderRadius: 0,
      color: "#fffff",
      background: "#000000",
      border: "1px solid #3D3D3D",
      marginTop: 0,
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
    }),
    option: (base, state) => ({
      ...base,
      background: state.isFocused ? "bg-gray-99" : "#000000",
      color: state.isFocused ? "rgba(0, 0, 0, 1)" : "#ffffff",
      "&:hover": {
        color: "#000000",
        background: "#ffffff",
      },
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#6b7280",
    }),
  };

  return (
    <div className="flex flex-col">
      <div className="text-2xl leading-8">
        <p>When should this syndicate close to deposits?</p>
      </div>
      <div className="mt-10 flex flex-col">
        <p>Close time</p>
        <div className="flex mt-2 space-x-6 justify-between items-center w-full">
          <div>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              startDate={new Date(Date.now() + TWO_WEEKS_IN_MS)}
              // Add date two weeks from now
              minDate={new Date()}
              nextMonthButtonLabel=">"
              previousMonthButtonLabel="<"
              todayButton="Go to Today"
              formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 1)}
              dateFormat={selectedDate.toLocaleDateString()}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              shouldCloseOnSelect={false}
              customInput={<InputWithCalendar />}
            />
          </div>

          <div className="flex justify-center">
            <p>at</p>
          </div>
          <div className="w-2/5">
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
        <div className="w-full px-1 mt-2">
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
          <p className="text-sm text-gray-49">
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

export default TimeAndDatePicker;

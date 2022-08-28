import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useController } from 'react-hook-form';

interface Props {
  disabled: boolean;
  borderStyles?: string;
  label?: string;
  name: string;
  control: any;
  textAlignment?: string;
}

const ActivityDatePicker: React.FC<Props> = ({
  disabled,
  name,
  control,
  label = '',
  borderStyles = '',
  textAlignment = ''
}) => {
  const {
    field: { onChange, value }
  } = useController({
    name,
    control,
    defaultValue: ''
  });

  const [transactionDate, setTransactionDate] = useState<Date>(new Date());

  useEffect(() => {
    if (value) {
      setTransactionDate(new Date(value));
    }
  }, [value]);

  const handleDateChange = (date: React.SetStateAction<Date>) => {
    setTransactionDate(date);
    onChange(date);
  };

  const CustomInput = React.forwardRef<
    any,
    { onClick?: () => void; value?: string }
  >(({ value, onClick }, ref) => (
    <button
      className="flex mr-0 my-auto py-4 items-center font-whyte text-base text-white"
      onClick={(e) => {
        onClick();
      }}
      value={value}
    >
      {value}
      <img
        src="/images/activity/chevron-down.svg"
        alt="chevron-down"
        className="ml-2"
      />
    </button>
  ));

  return (
    <div className={`flex justify-between ${borderStyles}`}>
      {label ? <div className={`my-auto w-2/5 leading-5`}>{label}</div> : null}

      <div className="flex">
        {disabled ? (
          <div className="text-base py-4 my-auto text-white">
            {format(transactionDate, 'LLL d, yyyy')}
          </div>
        ) : (
          <DatePicker
            closeOnScroll={(e) => e.target === document}
            selected={transactionDate}
            onChange={(date: Date) => handleDateChange(date)}
            todayButton="Go to Today"
            dateFormat="LLL d, yyyy"
            formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 1)}
            showPopperArrow={false}
            dropdownMode="select"
            className={`border-none text-base text-gray-syn4 border-gray-24 inherit ${textAlignment}`}
            customInput={<CustomInput />}
          />
        )}
      </div>
    </div>
  );
};

export default ActivityDatePicker;

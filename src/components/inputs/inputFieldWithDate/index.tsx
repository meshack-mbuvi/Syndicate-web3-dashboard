import DatePicker from 'react-datepicker';

export enum TokenType {
  USDC = 'USDC'
}

export const InputFieldWithDate = (props: {
  selectedDate?: Date;
  placeholderLabel?: string;
  infoLabel?: string;
  isInErrorState?: boolean;
  extraClasses?: string;
  onChange: (date: Date) => void;
}) => {
  const {
    selectedDate,
    placeholderLabel = 'Select a date',
    infoLabel,
    isInErrorState = false,
    extraClasses = '',
    onChange
  } = props;

  return (
    <>
      <div className="relative">
        <DatePicker
          minDate={new Date()}
          popperProps={{
            positionFixed: true // use this to make the popper position: fixed
          }}
          closeOnScroll={(e) => e.target === document}
          selected={selectedDate}
          onChange={onChange}
          todayButton="Go to Today"
          dateFormat="MMMM d, yyyy"
          formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 1)}
          showPopperArrow={false}
          dropdownMode="select"
          placeholderText={placeholderLabel}
          className={`focus:border-blue-navy hover:border-gray-syn3 ${
            isInErrorState ? 'border-red-error' : 'border-gray-24'
          } transition-all ${extraClasses}`}
        />
      </div>
      {infoLabel && (
        <div
          className={`text-sm mt-2 ${
            isInErrorState ? 'text-red-error' : 'text-gray-syn4'
          }`}
        >
          {infoLabel}
        </div>
      )}
    </>
  );
};

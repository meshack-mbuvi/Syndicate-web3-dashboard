import PropTypes from "prop-types";
import React from "react";
import DatePicker from "react-datepicker";
import { InfoIcon } from "src/components/iconWrappers";

/**
 * A date input component with label and icon at the right end
 * If the input is disable, the input field without border, and with grayish
 *  small text is rendered.
 * @param {*} props
 */
export const DateInput = (props) => {
  const { label, name, startDate, onChangeHandler, register, error } = props;

  return (
    <div className="flex flex-row justify-end">
      <div className="mr-4 w-5/12 flex justify-end">
        <label
          htmlFor="syndicateAddress"
          className="block pt-2 text-black text-lg font-medium">
          {label}
        </label>
      </div>

      <div className="w-7/12 flex justify-between">
        <DatePicker
          selected={startDate}
          onChange={onChangeHandler}
          className={`flex flex-grow focus:ring-blue focus:border-blue rounded-md text-black border-gray-85`}
          ref={register}
          name={name}
        />
        {/* icon */}
        <div className="w-6 ml-4 mt-1">
          <InfoIcon />
        </div>
      </div>
      {error ? <p className="text-red-500 text-sm">{error}</p> : null}
    </div>
  );
};

DateInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  register: PropTypes.any.isRequired,
  startDate: PropTypes.any,
  onChangeHandler: PropTypes.func,
  error: PropTypes.string.isRequired,
};

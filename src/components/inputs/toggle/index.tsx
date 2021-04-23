import PropTypes from "prop-types";
import React from "react";
import { InfoIcon } from "src/components/iconWrappers";

export const Toggle = (props) => {
  const { toggleEnabled, label, enabled = false } = props;
  let translateClass = "translate-x-0";
  let backgroundClass = "bg-gray-light";

  if (enabled) {
    backgroundClass = "bg-indigo-600";
    translateClass = "translate-x-5";
  }

  return (
    <div className="flex flex-row justify-center w-full">
      <div className="mr-4 w-1/2 flex justify-end">
        <label
          htmlFor="syndicateAddress"
          className="block pt-2 text-black text-lg font-medium">
          {label}
        </label>
      </div>

      <div className="flex justify-start w-1/2">
        {/* <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" --> */}
        <button
          type="button"
          className={`${backgroundClass} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-1`}
          aria-pressed={enabled}
          onClick={() => toggleEnabled()}>
          <span className="sr-only">Manually whitelist depositors</span>
          {/* <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" --> */}
          <span
            aria-hidden="true"
            className={`${translateClass} pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
        </button>

        <div className="w-6 ml-4 mt-1">
          <InfoIcon />
        </div>
      </div>
    </div>
  );
};

Toggle.propTypes = {
  enabled: PropTypes.bool.isRequired,
  toggleEnabled: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

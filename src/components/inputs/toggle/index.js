import React from "react";
import PropTypes from "prop-types";

export const Toggle = (props) => {
  const { toggleEnabled, label, enabled = false } = props;
  let translateClass = "translate-x-0";
  let backgroundClass = "bg-gray-light";

  if (enabled) {
    backgroundClass = "bg-indigo-600";
    translateClass = "translate-x-5";
  }

  return (
    <div className="flex flex-row justify-center w-2/3">
      <div className="mr-4 w-auto flex justify-end">
        <label
          htmlFor="syndicateAddress"
          className="block pt-2 text-black text-sm font-medium"
        >
          {label}
        </label>
      </div>

      <div className="flex justify-start">
        {/* <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" --> */}
        <button
          type="button"
          className={`${backgroundClass} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-1`}
          aria-pressed={enabled}
          onClick={() => toggleEnabled()}
        >
          <span className="sr-only">Manually whitelist depositors</span>
          {/* <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" --> */}
          <span
            aria-hidden="true"
            className={`${translateClass} pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
          ></span>
        </button>
        <div className="w-6 ml-4 mt-1">
          <span className="w-8 h-5 mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="gray"
              className="rotate-180"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
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

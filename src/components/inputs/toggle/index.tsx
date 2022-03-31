import React from 'react';
import { InfoIcon } from 'src/components/iconWrappers';

export const Toggle: React.FC<{
  enabled: boolean;
  toggleEnabled: () => void;
  label: string;
  tooltip?: string;
}> = (props) => {
  const { toggleEnabled, label, tooltip, enabled = false } = props;
  let translateClass = 'translate-x-0';
  let backgroundClass = 'bg-gray-light';

  if (enabled) {
    backgroundClass = 'bg-blue';
    translateClass = 'translate-x-5';
  }

  return (
    <div className="flex flex-row justify-end w-full">
      <div className="mr-4 w-1/2 flex justify-end">
        <label
          htmlFor={label}
          className="block pt-2 text-black text-sm font-medium"
        >
          {label}
        </label>
      </div>

      <div className="w-4/5 flex-grow flex flex-row justify-between ml-3">
        {/* <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" --> */}
        <button
          type="button"
          className={`${backgroundClass} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue mt-2`}
          aria-pressed={enabled}
          onClick={() => toggleEnabled()}
        >
          <span className="sr-only">{label}</span>
          {/* <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" --> */}
          <span
            aria-hidden="true"
            className={`${translateClass} pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
          ></span>
        </button>

        {/* <!-- allow optional tooltip --> */}
        {tooltip !== '' && (
          <div className="mt-1 flex mr-auto">
            <InfoIcon tooltip={tooltip} />
          </div>
        )}
      </div>
    </div>
  );
};

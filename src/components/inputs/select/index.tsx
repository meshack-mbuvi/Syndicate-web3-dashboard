import React from "react";

const Select = (props: {
  label?: string;
  data: string[];
  icon?;
  name;
  onChange;
  value;
  defaultValue?: string;
  className?: string;
  rightPlaceholder?: string;
  showBgIcon?: boolean;
  subTitle?: string;
}): JSX.Element => {
  const {
    label,
    data,
    name,
    icon,
    onChange,
    value,
    defaultValue,
    rightPlaceholder,
    showBgIcon,
    subTitle,
    ...rest
  } = props;
  return (
    <div {...rest} className={`${rest.className} relative`}>
      {label ? (
        <div className="flex justify-between">
          <label
            htmlFor={label}
            className="block py-2 text-white text-sm font-medium"
          >
            {label}
          </label>
          <span className="block py-2 text-gray-3 text-sm font-normal">
            {subTitle}
          </span>
        </div>
      ) : null}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-10 left-2 flex items-center px-2">
            <label className="rounded" htmlFor={name}>
              <img src={icon} alt="Logo" />
            </label>
          </div>
        )}
        <select
          id={label}
          name={label}
          className={`inline-flex py-3 align-end text-sm w-full text-right min-w-0 font-whyte flex-grow dark-input-field ${
            icon ? "pl-12" : ""
          } 
          ${rightPlaceholder && !showBgIcon ? "bg-none" : ""}`}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onChange}
          value={value}
        >
          {data.map(
            (
              item:
                | boolean
                | React.ReactChild
                | React.ReactFragment
                | React.ReactPortal,
              index: React.Key,
            ) => (
              <option key={index}>{item}</option>
            ),
          )}
        </select>
        {rightPlaceholder && (
          <div
            className={`absolute text-lg inset-y-0 ${
              showBgIcon ? "right-16" : "right-2"
            } flex items-center px-2 pointer-events-none text-gray-49`}
          >
            <p>{rightPlaceholder}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;

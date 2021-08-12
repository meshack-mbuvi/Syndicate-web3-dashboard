import React from "react";

interface ISpinner {
  height?: string;
  width?: string;
}

export const Spinner = (props: ISpinner) => {
  const { height = "h-10", width = "w-10" } = props;
  return (
    <div className="flex justify-center my-8">
      <span className={`${height} ${width}`}>
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="spinner stroke-current text-blue"
        >
          <circle cx="50" cy="50" r="45" strokeWidth="7" />
        </svg>
      </span>
    </div>
  );
};

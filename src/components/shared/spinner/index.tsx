import React from "react";

export const Spinner = () => {
  return (
    <div className="flex justify-center my-8">
      <span className="w-10 h-10">
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="spinner">
          <circle cx="50" cy="50" r="45" />
        </svg>
      </span>
    </div>
  );
};

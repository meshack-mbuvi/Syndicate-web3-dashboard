import React from "react";
const MaxButton: React.FC<{ handleClick: () => void }> = ({handleClick}) => (
  <button
    className="ml-4 px-4 py-1.5 text-gray-syn4 bg-gray-syn7 rounded-full"
    onClick={handleClick}
  >
    Max
  </button>
);

export default MaxButton;

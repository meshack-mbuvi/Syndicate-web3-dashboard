import React, { useRef, useState } from "react";
import useOnClickOutside from "../shared/useOnClickOutside";

const MaxButton: React.FC<{ handleClick: () => void }> = ({ handleClick }) => {
  const ref = useRef();

  const [isButtonActive, setIsButtonActive] = useState(false);

  useOnClickOutside(ref, () => setIsButtonActive(false));

  const handleMaxButtonClick = () => {
    setIsButtonActive(true);
    handleClick();
  };
  return (
    <button
      ref={ref}
      className={`ml-4 px-4 py-1.5 text-gray-syn4 bg-gray-syn7 rounded-full hover:ring-1 hover:ring-blue-navy ${
        isButtonActive && "ring-1 ring-blue-navy"
      }`}
      onClick={handleMaxButtonClick}
    >
      Max
    </button>
  );
};

export default MaxButton;

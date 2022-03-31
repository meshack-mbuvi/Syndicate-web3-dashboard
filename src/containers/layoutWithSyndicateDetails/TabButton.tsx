import React from "react";

interface TabButtonProps {
  label: string;
  onClick: () => void;
  active: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({ label, onClick, active }) => {
  return (
    <button
      key="assets"
      onClick={onClick}
      className={`whitespace-nowrap h4 w-fit-content py-6 transition-all border-b-1 focus:ring-0 text-sm cursor-pointer ${
        active
          ? "border-white text-white"
          : "border-transparent text-gray-syn4 hover:text-gray-40"
      }`}
    >
      {label}
    </button>
  );
};

export default TabButton;

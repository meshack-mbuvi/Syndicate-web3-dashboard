import React from "react";

const DuplicateClubWarning: React.FC<{
  dismissDuplicateClubWarning: () => void;
}> = ({ dismissDuplicateClubWarning }) => {
  return (
    <div className="bg-gray-syn7 rounded-2.5xl py-4 px-5 flex justify-between relative">
      <div className="flex justify-start items-start">
        <div className="pt-1 mr-4">
          <img
            src="/images/syndicateStatusIcons/warning-triangle-yellow.svg"
            alt="warning"
            className="w-4 mr-4"
          />
        </div>

        <div>
          <p className="pb-2 text-white">Heads up: different clubs may look similar</p>
          <p className="text-sm text-gray-syn3">
            A club&apos;s name, gradient, and token name aren&apos;t unique, so different
            clubs can look similar. Make sure that you&apos;re on the right club by double checking
            that the sender is legitimate.
          </p>
        </div>
      </div>

      <button
        className="flex justify-start pt-1 flex-shrink-0 h-4"
        onClick={() => dismissDuplicateClubWarning()}
        
      >
        <img
          src="/images/close-gray-5.svg"
          width="12"
          height="12"
          alt="close"
        />
      </button>

      <div className="absolute w-12 h-5 -top-4 left-28 overflow-hidden">
        <div className="relative w-full h-full">
          <div
            className="bg-gray-syn7 absolute"
            id="arrow"
            style={{
              top: "10px",
              width: "48px",
              height: "48px",
              transform: "scale(1.5,1) rotate(45deg)",
              borderRadius: "4px",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default DuplicateClubWarning;

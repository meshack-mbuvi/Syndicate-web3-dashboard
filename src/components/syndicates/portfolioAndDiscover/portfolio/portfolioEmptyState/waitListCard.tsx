import React from "react";

const WaitListCard: React.FC = () => {
  return (
    <div
      className="bg-gray-syn8 rounded-2-half px-8 py-7 flex justify-between items-center space-x-8"
      style={{ width: "730px" }}
    >
      <p className="text-base text-left">
        To create an investment club, you’ll need an invite from the Syndicate
        team. Join the waitlist to get started.
      </p>
      <a
        href="https://bpiowescm93.typeform.com/to/mJnnQ5ZI"
        className="px-8 py-4 rounded-custom bg-white flex justify-center items-center"
        target="_blank"
        rel="noreferrer"
      >
        <p className="text-black pr-3 whitespace-nowrap">Join the waitlist</p>
        <img src="images/actionIcons/arrowRightBlack.svg" alt="arrow-right" />
      </a>
    </div>
  );
};

export default WaitListCard;

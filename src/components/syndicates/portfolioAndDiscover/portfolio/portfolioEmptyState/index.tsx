import React from "react";
import WaitListCard from "./waitListCard";

const PortfolioEmptyState: React.FC = () => {
  return (
    <div className="text-center flex-col" style={{ marginTop: "196px" }}>
      <div className="flex flex-col justify-start items-center mt-20">
        <img
          style={{ marginBottom: "44.9px" }}
          src="images/syndicateStatusIcons/portfolioEmptyIcon.svg"
          alt="empty icon"
        />
        <span className="text-lg md:text-2xl">
          You’re not in any investment clubs yet
        </span>
        <p className="text-gray-syn4 pt-2.5">
          Once you create or join one, it’ll appear here
        </p>
        <div style={{ marginTop: "210px" }}>
          <WaitListCard />
        </div>
      </div>
    </div>
  );
};

export default PortfolioEmptyState;

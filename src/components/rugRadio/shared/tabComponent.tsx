import React, { useState } from "react";
import { NFTChecker } from "./NFTchecker";

export const TabComponent: React.FC<{ tabContents }> = ({ tabContents }) => {
  const [activeTab, setActiveTab] = useState("claim");

  return (
    <div className="p-8 pt-6 space-y-8 bg-gray-syn8 rounded-2.5xl">
      <div>
        <div className={`flex justify-between`}>
          <nav className="flex space-x-6 leading-4" aria-label="Tabs">
            {Object.keys(tabContents).map((key) => (
              <button
                key={tabContents[key]}
                onClick={() => setActiveTab(key.toLowerCase())}
                className={`flex whitespace-nowrap h4 -mb-0.4 pb-6 w-fit-content transition-all focus:ring-0 font-whyte text-sm cursor-pointer ${
                  activeTab == key
                    ? "border-b-1 border-white text-white"
                    : "border-transparent text-gray-syn4 hover:text-gray-40"
                }`}
              >
                {tabContents[key].title}
              </button>
            ))}
          </nav>
          <button
            onClick={() => setActiveTab("check nft")}
            className={`flex whitespace-nowrap h4 -mb-0.4 pb-6 w-fit-content transition-all focus:ring-0 font-whyte text-sm cursor-pointer ${
              activeTab == "check nft"
                ? "border-b-1 border-white text-white"
                : "border-transparent text-gray-syn4 hover:text-gray-40"
            }`}
          >
            check nft
          </button>
        </div>
        <div className={`block border-b-1 border-gray-syn7 -mx-8`}></div>
      </div>
      <div className="space-y-4">
        {tabContents[activeTab]?.content ?? <NFTChecker />}
      </div>
    </div>
  );
};

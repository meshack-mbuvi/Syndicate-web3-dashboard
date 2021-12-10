import Image from "next/image";
import React from "react";

const AssetEmptyState: React.FC<{ activeAssetTab: string }> = ({
  activeAssetTab,
}) => {
  return (
    <div className="flex justify-center">
      <div className="mb-10 mt-24">
        <div className="flex flex-col">
          <div className="mt-2.5 text-center">
            <Image
              width="35"
              height="26"
              src="/images/tray-icon.svg"
              alt="docs"
            />
          </div>
          <div
            className="text-white text-2xl leading-9 text-center"
            style={{ marginTop: 19.39 }}
          >
            No assets yet
          </div>

          {activeAssetTab === "all" && (
            <p className="text-center text-gray-syn3 text-base m-3.5">
              Deposits, investments, and collectibles will appear here
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetEmptyState;

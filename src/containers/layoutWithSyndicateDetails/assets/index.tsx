import TabsButton from "@/components/TabsButton";
import AssetEmptyState from "@/containers/layoutWithSyndicateDetails/assets/AssetEmptyState";
import Collectibles from "@/containers/layoutWithSyndicateDetails/assets/Collectibles";
import { tokenTableColumns } from "@/containers/layoutWithSyndicateDetails/assets/constants";
import TokenTable from "@/containers/layoutWithSyndicateDetails/assets/TokenTable";
import { AppState } from "@/state";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Assets: React.FC = () => {
  const {
    assetsSliceReducer: { tokensResult, collectiblesResult },
    web3Reducer: {
      web3: { account },
    },
  } = useSelector((state: AppState) => state);
  const [activeAssetTab, setActiveAssetTab] = useState<string>("all");

  useEffect(() => {
    setActiveAssetTab("all");
  }, [account]);

  // only show tabs for assets that exist.
  const tokensFound = tokensResult.length > 0;
  const collectiblesFound = collectiblesResult.length > 0;

  const assetsFilterOptions = [
    {
      label: "All Assets",
      value: "all",
      show: tokensFound && collectiblesFound,
    },
    {
      label: "Tokens",
      value: "tokens",
      show: tokensFound && collectiblesFound,
    },
    {
      label: "Collectibles",
      value: "collectibles",
      show: collectiblesFound && tokensFound,
    },
  ];

  // return empty state if account has no assets
  if (!tokensResult.length && !collectiblesResult.length) {
    return (
      <div>
        <div className="mt-14 mb-16">
          <TabsButton
            options={assetsFilterOptions}
            value="all"
            onChange={(val) => setActiveAssetTab(val)}
            activeAssetTab={activeAssetTab}
          />
          <AssetEmptyState activeAssetTab={activeAssetTab} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`${collectiblesFound && tokensFound ? "mt-14" : ""} mb-16`}
      >
        <TabsButton
          options={assetsFilterOptions}
          value="all"
          onChange={(val) => setActiveAssetTab(val)}
          activeAssetTab={activeAssetTab}
        />
        {activeAssetTab === "tokens" && (
          <TokenTable
            columns={tokenTableColumns}
            tableData={tokensResult}
            activeAssetTab={activeAssetTab}
          />
        )}

        {activeAssetTab === "collectibles" && (
          <div className="mt-16">
            <Collectibles activeAssetTab={activeAssetTab} />
          </div>
        )}

        {activeAssetTab === "all" && (
          <>
            <TokenTable
              columns={tokenTableColumns}
              tableData={tokensResult}
              activeAssetTab={activeAssetTab}
            />
            <div className="mt-16">
              <Collectibles activeAssetTab={activeAssetTab} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Assets;

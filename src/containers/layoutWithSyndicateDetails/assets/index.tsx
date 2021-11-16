import React, { useState, useEffect } from "react";
import TabsButton from "@/components/TabsButton";
import TokenTable from "@/containers/layoutWithSyndicateDetails/assets/TokenTable";
import Collectibles from "@/containers/layoutWithSyndicateDetails/assets/Collectibles";
import { tokenTableColumns } from "@/containers/layoutWithSyndicateDetails/assets/constants";
import AssetEmptyState from "@/containers/layoutWithSyndicateDetails/assets/AssetEmptyState";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Assets: React.FC = () => {
  const {
    assetsSliceReducer: { tokensResult, collectiblesResult },
    web3Reducer: {
      web3: { account },
    },
  } = useSelector((state: RootState) => state);
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
      show: true,
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
      <div className="mt-14 mb-16">
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

import React, { useState, useEffect } from "react";
import NetAssets from "@/containers/layoutWithSyndicateDetails/assets/NetAssets";
import TabsButton from "@/components/TabsButton";
import TokenTable from "@/containers/layoutWithSyndicateDetails/assets/TokenTable";
import Collectibles from "@/containers/layoutWithSyndicateDetails/assets/Collectibles";
import {
  assetsFilterOptions,
  tokenTableColumns,
} from "@/containers/layoutWithSyndicateDetails/assets/constants";
import AssetEmptyState from "@/containers/layoutWithSyndicateDetails/assets/AssetEmptyState";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  fetchTokenTransactions,
  fetchCollectiblesTransactions,
} from "@/state/assets/slice";

const Assets: React.FC = () => {
  const dispatch = useDispatch();
  const {
    assetsSliceReducer: { tokensResult, collectiblesResult },
    web3Reducer: {
      web3: { account },
    },
  } = useSelector((state: RootState) => state);
  const [activeAssetTab, setActiveAssetTab] = useState<string>("all");

  useEffect(() => {
    // fetch token transactions for the connected account.
    dispatch(fetchTokenTransactions(account));

    // test nft account: 0xf4c2c3e12b61d44e6b228c43987158ac510426fb
    dispatch(fetchCollectiblesTransactions(account));
    setActiveAssetTab("all");
  }, [account]);

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

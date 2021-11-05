import { FC } from "react";
import { SkeletonLoader } from "@/components/skeletonLoader";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import AssetEmptyState from "@/containers/layoutWithSyndicateDetails/assets/AssetEmptyState";

const Collectibles: FC<{ activeAssetTab: string }> = ({ activeAssetTab }) => {
  const {
    assetsSliceReducer: { loadingCollectibles, collectiblesResult },
  } = useSelector((state: RootState) => state);

  // loading state
  if (loadingCollectibles) {
    return (
      <div className="w-fit-content">
        <SkeletonLoader
          borderRadius="rounded-t-lg"
          width="80"
          height="80"
          customClass="border-r-1 border-l-1 border-t-1 border-gray-syn6"
          margin="m-0"
        />
        <div className="rounded-b-lg w-80 p-7 border-b-1 border-r-1 border-l-1 border-gray-syn6">
          <SkeletonLoader
            width="44"
            height="7"
            margin="m-0"
            borderRadius="rounded-lg"
          />
        </div>
      </div>
    );
  }

  // return empty state if on active tab and there are no collectibles
  if (
    activeAssetTab === "collectibles" &&
    !loadingCollectibles &&
    !collectiblesResult.length
  ) {
    return <AssetEmptyState activeAssetTab={activeAssetTab}/>;
  }

  return (
    <div>
      {collectiblesResult.length ? (
        <>
          <div className="flex items-center space-x-4 pb-8">
            <img src="/images/collectibles.svg" alt="Collectibles" />
            <div className="text-xl">Collectibles</div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 sm:grid-cols-2 gap-6">
            {collectiblesResult.map((collectible, index) => {
              const { image, name } = collectible;
              return (
                <div className="w-80" key={index}>
                  <div
                    style={{
                      backgroundColor: "#232529",
                      backgroundImage: `url('${image}')`,
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center center",
                    }}
                    className="border-r-1 border-l-1 border-t-1 border-gray-syn6 w-80 h-80 rounded-t-lg"
                  ></div>
                  <div className="text-xl rounded-b-lg w-80 p-7 border-b-1 border-r-1 border-l-1 border-gray-syn6">
                    {name}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Collectibles;

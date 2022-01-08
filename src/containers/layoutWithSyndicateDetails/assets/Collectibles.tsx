import { SkeletonLoader } from "@/components/skeletonLoader";
import AssetEmptyState from "@/containers/layoutWithSyndicateDetails/assets/AssetEmptyState";
import { AppState } from "@/state";
import { fetchCollectiblesTransactions } from "@/state/assets/slice";
import { FC, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";

const Collectibles: FC<{ activeAssetTab: string }> = ({ activeAssetTab }) => {
  const {
    assetsSliceReducer: {
      loadingCollectibles,
      collectiblesResult,
      allCollectiblesFetched,
    },
    erc20TokenSliceReducer: { erc20Token },
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const [pageOffSet, setPageOffSet] = useState<number>(20);

  const collectiblesTitle = (
    <div className="flex items-center space-x-4 pb-8">
      <img src="/images/collectibles.svg" alt="Collectibles" />
      <div className="text-xl">Collectibles</div>
    </div>
  );

  // loading state
  const collectibleLoader = (
    <>
      <div className="w-full">
        <SkeletonLoader
          borderRadius="rounded-t-lg"
          width="full"
          height="80"
          customClass="border-r-1 border-l-1 border-t-1 border-gray-syn6"
          margin="m-0"
        />
        <div className="rounded-b-lg w-full p-7 border-b-1 border-r-1 border-l-1 border-gray-syn6">
          <SkeletonLoader
            width="full"
            height="7"
            margin="m-0"
            borderRadius="rounded-lg"
          />
        </div>
      </div>
    </>
  );

  const loaderContent = (
    <div className={`${collectiblesResult.length > 0 && "pt-6"}`}>
      <div className="grid grid-cols-12 gap-5">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="col-span-5 md:col-span-3 xl:col-span-3">
            {collectibleLoader}
          </div>
        ))}
      </div>
    </div>
  );
  // return empty state if on active tab and there are no collectibles
  if (
    activeAssetTab === "collectibles" &&
    !loadingCollectibles &&
    !collectiblesResult.length
  ) {
    return <AssetEmptyState activeAssetTab={activeAssetTab} />;
  }

  // fetch more collectibles
  const fetchMoreCollectibles = () => {
    setPageOffSet(pageOffSet + 20);
    dispatch(
      fetchCollectiblesTransactions({
        account: erc20Token.owner,
        offset: pageOffSet.toString(),
      }),
    );
  };

  // initial loading state.
  if (loadingCollectibles && !collectiblesResult.length) {
    return (
      <>
        {collectiblesTitle}
        {loaderContent}
      </>
    );
  }

  console.log({ collectiblesResult });

  return (
    <div className="w-full">
      {collectiblesResult.length > 0 && (
        <div>
          {collectiblesTitle}
          <InfiniteScroll
            dataLength={collectiblesResult.length}
            next={fetchMoreCollectibles}
            hasMore={!allCollectiblesFetched}
            loader={loaderContent}
          >
            <div className="grid grid-cols-12 gap-5">
              {collectiblesResult.map((collectible, index) => {
                const { id, image, name, animation, permalink } = collectible;
                console.log({ animation, collectible });
                let media;
                if (image && !animation) {
                  media = (
                    <div
                      style={{
                        backgroundColor: "#232529",
                        backgroundImage: `url('${image}')`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center center",
                      }}
                      className="border-r-1 border-l-1 border-t-1 border-gray-syn6 h-80 rounded-t-lg"
                    ></div>
                  );
                } else if (animation) {
                  // animation could be a .mov or .mp4 video
                  const movAnimation = animation.match(/\.mov$/) != null;
                  const mp4Animation = animation.match(/\.mp4$/) != null;

                  // https://litwtf.mypinata.cloud/ipfs/QmVjgAD5gaNQ1cLpgKLeuXDPX8R1yeajtWUhM6nV7VAe6e/4.mp4
                  // details for the nft with id below are not returned correctly and hence does not render
                  const htmlAnimation =
                    animation.match(/\.html$/) != null && id == "3216";

                  // animation could be a gif
                  const animatedGif = animation.match(/\.gif$/) != null;
                  if (animatedGif) {
                    media = (
                      <div className="bg-gray-syn7 border-r-1 border-l-1 border-t-1 border-gray-syn6 h-80 rounded-t-lg overflow-hidden">
                        <img src={animation} alt="animated nft" />
                      </div>
                    );
                  } else if (movAnimation || mp4Animation || htmlAnimation) {
                    media = (
                      <div className="border-r-1 border-l-1 border-t-1 border-gray-syn6 h-80 rounded-t-lg bg-gray-syn7 overflow-hidden">
                        <video
                          controls
                          autoPlay
                          loop
                          muted
                          className="rounded-t-lg video-320"
                        >
                          {/* Specifying type as "video/mp4" works for both .mov and .mp4 files  */}
                          <source
                            src={
                              htmlAnimation
                                ? "https://litwtf.mypinata.cloud/ipfs/QmVjgAD5gaNQ1cLpgKLeuXDPX8R1yeajtWUhM6nV7VAe6e/4.mp4"
                                : animation
                            }
                            type="video/mp4"
                          ></source>
                        </video>
                      </div>
                    );
                  }
                }

                // nft should have a name at least
                if (name && media) {
                  return (
                    <a
                      className="col-span-5 md:col-span-4 xl:col-span-3"
                      key={index}
                      href={permalink ? permalink : ""}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {media}
                      <div className="flex items-center text-xl rounded-b-lg h-24 py-6 border-b-1 border-r-1 border-l-1 border-gray-syn6 break-words">
                        <span className="w-4/5 mx-8 line-clamp-2">{name}</span>
                      </div>
                    </a>
                  );
                }
              })}
            </div>
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};

export default Collectibles;

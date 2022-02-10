import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/state";
import Modal, { ModalStyle } from "@/components/modal";
import { CategoryPill } from "@/containers/layoutWithSyndicateDetails/activity/shared/CategoryPill";
import TokenDetail from "@/containers/layoutWithSyndicateDetails/assets/collectibles/shared/TokenDetail";
import { setShowCollectibleModal } from "@/state/assets/collectibles/slice";
import CollectibleMedia from "@/containers/layoutWithSyndicateDetails/assets/collectibles/shared/CollectibleMedia";

const CollectibleDetailsModal: React.FC = () => {
  const {
    setCollectibleDetailsSliceReducer: {
      showCollectibleModal,
      collectibleModalDetails,
      showFullScreen,
    },
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const { collectible, moreDetails, mediaType } = collectibleModalDetails;

  // description can sometimes be a html string
  const htmlRegex = new RegExp(/<\/?[a-z][\s\S]*>/i);
  let descriptionValue = collectible?.description;
  if (htmlRegex.test(collectible?.description)) {
    descriptionValue = (
      <div dangerouslySetInnerHTML={{ __html: collectible?.description }}></div>
    );
  }

  return (
    <>
      <Modal
        modalStyle={ModalStyle.DARK}
        show={showCollectibleModal}
        closeModal={() => {
          dispatch(setShowCollectibleModal(false));
        }}
        customWidth="w-564"
        customClassName="p-0"
        showCloseButton={false}
        outsideOnClick={!showFullScreen}
        showHeader={false}
        overflow="overflow-x-visible"
        overflowYScroll={false}
        isMaxHeightScreen={false}
      >
        <div>
          <div
            className={`flex rounded-t-2xl items-center flex-col relative py-10 px-5 bg-gray-syn7 last:rounded-b-2xl`}
          >
            <div className="mb-8">
              <CategoryPill category="COLLECTIBLE" readonly={true} />
            </div>
            <div className="relative items-center flex flex-col w-80 mb-6">
              <CollectibleMedia
                {...{
                  collectible,
                  mediaType,
                  showCollectibles: false,
                }}
              />
            </div>
            <span className={`line-clamp-2 text-lg md:text-xl break-words`}>
              {collectible?.name}
            </span>
          </div>

          <div className="flex flex-col p-10">
            {descriptionValue && (
              <div className="mb-10">
                <span>Description</span>
                <p className="mt-4 text-gray-syn4 break-words">
                  {descriptionValue}
                </p>
              </div>
            )}

            <div>
              <p>Details</p>
              {moreDetails &&
                Object.keys(moreDetails).map((key, index) => {
                  return (
                    <div key={index}>
                      <TokenDetail title={key} value={moreDetails[key]} />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CollectibleDetailsModal;

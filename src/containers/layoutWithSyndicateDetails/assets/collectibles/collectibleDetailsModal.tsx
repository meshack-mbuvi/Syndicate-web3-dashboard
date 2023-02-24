import Modal, { ModalStyle } from '@/components/modal';
import { CategoryPill } from '@/containers/layoutWithSyndicateDetails/activity/shared/CategoryPill';
import CollectibleMedia from '@/containers/layoutWithSyndicateDetails/assets/collectibles/shared/CollectibleMedia';
import TokenDetail from '@/containers/layoutWithSyndicateDetails/assets/collectibles/shared/TokenDetail';
import { TransactionCategory } from '@/state/erc20transactions/types';
import React from 'react';
import { CollectibleDetails } from '.';
import FullScreenOverlay from './shared/FullscreenOverlay';

const CollectibleDetailsModal: React.FC<{
  isOwner: boolean;

  selectedCollectibleDetails: CollectibleDetails;
  setDetailsOfSelectedCollectible: (details: CollectibleDetails) => void;
  overlayCollectibleId: string;
  setOverlayCollectibleId: (id: string) => void;
  showCollectibleModal: boolean;
  setShowCollectibleModal: (b: boolean) => void;
  showFullScreen: boolean;
  setShowFullScreen: (b: boolean) => void;
}> = ({
  isOwner,
  selectedCollectibleDetails,
  setDetailsOfSelectedCollectible,
  overlayCollectibleId,
  setOverlayCollectibleId,
  showCollectibleModal,
  setShowCollectibleModal,
  showFullScreen,
  setShowFullScreen
}) => {
  const { collectible, moreDetails, mediaType } = selectedCollectibleDetails;

  // description can sometimes be a html string
  const htmlRegex = new RegExp(/<\/?[a-z][\s\S]*>/i);
  const descriptionValue = htmlRegex.test(collectible?.description) ? (
    <div dangerouslySetInnerHTML={{ __html: collectible?.description }}></div>
  ) : (
    collectible?.description
  );

  const blankValue = <span className="text-gray-syn4">-</span>;

  return (
    <>
      <Modal
        modalStyle={ModalStyle.DARK}
        show={showCollectibleModal}
        closeModal={(): void => {
          setShowCollectibleModal(false);
        }}
        customWidth="w-full sm:w-564"
        customClassName="p-0"
        opacity={showFullScreen ? 'bg-opacity-100' : 'bg-opacity-60'}
        showCloseButton={false}
        outsideOnClick={!showFullScreen}
        showHeader={false}
        overflow="overflow-x-visible"
        overflowYScroll={false}
        isMaxHeightScreen={false}
      >
        <>
          {showCollectibleModal && (
            <>
              <div
                className={`flex h-full rounded-t-2xl items-center flex-col relative py-10 px-5 bg-gray-syn7 last:rounded-b-2xl`}
              >
                <div className="mb-8">
                  <CategoryPill
                    category={TransactionCategory.COLLECTIBLE}
                    readonly={true}
                    isOwner={isOwner}
                  />
                </div>
                <div className="relative items-center flex flex-col w-80 mb-6">
                  <CollectibleMedia
                    {...{
                      collectible,
                      mediaType,
                      showCollectibles: false,

                      setDetailsOfSelectedCollectible,
                      overlayCollectibleId,
                      setOverlayCollectibleId,
                      showCollectibleModal,
                      showFullScreen,
                      setShowFullScreen
                    }}
                  />
                </div>
                <span className={`line-clamp-2 text-lg md:text-xl break-words`}>
                  {collectible?.name ? collectible?.name : blankValue}
                </span>
              </div>

              <div className="flex flex-col p-10">
                <div className="mb-10">
                  <span>Description</span>
                  <p className="mt-4 text-gray-syn4 break-words">
                    {descriptionValue ? descriptionValue : blankValue}
                  </p>
                </div>

                <div>
                  <p>Details</p>
                  {moreDetails &&
                    Object.keys(moreDetails).map((key, index) => {
                      return (
                        <div key={index}>
                          <TokenDetail
                            title={key}
                            value={
                              moreDetails[
                                key as keyof CollectibleDetails['moreDetails']
                              ]
                            }
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          )}
        </>
      </Modal>
      {showFullScreen && collectible.id === overlayCollectibleId ? (
        <FullScreenOverlay
          showFullScreen={showFullScreen}
          videoNft={
            selectedCollectibleDetails.mediaType === 'videoNFT' ||
            selectedCollectibleDetails.mediaType === 'htmlNFT'
          }
        >
          <CollectibleMedia
            {...{
              selectedCollectibleDetails,
              setDetailsOfSelectedCollectible,
              collectible,
              mediaType,
              showCollectibles: false,

              overlayCollectibleId,
              setOverlayCollectibleId,
              showCollectibleModal,
              showFullScreen,
              setShowFullScreen
            }}
          />
        </FullScreenOverlay>
      ) : null}
    </>
  );
};

export default CollectibleDetailsModal;

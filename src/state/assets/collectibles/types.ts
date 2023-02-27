import { Collectible } from '@/containers/layoutWithSyndicateDetails/assets/collectibles';

export interface InitialState {
  overlayCollectibleDetails: {
    collectible: Collectible | null;
    mediaType: string | null;
  };
  showFullScreen: boolean;
  showCollectibleModal: boolean;
  collectibleModalDetails: {
    moreDetails?: { [x: string]: number | string };
    collectible?: Collectible;
    mediaType?: string;
  };
}

export const initialState: InitialState = {
  overlayCollectibleDetails: {
    collectible: null,
    mediaType: null
  },
  showFullScreen: false,
  showCollectibleModal: false,
  collectibleModalDetails: {}
};

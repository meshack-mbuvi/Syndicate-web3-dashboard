export interface InitialState {
  overlayCollectibleDetails: any;
  showFullScreen: boolean;
  showCollectibleModal: boolean;
  collectibleModalDetails: any;
}

export const initialState: InitialState = {
  overlayCollectibleDetails: {},
  showFullScreen: false,
  showCollectibleModal: false,
  collectibleModalDetails: {}
};

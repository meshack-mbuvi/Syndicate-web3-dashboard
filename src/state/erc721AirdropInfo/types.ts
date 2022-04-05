export interface IERC721AirdropInfo {
  id: string;
  token: string;
  treeIndex: string;
  endTime: number;
  startTime: number;
  root: string;
}

export const initialState = {
  erc721AirdropInfo: <IERC721AirdropInfo>{},
  loading: true
};

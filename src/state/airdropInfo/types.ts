export interface IAirdropInfo {
  id: string;
  club: string;
  treeIndex: string;
  endTime: number;
  startTime: number;
  root: string;
}

export const initialState = {
  airdropInfo: <IAirdropInfo>{},
  loading: true
};

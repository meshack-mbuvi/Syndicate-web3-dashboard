export interface connectedMember {
  depositAmount: string;
  loading: boolean;
}

export const initialState = {
  connectedMember: { depositAmount: '', loading: false }
};

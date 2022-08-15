type PayloadAction = {
  type: IndexReducerActionType.LAST | IndexReducerActionType.SHIFT;
  payload: number;
};

type InitOrIncrementAction = {
  type:
    | IndexReducerActionType.FIRST
    | IndexReducerActionType.INCREMENT
    | IndexReducerActionType.DECREMENT;
};

export enum IndexReducerActionType {
  FIRST,
  INCREMENT,
  DECREMENT,
  LAST,
  SHIFT
}

export interface IndexReducerState {
  index: number;
  shift: number;
}

export const indexReducer = (
  state: IndexReducerState,
  action: InitOrIncrementAction | PayloadAction
): IndexReducerState => {
  switch (action.type) {
    case IndexReducerActionType.FIRST:
      return { ...state, index: 0 };
    case IndexReducerActionType.INCREMENT:
      return { ...state, index: state.index + 1 };
    case IndexReducerActionType.DECREMENT:
      return { ...state, index: state.index - 1 };
    case IndexReducerActionType.LAST:
      return { ...state, index: action.payload };
    case IndexReducerActionType.SHIFT:
      return { ...state, shift: action.payload };
    default:
      return state;
  }
};

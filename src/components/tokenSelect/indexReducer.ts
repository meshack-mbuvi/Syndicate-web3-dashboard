type IndexReducerAction = {
  type: string;
  payload?: number;
};

interface IndexReducerState {
  index: number;
  shift: number;
}

export const indexReducer = (
  state: IndexReducerState,
  action: IndexReducerAction,
): IndexReducerState => {
  switch (action.type) {
    case "RESET":
      return { ...state, index: -1 };
    case "FIRST":
      return { ...state, index: 0 };
    case "INCREMENT":
      return { ...state, index: state.index + 1 };
    case "DECREMENT":
      return { ...state, index: state.index - 1 };
    case "INDEX":
      return { ...state, index: action.payload };
    case "SHIFT":
      return { ...state, shift: action.payload };
    default:
      return state;
  }
};

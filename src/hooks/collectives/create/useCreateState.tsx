// Read from create collective state
// ==============================================================

import { AppState } from '@/state';
import { useSelector } from 'react-redux';

const useCreateState = () => {
  const { createCollectiveSliceReducer } = useSelector(
    (state: AppState) => state
  );

  return createCollectiveSliceReducer;
};

export default useCreateState;

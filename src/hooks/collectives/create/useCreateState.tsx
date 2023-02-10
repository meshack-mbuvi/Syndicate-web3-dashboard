// Read from create collective state
// ==============================================================

import { AppState } from '@/state';
import { CollectiveCreation } from '@/state/createCollective/types';
import { useSelector } from 'react-redux';

const useCreateState = (): CollectiveCreation => {
  const { createCollectiveSliceReducer } = useSelector(
    (state: AppState) => state
  );

  return createCollectiveSliceReducer;
};

export default useCreateState;

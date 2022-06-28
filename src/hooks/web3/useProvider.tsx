import { AppState } from '@/state';
import { useSelector } from 'react-redux';

// This hook will include more provider options in the future.
export const useProvider = (): any => {
  const {
    web3Reducer: {
      web3: { providerName }
    }
  } = useSelector((state: AppState) => state);

  return { providerName };
};

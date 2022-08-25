import { AppState } from '@/state';
import { useSelector } from 'react-redux';

const useIsPolygon = (): {
  isPolygon: boolean;
} => {
  const {
    web3Reducer: {
      web3: {
        activeNetwork: { chainId }
      }
    }
  } = useSelector((state: AppState) => state);

  // Check to make sure collectives are not viewable on Polygon
  const isPolygon = chainId === 137;

  return { isPolygon };
};

export default useIsPolygon;

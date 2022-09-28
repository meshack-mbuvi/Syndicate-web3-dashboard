import { AppState } from '@/state';
import { useSelector } from 'react-redux';

const useFetchCollectiveFromContract = (): {
  getCollectiveFromContract: (string: any) => Promise<string>;
} => {
  const {
    initializeContractsReducer: {
      syndicateContracts: { erc721Collective }
    }
  } = useSelector((state: AppState) => state);

  const getCollectiveFromContract = async (collectiveAddress: any) => {
    const collective = await erc721Collective.name(collectiveAddress);
    return collective;
  };
  return { getCollectiveFromContract };
};

export default useFetchCollectiveFromContract;

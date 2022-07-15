import { AppState } from '@/state';
import { useSelector } from 'react-redux';

export const useCreateState = () => {
  const {
    createCollectiveSliceReducer: {
      name,
      symbol,
      artwork,
      artworkType,
      artworkUrl,
      description,
      pricePerNFT,
      maxPerWallet,
      invitation,
      openUntil,
      closeDate,
      closeAfterMaxSupply,
      maxSupply
    }
  } = useSelector((state: AppState) => state);

  return {
    name,
    symbol,
    artwork,
    artworkType,
    artworkUrl,
    description,
    pricePerNFT,
    maxPerWallet,
    invitation,
    openUntil,
    closeDate,
    closeAfterMaxSupply,
    maxSupply
  };
};

export const useCreateCollective = () => {
  return;
};

export const useSumbitIPFSData = () => {};

export const useSubmitToContract = () => {};

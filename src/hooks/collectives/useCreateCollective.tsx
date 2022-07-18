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
      membershipType,
      timeWindow,
      openUntil,
      closeDate,
      closeTime,
      closeAfterMaxSupply,
      maxSupply,
      transferrable,
      tokenDetails
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
    membershipType,
    timeWindow,
    openUntil,
    closeDate,
    closeTime,
    closeAfterMaxSupply,
    maxSupply,
    transferrable,
    tokenDetails
  };
};

export const useCreateCollective = () => {
  return;
};

export const useSumbitIPFSData = () => {};

export const useSubmitToContract = () => {};

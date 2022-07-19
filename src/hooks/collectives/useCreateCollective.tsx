import { AppState } from '@/state';
import { useDispatch, useSelector } from 'react-redux';
import { NFTMediaType } from '@/components/collectives/nftPreviewer';
import { OpenUntil } from '@/components/collectives/create/inputs/openUntil/radio';
import { TimeWindow } from '@/components/collectives/create/inputs/timeWindow';
import { acronymGenerator } from '@/utils/acronymGenerator';
import { useDebounce } from '@/hooks/useDebounce';
import {
  setCollectiveName,
  setCollectiveSymbol,
  setCollectiveArtwork,
  setCollectiveDescription,
  setCollectivePricePerNFT,
  setCollectiveMaxPerWallet,
  setCollectiveOpenUntil,
  setCollectiveTimeWindow,
  setCollectiveCloseDate,
  setCollectiveCloseTime,
  setCollectiveMaxSupply,
  setCollectiveTransferrable,
  setColectiveTokenDetails
} from '@/state/createCollective/slice';
import { useState, useEffect } from 'react';

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

export const useUpdateState = () => {
  const {
    createCollectiveSliceReducer: { name, artwork, artworkUrl }
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();

  const [ContinueButtonActive, setContinueButtonActive] = useState(false);
  const [submitButtonActive, setSubmiteButtonActive] = useState(false);
  const [progressPercent, setProgressPercent] = useState(artworkUrl ? 100 : 0);
  const [fileName, setFileName] = useState(artwork.name);

  const getArtworkType = (fileObject) => {
    let mediaType: NFTMediaType = NFTMediaType.IMAGE;
    let mediaSource = '';
    if (fileObject?.type) {
      mediaSource = URL.createObjectURL(fileObject);
      if (fileObject.type.match(/video/) != null) {
        mediaType = NFTMediaType.VIDEO;
      } else if (fileObject.type.match(/image/) != null) {
        mediaType = NFTMediaType.IMAGE;
      }
    }
    return { mediaType, mediaSource };
  };

  const debouncedSymbol = useDebounce(name, 500);

  useEffect(() => {
    if (debouncedSymbol) {
      dispatch(setCollectiveSymbol(acronymGenerator(debouncedSymbol)));
    }
  }, [debouncedSymbol]);

  const handleNameChange = (input: string) => {
    dispatch(setCollectiveName(input));
  };

  const handleTokenSymbolChange = (input: string) => {
    dispatch(setCollectiveSymbol(input));
  };

  const handleDescriptionChange = (input: string) => {
    dispatch(setCollectiveDescription(input));
  };

  const handleFileUpload = async (e) => {
    await dispatch(
      setCollectiveArtwork({
        artwork: {},
        artworkType: NFTMediaType.IMAGE,
        artworkUrl: ''
      })
    );
    const { mediaType, mediaSource } = getArtworkType(e.target.files[0]);
    dispatch(
      setCollectiveArtwork({
        artwork: e.target.files[0],
        artworkType: mediaType,
        artworkUrl: mediaSource
      })
    );
    setFileName(e.target.files[0].name);
    setProgressPercent(100);
  };

  const handleCancelUpload = () => {
    dispatch(
      setCollectiveArtwork({
        artwork: {},
        artworkType: NFTMediaType.IMAGE,
        artworkUrl: ''
      })
    );
    setProgressPercent(0);
    setFileName('');
  };

  const handleTimeWindowChange = (timeWindow: TimeWindow) => {
    dispatch(setCollectiveTimeWindow(timeWindow));
  };
  // const handleMaxMembersChange = (maxMembers: MembershipType) => {
  //   dispatch(setCollectiveMembershipType(maxMembers));
  // };
  const handlePriceToJoinChange = (priceToJoin: number) => {
    dispatch(setCollectivePricePerNFT(priceToJoin));
  };
  const handleMaxPerWalletChange = (maxPerWallet: number) => {
    dispatch(setCollectiveMaxPerWallet(maxPerWallet));
  };
  const handleMaxSupplyChange = (maxSupply: number) => {
    dispatch(setCollectiveMaxSupply(maxSupply));
  };
  const handleClickToChangeToken = () => {
    dispatch(setColectiveTokenDetails({}));
  };
  const handleTokenDetailsChange = (tokenDetails: any) => {
    dispatch(setColectiveTokenDetails(tokenDetails));
  };
  const handleOpenUntilChange = (openUntil: OpenUntil) => {
    dispatch(setCollectiveOpenUntil(openUntil));
  };
  const handleCloseDateChange = (closeDate: Date) => {
    dispatch(setCollectiveCloseDate(closeDate));
  };
  const handleCloseTimeChange = (closeTime: string) => {
    dispatch(setCollectiveCloseTime(closeTime));
  };
  const handleChangeAllowOwnershipTransfer = (
    allowOwnershipTransfer: boolean
  ) => {
    dispatch(setCollectiveTransferrable(allowOwnershipTransfer));
  };

  const handleSubmit = () => {};

  return {
    handleNameChange,
    handleTokenSymbolChange,
    handleDescriptionChange,
    handleCancelUpload,
    handleFileUpload,
    setContinueButtonActive,
    ContinueButtonActive,
    progressPercent,
    fileName,
    handleTimeWindowChange,
    handlePriceToJoinChange,
    handleMaxPerWalletChange,
    handleMaxSupplyChange,
    handleClickToChangeToken,
    handleTokenDetailsChange,
    handleOpenUntilChange,
    handleCloseDateChange,
    handleCloseTimeChange,
    handleChangeAllowOwnershipTransfer,
    submitButtonActive,
    setSubmiteButtonActive,
    handleSubmit
  };
};

export const useCreateCollective = () => {
  return;
};

export const useSumbitIPFSData = () => {};

export const useSubmitToContract = () => {};

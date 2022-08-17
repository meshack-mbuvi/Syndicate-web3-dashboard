// Update create collective state
// ==============================================================

import useCreateState from './useCreateState';
import { useDispatch } from 'react-redux';
import { NFTMediaType } from '@/components/collectives/nftPreviewer';
import { useState, useEffect } from 'react';
import { acronymGenerator } from '@/utils/acronymGenerator';
import { useDebounce } from '@/hooks/useDebounce';
import { TimeWindow } from '@/components/collectives/create/inputs/timeWindow';
import { OpenUntil } from '@/components/collectives/create/inputs/openUntil/radio';
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
  setColectiveTokenDetails,
  setIpfsHash
} from '@/state/createCollective/slice';

const useUpdateState = () => {
  const dispatch = useDispatch();
  const { name, artwork, artworkUrl } = useCreateState();

  const [ContinueButtonActive, setContinueButtonActive] = useState(false);
  const [submitButtonActive, setSubmitButtonActive] = useState(false);
  const [progressPercent, setProgressPercent] = useState(artworkUrl ? 100 : 0);
  const [fileName, setFileName] = useState(artwork?.name);
  const [hasAgreedToTerms, setAgreedToTerms] = useState(false);
  const [exceededUploadLimit, setExceededUploadLimit] = useState('');

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

  // State update handlers
  // ==============================================================

  const handleNameChange = (input: string) => {
    dispatch(setIpfsHash(''));
    dispatch(setCollectiveName(input));
  };

  const handleTokenSymbolChange = (input: string) => {
    dispatch(setIpfsHash(''));
    dispatch(setCollectiveSymbol(input));
  };

  const handleDescriptionChange = (input: string) => {
    dispatch(setIpfsHash(''));
    dispatch(setCollectiveDescription(input));
  };

  const handleCreateGeneratedArtwork = async (backgroundColorClass: string) => {
    dispatch(
      setCollectiveArtwork({
        artwork: {
          backgroundColorClass: backgroundColorClass
        },
        artworkType: NFTMediaType.CUSTOM,
        artworkUrl: ''
      })
    );
  };

  const handleCaptureGeneratedArtwork = (
    imageURI: string,
    backgroundColorClass: string
  ) => {
    dispatch(
      setCollectiveArtwork({
        artwork: {
          backgroundColorClass: backgroundColorClass
        },
        artworkType: NFTMediaType.CUSTOM,
        artworkUrl: imageURI
      })
    );
  };

  const handleFileUpload = async (e) => {
    dispatch(setIpfsHash(''));
    const fileLimit = 50;
    const fileObject = e.target.files[0];

    await dispatch(
      setCollectiveArtwork({
        artwork: {},
        artworkType: NFTMediaType.IMAGE,
        artworkUrl: ''
      })
    );
    if (e.target.files.length) {
      const { mediaType, mediaSource } = getArtworkType(fileObject);
      dispatch(
        setCollectiveArtwork({
          artwork: fileObject,
          artworkType: mediaType,
          artworkUrl: mediaSource
        })
      );
      setFileName(fileObject.name);
      setExceededUploadLimit(
        fileObject.size / 1024 / 1024 > fileLimit
          ? 'File exceeds size limit of ' + fileLimit + ' MB'
          : ''
      );
      setProgressPercent(100);
    }
  };

  const handleCancelUpload = () => {
    dispatch(setIpfsHash(''));
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
    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes()}`;
    if (timeWindow === TimeWindow.DAY) {
      handleCloseDateChange(new Date(now.getTime() + 60 * 60 * 24 * 1000));
    }
    if (timeWindow === TimeWindow.WEEK) {
      handleCloseDateChange(new Date(now.getTime() + 60 * 60 * 24 * 7 * 1000));
    }
    if (timeWindow === TimeWindow.MONTH) {
      handleCloseDateChange(new Date(now.getTime() + 60 * 60 * 24 * 30 * 1000));
    }
    if (timeWindow === TimeWindow.CUSTOM) {
      handleCloseTimeChange('23:59');
    } else {
      handleCloseTimeChange(time);
    }
  };
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
    return;
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
    dispatch(setCollectiveCloseTime(closeTime || '00:00'));
  };
  const handleChangeAllowOwnershipTransfer = (
    allowOwnershipTransfer: boolean
  ) => {
    dispatch(setCollectiveTransferrable(allowOwnershipTransfer));
  };

  return {
    handleNameChange,
    handleTokenSymbolChange,
    handleDescriptionChange,
    handleCancelUpload,
    handleFileUpload,
    handleCreateGeneratedArtwork,
    handleCaptureGeneratedArtwork,
    setContinueButtonActive,
    ContinueButtonActive,
    progressPercent,
    fileName,
    exceededUploadLimit,
    hasAgreedToTerms,
    setAgreedToTerms,
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
    setSubmitButtonActive
  };
};

export default useUpdateState;

// Update create collective state
// ==============================================================

import { NFTMediaType } from '@/components/collectives/nftPreviewer';
import { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import useCreateState from './useCreateState';
// import { acronymGenerator } from '@/utils/acronymGenerator';
// import { useDebounce } from '@/hooks/useDebounce';
import { amplitudeLogger, Flow } from '@/components/amplitude';
import { ARTWORK_UPLOAD } from '@/components/amplitude/eventNames';
import { OpenUntil } from '@/components/collectives/create/inputs/openUntil/radio';
import { TimeWindow } from '@/components/collectives/create/inputs/timeWindow';
import {
  setColectiveTokenDetails,
  setCollectiveArtwork,
  setCollectiveCloseDate,
  setCollectiveCloseTime,
  setCollectiveDescription,
  setCollectiveMaxPerWallet,
  setCollectiveMaxSupply,
  setCollectiveName,
  setCollectiveOpenUntil,
  setCollectivePricePerNFT,
  setCollectiveSymbol,
  setCollectiveTimeWindow,
  setCollectiveTransferrable,
  setIpfsHash
} from '@/state/createCollective/slice';

const useUpdateState = () => {
  const dispatch = useDispatch();

  const { artwork, artworkUrl } = useCreateState();

  const [ContinueButtonActive, setContinueButtonActive] = useState(false);
  const [submitButtonActive, setSubmitButtonActive] = useState(false);
  const [progressPercent, setProgressPercent] = useState(artworkUrl ? 100 : 0);
  const [fileName, setFileName] = useState(artwork?.name || '');
  const [hasAgreedToTerms, setAgreedToTerms] = useState(false);
  const [exceededUploadLimit, setExceededUploadLimit] = useState('');

  const getArtworkType = (
    fileObject: File
  ): {
    mediaType: NFTMediaType;
    mediaSource: string;
  } => {
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

  // TODO: Fix acronymGenerator to not overwrite user input symbol

  // const debouncedSymbol = useDebounce(name, 500);
  // useEffect(() => {
  //   if (debouncedSymbol && ) {
  //     dispatch(setCollectiveSymbol(acronymGenerator(debouncedSymbol)));
  //   }
  // }, [debouncedSymbol]);

  // State update handlers
  // ==============================================================

  const handleNameChange = (input: string): void => {
    dispatch(setIpfsHash(''));
    dispatch(setCollectiveName(input));
  };

  const handleTokenSymbolChange = (input: string): void => {
    dispatch(setIpfsHash(''));
    dispatch(setCollectiveSymbol(input));
  };

  const handleDescriptionChange = (input: string): void => {
    dispatch(setIpfsHash(''));
    dispatch(setCollectiveDescription(input));
  };

  const handleCreateGeneratedArtwork = async (
    backgroundColorClass: string
  ): Promise<void> => {
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
  ): void => {
    dispatch(
      setCollectiveArtwork({
        artwork: {
          backgroundColorClass
        },
        artworkType: NFTMediaType.CUSTOM,
        artworkUrl: imageURI
      })
    );
  };

  const handleFileUpload = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    dispatch(setIpfsHash(''));
    const fileLimit = 50;
    const fileObject = e.target?.files?.[0];

    await dispatch(
      setCollectiveArtwork({
        artwork: {},
        artworkType: NFTMediaType.IMAGE,
        artworkUrl: ''
      })
    );
    if (e.target.files?.length && fileObject) {
      const { mediaType, mediaSource } = getArtworkType(fileObject);
      dispatch(
        setCollectiveArtwork({
          artwork: fileObject,
          artworkType: mediaType,
          artworkUrl: mediaSource
        })
      );
      setFileName(fileObject?.name);
      setExceededUploadLimit(
        fileObject.size / 1024 / 1024 > fileLimit
          ? 'File exceeds size limit of ' + fileLimit + ' MB'
          : ''
      );
      setProgressPercent(100);
    }

    void amplitudeLogger(ARTWORK_UPLOAD, {
      flow: Flow.COLLECTIVE_CREATE,
      file_type: fileObject?.type,
      file_size: fileObject?.size + ' MB'
    });
  };

  const handleCancelUpload = (): void => {
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

  const handleTimeWindowChange = (timeWindow: TimeWindow): void => {
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
  const handlePriceToJoinChange = (priceToJoin: number): void => {
    dispatch(setCollectivePricePerNFT(priceToJoin));
  };
  const handleMaxPerWalletChange = (maxPerWallet: number): void => {
    dispatch(setCollectiveMaxPerWallet(maxPerWallet));
  };
  const handleMaxSupplyChange = (maxSupply: number): void => {
    dispatch(setCollectiveMaxSupply(maxSupply));
  };
  const handleClickToChangeToken = (): void => {
    return;
  };
  const handleTokenDetailsChange = (tokenDetails: {
    symbol: string;
    icon: string;
  }): void => {
    dispatch(setColectiveTokenDetails(tokenDetails));
  };
  const handleOpenUntilChange = (openUntil: OpenUntil): void => {
    dispatch(setCollectiveOpenUntil(openUntil));
  };
  const handleCloseDateChange = (closeDate: Date): void => {
    dispatch(setCollectiveCloseDate(closeDate));
  };
  const handleCloseTimeChange = (closeTime: string): void => {
    dispatch(setCollectiveCloseTime(closeTime || '00:00'));
  };
  const handleChangeAllowOwnershipTransfer = (
    allowOwnershipTransfer: boolean
  ): void => {
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
    setSubmitButtonActive,
    getArtworkType
  };
};

export default useUpdateState;

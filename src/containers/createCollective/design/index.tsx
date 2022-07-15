import React, { FC, useState, useEffect } from 'react';
import { CollectiveFormDesign } from '@/components/collectives/create/design';
import { CreateCollectiveTitle, createHeader } from '../shared';
import {
  NFTPreviewer,
  NFTMediaType
} from '@/components/collectives/nftPreviewer';
import { useCreateState } from '@/hooks/collectives/useCreateCollective';
import {
  setCollectiveName,
  setCollectiveSymbol,
  setCollectiveArtwork,
  setCollectiveDescription
} from '@/state/createCollective/slice';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { acronymGenerator } from '@/utils/acronymGenerator';
import { useDebounce } from '@/hooks/useDebounce';

interface Props {
  handleNext: (e) => void;
}

const CreateCollectiveDesign: FC<Props> = ({ handleNext }) => {
  const dispatch = useDispatch();
  const { name, symbol, artwork, artworkUrl, description } = useCreateState();

  const [uploadSuccessText, setUploadSuccessText] = useState('');
  const [ContinueButtonActive, setContinueButtonActive] = useState(false);
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

  useEffect(() => {
    if (name && artworkUrl && description && symbol) {
      setContinueButtonActive(true);
      return;
    }
    setContinueButtonActive(false);
  }, [name, symbol, artworkUrl, description]);

  return (
    <div>
      <CreateCollectiveTitle screen={createHeader.DESIGN} />
      <CollectiveFormDesign
        nameValue={name}
        handleNameChange={handleNameChange}
        tokenSymbolValue={symbol}
        handleTokenSymbolChange={handleTokenSymbolChange}
        descriptionValue={description}
        handleDescriptionChange={handleDescriptionChange}
        isContinueButtonActive={ContinueButtonActive}
        handleContinue={handleNext}
        handleUpload={handleFileUpload}
        uploadSuccessText={uploadSuccessText}
        handleCancelUpload={handleCancelUpload}
        progressPercentage={progressPercent}
        fileName={fileName}
        acceptFileTypes={'.png, .gif, .mp4'}
      />
    </div>
  );
};

export default CreateCollectiveDesign;

export const DesignRightPanel: React.FC = () => {
  const { artworkType, artworkUrl, name, description, symbol } =
    useCreateState();

  return (
    <div className=" w-full flex justify-center">
      <NFTPreviewer
        description={description}
        loading={{
          description: description === '',
          name: name === ''
        }}
        mediaSource={artworkUrl}
        mediaType={artworkType}
        name={name}
        symbol={'✺' + symbol}
        customClasses={'w-full'}
      />
    </div>
  );
};

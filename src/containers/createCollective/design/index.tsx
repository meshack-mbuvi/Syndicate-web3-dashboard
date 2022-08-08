import React, { FC, useState, useEffect } from 'react';
import { CollectiveFormDesign } from '@/components/collectives/create/design';
import { CreateCollectiveTitle, createHeader } from '../shared';
import { NFTPreviewer } from '@/components/collectives/nftPreviewer';
import {
  useCreateState,
  useUpdateState
} from '@/hooks/collectives/useCreateCollective';

interface Props {
  handleNext: (e) => void;
}

const CreateCollectiveDesign: FC<Props> = ({ handleNext }) => {
  const { name, symbol, artworkUrl, description } = useCreateState();
  const {
    handleNameChange,
    handleTokenSymbolChange,
    handleDescriptionChange,
    handleCancelUpload,
    handleFileUpload,
    setContinueButtonActive,
    ContinueButtonActive,
    progressPercent,
    fileName,
    exceededUploadLimit
  } = useUpdateState();

  const [uploadSuccessText, setUploadSuccessText] = useState('');

  useEffect(() => {
    if (name && artworkUrl && description && symbol && !exceededUploadLimit) {
      setContinueButtonActive(true);
      return;
    }
    setContinueButtonActive(false);
  }, [name, symbol, artworkUrl, description, exceededUploadLimit]);

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
        uploadErrorText={exceededUploadLimit}
        handleCancelUpload={handleCancelUpload}
        progressPercentage={progressPercent}
        fileName={fileName}
        acceptFileTypes={'.png, .jpg, .jpeg, .gif, .mp4'}
      />
    </div>
  );
};

export default CreateCollectiveDesign;

export const DesignRightPanel: React.FC = () => {
  const { artworkType, artworkUrl, name, description, symbol } =
    useCreateState();

  return (
    <NFTPreviewer
      description={description}
      loading={{
        description: description === '',
        name: name === '',
        artwork: artworkUrl === ''
      }}
      mediaSource={artworkUrl}
      mediaType={artworkType}
      name={name}
      symbol={'✺' + symbol}
      customClasses={'w-full'}
    />
  );
};

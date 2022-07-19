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
    fileName
  } = useUpdateState();

  const [uploadSuccessText, setUploadSuccessText] = useState('');

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

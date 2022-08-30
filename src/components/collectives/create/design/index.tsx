import { TextArea } from '@/components/inputs/simpleTextArea';
import { Spinner } from '@/components/shared/spinner';
import { DesignRightPanel } from '@/containers/createCollective/design';
import { elementToImage } from '@/utils/elementToImage';
import React, { useState } from 'react';
import { CollectivesGeneratedArtwork } from '../../generatedArtwork';
import { CollectivesFileUploader } from '../../uploader';
import { InputFieldsNameAndSymbol } from '../inputs/nameAndSymbol';

interface Props {
  nameValue: string;
  handleNameChange: (input: string) => void;
  tokenSymbolValue: string;
  handleTokenSymbolChange: (input: string) => void;
  descriptionValue: string;
  handleDescriptionChange: (input: string) => void;
  isContinueButtonActive: boolean;
  handleContinue: (e) => void;
  handleUpload: (e) => void;
  uploadSuccessText?: string;
  uploadErrorText?: string;
  handleCancelUpload: () => void;
  progressPercentage?: number;
  fileName?: string;
  acceptFileTypes?: string;
  isUsingGeneratedArtwork?: boolean;
  generatedArtworkBackgroundColor?: string;
  handleCreateGeneratedArtwork?: (backgroundColorClass: string) => void;
  handleCaptureGeneratedArtwork?: (
    imageURI: string,
    backgroundColorClass: string
  ) => void;
  captureArtworkRef;
}

export const CollectiveFormDesign: React.FC<Props> = ({
  nameValue,
  handleNameChange,
  tokenSymbolValue,
  handleTokenSymbolChange,
  descriptionValue,
  handleDescriptionChange,
  isContinueButtonActive,
  handleContinue,
  handleUpload,
  uploadSuccessText,
  uploadErrorText,
  handleCancelUpload,
  progressPercentage = 0,
  fileName = 'FILENAME',
  acceptFileTypes,
  isUsingGeneratedArtwork,
  generatedArtworkBackgroundColor,
  handleCreateGeneratedArtwork,
  handleCaptureGeneratedArtwork,
  captureArtworkRef
}) => {
  const [isContinueButtonLoading, setIsContinueButtonLoading] = useState(false);
  const handleContinueButton = (e) => {
    if (isUsingGeneratedArtwork) {
      setIsContinueButtonLoading(true);
      elementToImage(captureArtworkRef, 2, (imageURI) => {
        handleCaptureGeneratedArtwork(
          imageURI,
          generatedArtworkBackgroundColor
        );
        setIsContinueButtonLoading(false);
        handleContinue(e);
      });
    } else {
      handleContinue(e);
    }
  };

  return (
    <>
      {isUsingGeneratedArtwork && (
        <div className="fixed h-355 w-355 opacity-0 pointer-events-none">
          <CollectivesGeneratedArtwork
            captureRef={captureArtworkRef}
            label={nameValue}
            backgroundColorClass={generatedArtworkBackgroundColor}
            customId="particles-js-0"
          />
        </div>
      )}
      <div className="max-w-730 w-full">
        <div className="space-y-8">
          <div className="space-y-8">
            <InputFieldsNameAndSymbol
              nameValue={nameValue}
              handleNameChange={handleNameChange}
              tokenSymbolValue={tokenSymbolValue}
              handleTokenSymbolChange={handleTokenSymbolChange}
            />
            <div>
              <CollectivesFileUploader
                progressPercent={progressPercentage}
                fileName={fileName}
                successText={uploadSuccessText}
                handleUpload={handleUpload}
                handleCancelUpload={handleCancelUpload}
                accept={acceptFileTypes}
                isUsingGeneratedArtwork={isUsingGeneratedArtwork}
                handleCreateGenerateArtwork={handleCreateGeneratedArtwork}
                errorText={uploadErrorText}
              />
              <div className="text-sm text-gray-syn4 mt-2">
                This file will live in IPFS and Pinata, and the metadata will
                always be in your control.
              </div>
            </div>
          </div>

          <div>
            <div className="mb-2">Description</div>
            <TextArea
              value={descriptionValue}
              handleValueChange={handleDescriptionChange}
              placeholderLabel="Description about your collective’s NFT that will be visible everywhere"
              widthClass="w-full"
              heightRows={5}
            />
          </div>
        </div>
        <div className="md:hidden mt-8 mb-10">
          <div className="flex justify-center md:justify-start w-full flex-grow">
            <DesignRightPanel customId={'design-left-panel'} />
          </div>
        </div>
        <div className="md:mt-10 pb-20">
          <button
            className={`${
              isContinueButtonActive ? 'primary-CTA' : 'primary-CTA-disabled'
            } w-full`}
            onClick={isContinueButtonActive ? handleContinueButton : null}
          >
            {isContinueButtonLoading ? (
              <Spinner
                margin="my-0"
                color="text-gray-syn4"
                height="h-6"
                width="w-6"
              />
            ) : (
              'Continue'
            )}
          </button>
          <div className="mt-2 text-sm text-gray-syn4">
            All fields (except token symbol) are modifiable later via an
            on-chain transaction with gas.
          </div>
        </div>
      </div>
    </>
  );
};

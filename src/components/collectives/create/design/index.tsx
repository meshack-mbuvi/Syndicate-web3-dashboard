import { CTAButton, CTAType } from '@/components/CTAButton';
import { TextArea } from '@/components/inputs/simpleTextArea';
import { Spinner } from '@/components/shared/spinner';
import { DesignRightPanel } from '@/containers/createCollective/design';
import { elementToImage } from '@/utils/elementToImage';
import React, { MutableRefObject, useState } from 'react';
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
  handleContinue: (e: any) => void;
  handleUpload: (e: any) => void;
  uploadSuccessText?: string;
  uploadErrorText?: string;
  handleCancelUpload: () => void;
  progressPercentage?: number;
  fileName?: string;
  acceptFileTypes?: string;
  isUsingGeneratedArtwork?: boolean;
  generatedArtworkBackgroundColor: string;
  handleCreateGeneratedArtwork?: (backgroundColorClass: string) => void;
  handleCaptureGeneratedArtwork: (
    imageURI: string,
    backgroundColorClass: string
  ) => void;
  hideParticlesEngine?: boolean;
  captureArtworkRef: MutableRefObject<HTMLButtonElement> | null;
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
  hideParticlesEngine = false,
  captureArtworkRef
}) => {
  const [isContinueButtonLoading, setIsContinueButtonLoading] = useState(false);
  const handleContinueButton = async (e: any): Promise<void> => {
    if (isUsingGeneratedArtwork && captureArtworkRef) {
      setIsContinueButtonLoading(true);
      try {
        const imageString = await elementToImage(captureArtworkRef, 2);
        handleCaptureGeneratedArtwork(
          imageString,
          generatedArtworkBackgroundColor
        );
        setIsContinueButtonLoading(false);
        handleContinue(e);
      } catch (error) {
        // add error handling
        console.error(error);
      }
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
            hideParticles={hideParticlesEngine}
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
                // @ts-expect-error TS(2345): Type ((backgroundColorClass: string) => void) | undefined is not assig... Remove this comment to see the full error message
                handleCreateGenerateArtwork={handleCreateGeneratedArtwork}
                errorText={uploadErrorText}
              />
              <div className="text-sm text-gray-syn4 mt-2">
                This file will live in IPFS and Pinata, and the metadata will
                always be in your control.
              </div>
            </div>

            <div className="md:hidden mt-8 mb-10">
              <div className="flex justify-center md:justify-start w-full flex-grow">
                <DesignRightPanel customId={'particles-js-5'} />
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

        <div className="mt-8 md:mt-10 pb-20">
          <CTAButton
            type={isContinueButtonActive ? CTAType.PRIMARY : CTAType.DISABLED}
            fullWidth={true}
            onClick={(e): void => {
              if (isContinueButtonActive) handleContinueButton(e);
            }}
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
          </CTAButton>
          <div className="mt-2 text-sm text-gray-syn4">
            All fields (except token name and symbol) are modifiable later via
            an on-chain transaction with gas.
          </div>
        </div>
      </div>
    </>
  );
};

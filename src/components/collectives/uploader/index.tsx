import { PillButton } from '@/components/pillButtons';
import { FileUploader } from '@/components/uploaders/fileUploader';
import React from 'react';
import { GeneratedArtworkDarkBGColors } from '../generatedArtwork';

export enum UploaderProgressType {
  LOADING_BAR = 'LOADING_BAR',
  SPINNER = 'SPINNER'
}

interface Props {
  progressPercent: number;
  fileName: string;
  successText?: string;
  errorText?: string;
  handleUpload: (e) => void;
  handleCancelUpload: () => void;
  isUsingGeneratedArtwork?: boolean;
  handleCreateGenerateArtwork: (backgroundColorClass: string) => void;
  accept?: string;
}

export const CollectivesFileUploader: React.FC<Props> = ({
  progressPercent,
  fileName,
  successText,
  errorText,
  handleUpload,
  handleCancelUpload,
  isUsingGeneratedArtwork,
  handleCreateGenerateArtwork,
  accept = '*'
}) => {
  return (
    <FileUploader
      progressPercent={isUsingGeneratedArtwork ? 0 : progressPercent}
      fileName={isUsingGeneratedArtwork ? 'Generated artwork' : fileName}
      successText={successText}
      promptTitle="Upload artwork"
      promptSubtitle="PNG, JPG, or GIF allowed"
      progressDisplayType={UploaderProgressType.SPINNER}
      handleUpload={handleUpload}
      handleCancelUpload={() => {
        handleCancelUpload();
      }}
      errorText={errorText}
      accept={accept}
      heightClass="h-45.45"
      addOn={
        <PillButton
          onClick={() => {
            handleCreateGenerateArtwork(
              GeneratedArtworkDarkBGColors[
                Math.floor(
                  Math.random() * (GeneratedArtworkDarkBGColors.length - 1)
                ) + 1
              ]
            );
          }}
        >
          {isUsingGeneratedArtwork ? (
            <div className="flex space-x-2 items-center">
              <img
                src="/images/collectives/wand.svg"
                alt="Regenerate art"
                className="-ml-1"
              />
              <div>Regenerate</div>
            </div>
          ) : (
            <div className="flex space-x-2 items-center">
              <img
                src="/images/collectives/wand.svg"
                alt="Generate art"
                className="-ml-1"
              />
              <div>Generate for me</div>
            </div>
          )}
        </PillButton>
      }
    />
  );
};

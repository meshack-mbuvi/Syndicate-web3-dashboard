import { TextArea } from '@/components/inputs/simpleTextArea';
import {
  FileUploader,
  UploaderProgressType
} from '@/components/uploaders/fileUploader';
import React from 'react';
import { InputFieldsNameAndSymbol } from '../inputs/nameAndSymbol';

interface Props {
  nameValue: string;
  handleNameChange: (input: string) => void;
  tokenSymbolValue: string;
  handleTokenSymbolChange: (input: string) => void;
  descriptionValue: string;
  handleDescriptionChange: (input: string) => void;
  isContinueButtonActive: boolean;
  handleUpload: (e) => void;
  handleCancelUpload: () => void;
}

export const CollectiveFormDesign: React.FC<Props> = ({
  nameValue,
  handleNameChange,
  tokenSymbolValue,
  handleTokenSymbolChange,
  descriptionValue,
  handleDescriptionChange,
  isContinueButtonActive,
  handleUpload,
  handleCancelUpload
}) => {
  return (
    <>
      <div className="space-y-8">
        <div className="space-y-8">
          <InputFieldsNameAndSymbol
            nameValue={nameValue}
            handleNameChange={handleNameChange}
            tokenSymbolValue={tokenSymbolValue}
            handleTokenSymbolChange={handleTokenSymbolChange}
          />
          <div>
            <FileUploader
              progressPercent={0}
              fileName="FILENAME"
              successText="SUCCESS TEXT"
              promptTitle="Upload artwork"
              promptSubtitle="PNG or MP4 allowed"
              progressDisplayType={UploaderProgressType.SPINNER}
              handleUpload={handleUpload}
              handleCancelUpload={handleCancelUpload}
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
            placeholderLabel="Description about this NFT collection that will be visible everywhere"
            widthClass="w-full"
            heightRows={5}
          />
        </div>
      </div>
      <div className="mt-10">
        <button
          className={`${
            isContinueButtonActive ? 'primary-CTA' : 'primary-CTA-disabled'
          } w-full`}
        >
          Continue
        </button>
        <div className="mt-2 text-sm text-gray-syn4">
          All fields (except token symbol) are modifiable later via an on-chain
          transaction with gas.
        </div>
      </div>
    </>
  );
};

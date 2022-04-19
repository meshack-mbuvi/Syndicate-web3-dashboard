import { TextArea } from '@/containers/layoutWithSyndicateDetails/activity/shared/ActivityModal/ActivityNote/textArea';
import React, { useState } from 'react';
import { InfoActionWrapper } from '../../infoActionWrapper';
import { FileUploader } from '../fileUploader';

interface Props {
  title?: string;
  helperText?: string;
  progressPercent: number;
  fileInfo: { name: string; successText: string };
  textInputValue;
  handleTextInputChange: (e) => void;
  handleFileUpload: (e) => void;
  handleCancelUpload: () => void;
  customClasses?: string;
}

export const AddressUploader: React.FC<Props> = ({
  title,
  helperText,
  progressPercent = 0,
  fileInfo,
  textInputValue,
  handleTextInputChange,
  handleFileUpload,
  handleCancelUpload,
  customClasses
}) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isUploadMethodSpreadsheet, setIsUploadMethodSpreadsheet] =
    useState(false);
  const height = 'h-52'; // 13rem

  return (
    <InfoActionWrapper
      title={title}
      actionButtonLabel={
        isUploadMethodSpreadsheet ? 'Enter addresses' : 'Upload a spreadsheet'
      }
      helperText={helperText}
      customClasses={`${customClasses}`}
      handleAction={() => {
        setIsUploadMethodSpreadsheet(!isUploadMethodSpreadsheet);
      }}
    >
      <button
        className={`${height} relative w-full ${
          isUploadMethodSpreadsheet ? '' : ''
        } ${isDraggingOver && 'bg-gray-syn8'}`}
        style={{ borderRadius: '0.3125rem' }}
        onDragOver={() => {
          setIsDraggingOver(true);
        }}
        onDragLeave={() => {
          setIsDraggingOver(false);
        }}
      >
        {/* Write addresses as text */}
        <div className={`h-full ${isUploadMethodSpreadsheet && 'hidden'}`}>
          {' '}
          {/* use this div to avoid button's default vertical centering of content */}
          <TextArea
            value={textInputValue}
            onChange={handleTextInputChange}
            heightoverride="13rem"
            classoverride={`p-6 border border-gray-syn6 hover:border-gray-syn3 focus:border-blue rounded no-scroll-bar`}
            placeholder={'0x... , 0x... , 0x... , example.eth'}
          />
        </div>

        {/* Upload addresses in spreadsheet */}
        <FileUploader
          fileName={fileInfo.name}
          successText={fileInfo.successText}
          progressPercent={progressPercent}
          handleUpload={handleFileUpload}
          handleCancelUpload={handleCancelUpload}
          customClasses={`${!isUploadMethodSpreadsheet && 'hidden'}`}
        />
      </button>
    </InfoActionWrapper>
  );
};

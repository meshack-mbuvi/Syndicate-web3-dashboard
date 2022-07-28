import { B3 } from '@/components/typography';
import React, { useState } from 'react';

export enum UploaderProgressType {
  LOADING_BAR = 'LOADING_BAR',
  SPINNER = 'SPINNER'
}

interface Props {
  progressPercent: number;
  fileName: string;
  successText?: string;
  errorText?: string;
  promptTitle?: string;
  promptSubtitle?: string;
  handleUpload: (e) => void;
  handleCancelUpload: () => void;
  progressDisplayType?: UploaderProgressType;
  heightClass?: string;
  accept?: string;
  customClasses?: string;
}

export const FileUploader: React.FC<Props> = ({
  progressPercent,
  fileName,
  successText,
  errorText,
  promptTitle = 'Upload a spreadsheet',
  promptSubtitle = 'CSV, XLS, or PDF file with addresses in first column',
  handleUpload,
  handleCancelUpload,
  progressDisplayType = UploaderProgressType.LOADING_BAR,
  heightClass = 'h-52',
  accept = '*',
  customClasses
}) => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  return (
    <button
      className={`w-full relative ${heightClass} px-6 border ${
        isInputFocused ? 'border-blue-neptune' : 'border-gray-syn6'
      } border-dashed rounded ${
        progressPercent <= 0 && 'hover:bg-gray-syn8'
      } transition-all ease-out ${customClasses} ${
        progressPercent > 0 ? 'py-6-percent' : ''
      }`}
    >
      <input
        type="file"
        className={`absolute top-0 opacity-0 left-0 ${heightClass} ${
          progressPercent > 0 && 'pointer-events-none'
        } cursor-pointer w-full text-white`}
        onChange={handleUpload}
        onFocus={() => {
          if (!isInputFocused) {
            setIsInputFocused(true);
          }
        }}
        onBlur={() => {
          if (isInputFocused) {
            setIsInputFocused(false);
          }
        }}
        accept={accept}
      />

      {/* Waiting for file */}
      <div
        className={`pointer-events-none text-center space-y-2 text-gray-syn4 ${
          progressPercent > 0 && 'hidden'
        }`}
      >
        <div className="flex justify-center space-x-2">
          <img
            src="/images/tray-arrow-icon.svg"
            className="w-6 h-6"
            alt="Icon"
          />
          <div>{promptTitle}</div>
        </div>
        <div className="text-xs">{promptSubtitle}</div>
      </div>

      {/* Upload progress */}
      <div
        className={`vertically-center space-y-3.5 text-left ${
          progressPercent === 0 && 'hidden'
        }`}
      >
        {/* File name */}
        <div className="flex justify-between">
          <div>
            <div className="flex space-x-2 items-center">
              <div className="flex space-x-2 items-center">
                <img src="/images/file-icon-white.svg" alt="File" />
                <div>{fileName}</div>
              </div>
              {progressDisplayType === UploaderProgressType.SPINNER && (
                <img
                  src={`/images/${
                    progressPercent < 100 ? 'spinner-blue' : 'checkmark-circle'
                  }.svg`}
                  className={`w-4 h-4 ${
                    progressPercent < 100 && 'animate-spin'
                  }`}
                  alt="Icon"
                />
              )}
            </div>

            {/* Upload success text */}
            {successText && !errorText && (
              <B3
                extraClasses={`${
                  progressPercent < 100 && 'hidden'
                } text-sm mt-1`}
              >
                {successText}
              </B3>
            )}

            {/* Error text */}
            {errorText && (
              <div className={`text-red-error text-sm mt-1`}>{errorText}</div>
            )}
          </div>
          <button onClick={handleCancelUpload}>
            <div
              className="hover:bg-gray-syn8 transition-all ease-out p-2 -m-2 relative rounded-full"
              style={{ top: '-1px' }}
            >
              <img
                src="/images/xmark-white.svg"
                className="relative w-4 h-4"
                style={{ top: '1px' }}
                alt="Icon"
              />
            </div>
          </button>
        </div>

        {/* Progress bar */}
        {progressDisplayType === UploaderProgressType.LOADING_BAR &&
          !errorText && (
            <div className="relative overflow-hidden rounded-full mt-1">
              <div className="h-2 w-full bg-gray-syn6 rounded-full"></div>
              <div
                className={`absolute top-0 h-2 ${
                  progressPercent < 100 ? 'bg-blue' : 'bg-green'
                } rounded-full transition-all`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          )}
      </div>
    </button>
  );
};

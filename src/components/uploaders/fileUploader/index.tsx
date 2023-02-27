import { B3, B4 } from '@/components/typography';
import clsx from 'clsx';
import React, { ReactNode, useRef, useState } from 'react';

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
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCancelUpload: () => void;
  progressDisplayType?: UploaderProgressType;
  addOn?: ReactNode;
  heightClass?: string;
  accept?: string;
  customClasses?: string;
}

export const FileUploader: React.FC<Props> = ({
  progressPercent,
  fileName,
  successText,
  errorText,
  promptTitle,
  promptSubtitle,
  handleUpload,
  handleCancelUpload,
  progressDisplayType = UploaderProgressType.LOADING_BAR,
  addOn,
  heightClass = 'h-52',
  accept = '*',
  customClasses
}) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const isAddOnVisible = addOn && progressPercent === 0;

  const cancelUpload = (e: { preventDefault: () => void }): void => {
    e.preventDefault();
    if (fileInput.current) {
      fileInput.current.value = '';
    }

    handleCancelUpload();
  };

  return (
    <button
      className={clsx(
        'w-full relative transition-all',
        isAddOnVisible ? 'h-auto' : heightClass,
        'px-6',
        addOn && 'py-8',
        'border',
        isInputFocused ? 'border-blue-neptune' : 'border-gray-syn6',
        'border-dashed rounded',
        progressPercent <= 0 && 'hover:bg-gray-syn8',
        'transition-all ease-out',
        customClasses,
        progressPercent > 0 && 'py-6-percent'
      )}
    >
      <input
        type="file"
        ref={fileInput}
        className={clsx(
          'absolute z-0 top-0 opacity-0 left-0',
          addOn ? 'h-full' : heightClass,
          progressPercent > 0 && 'pointer-events-none',
          'cursor-pointer w-full text-white'
        )}
        onChange={handleUpload}
        onFocus={(): void => {
          if (!isInputFocused) {
            setIsInputFocused(true);
          }
        }}
        onBlur={(): void => {
          if (isInputFocused) {
            setIsInputFocused(false);
          }
        }}
        accept={accept}
      />
      {/* Waiting for file */}
      <div
        className={clsx(
          'pointer-events-none text-center space-y-2 text-gray-syn4',
          progressPercent > 0 && 'hidden'
        )}
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
      {isAddOnVisible && (
        <div>
          <B4 extraClasses="mb-3 mt-2 text-gray-syn4">or</B4>
          <div className="relative z-10">{addOn}</div>
        </div>
      )}

      {/* Upload progress */}
      <div
        className={clsx(
          'space-y-3.5 text-left ',
          progressPercent === 0 && 'hidden'
        )}
      >
        {/* File name */}
        <div className="flex -mt-4">
          <div>
            <div className="flex space-x-2 items-center mr-4">
              <div className="flex space-x-2 items-center">
                <img src="/images/file-icon-white.svg" alt="File" />
                <div>{fileName}</div>
              </div>
              {progressDisplayType === UploaderProgressType.SPINNER &&
                !errorText && (
                  <img
                    src={`/images/${
                      progressPercent < 100
                        ? 'spinner-blue'
                        : 'checkmark-circle'
                    }.svg`}
                    className={clsx(
                      'w-4 h-4',
                      progressPercent < 100 && 'animate-spin'
                    )}
                    alt="Icon"
                  />
                )}
            </div>

            {/* Upload success text */}
            {successText && !errorText && (
              <B3
                extraClasses={clsx(
                  'text-sm mt-1',
                  progressPercent < 100 && 'hidden'
                )}
              >
                {successText}
              </B3>
            )}

            {/* Error text */}
            {errorText && (
              <div className={`text-red-error text-sm mt-1`}>{errorText}</div>
            )}
          </div>
          <button onClick={cancelUpload}>
            <div
              className="hover:bg-gray-syn8 transition-all ease-out p-2 -m-2 relative rounded-full"
              style={{ top: '-1px' }}
            >
              <img
                src="/images/xmark-white.svg"
                className="relative w-3 h-3"
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

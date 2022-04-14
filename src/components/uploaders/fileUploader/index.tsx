import React from 'react';

interface Props {
  progressPercent: number;
  fileName: string;
  successText: string;
  handleUpload: (e) => void;
  handleCancelUpload: () => void;
  customClasses: string;
}

export const FileUploader: React.FC<Props> = ({
  progressPercent,
  fileName,
  successText,
  handleUpload,
  handleCancelUpload,
  customClasses
}) => {
  const height = 'h-52';

  return (
    <div
      className={`relative ${height} p-6 border border-gray-syn6 border-dashed rounded ${customClasses}`}
    >
      <input
        type="file"
        className={`absolute top-0 opacity-0 left-0 ${height} cursor-pointer w-full text-white`}
        onChange={handleUpload}
      />

      {/* Waiting for file */}
      <div
        className={`vertically-center text-center space-y-2 text-gray-syn4 ${
          progressPercent > 0 && 'hidden'
        }`}
      >
        <div className="flex justify-center space-x-2">
          <img
            src="/images/tray-arrow-icon.svg"
            className="w-6 h-6"
            alt="Icon"
          />
          <div>Upload a spreadsheet</div>
        </div>
        <div className="text-xs">
          CSV, XLS, or PDF file with addresses in first column
        </div>
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
            <div>{fileName}</div>
          </div>
          <button onClick={handleCancelUpload}>
            <div
              className="hover:bg-gray-syn8 transition-all ease-out p-2 -m-2 relative rounded-full"
              style={{ top: '-1px' }}
            >
              <img
                src="/images/delete.svg"
                className="relative"
                style={{ top: '1px' }}
                alt="Icon"
              />
            </div>
          </button>
        </div>

        {/* Progress bar */}
        <div className="relative overflow-hidden rounded-full">
          <div className="h-2 w-full bg-gray-syn6 rounded-full"></div>
          <div
            className={`absolute top-0 h-2 ${
              progressPercent < 100 ? 'bg-blue' : 'bg-green'
            } rounded-full transition-all`}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Upload success text */}
        <div className={`${progressPercent < 100 && 'opacity-0'}`}>
          {successText}
        </div>
      </div>
    </div>
  );
};

import React from 'react';

export const LegalDocumentPreview: React.FC<{
  documentText: string;
  documentLink;
}> = ({ documentText }) => {
  return (
    <div className="flex justify-between w-full text-sm">
      <span>{documentText}</span>
      <button className="text-blue flex space-x-2">
        <span>Preview</span>{' '}
        <span className="align-middle h-full flex">
          <img src="/images/eye-open.svg" alt="Preview" />
        </span>
      </button>
    </div>
  );
};

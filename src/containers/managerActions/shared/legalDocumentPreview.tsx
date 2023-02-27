import React from 'react';

export const LegalDocumentPreview: React.FC<{
  documentText: string;
  documentLink: string;
}> = ({ documentText, documentLink }) => {
  return (
    <div className="flex justify-between w-full text-sm">
      <span>{documentText}</span>
      <a
        href={documentLink}
        className="text-blue cursor-pointer flex space-x-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>Preview</span>{' '}
        <span className="align-middle h-full flex">
          <img src="/images/eye-open.svg" alt="Preview" />
        </span>
      </a>
    </div>
  );
};

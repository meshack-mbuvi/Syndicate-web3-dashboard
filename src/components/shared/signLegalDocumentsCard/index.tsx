import { useDemoMode } from '@/hooks/useDemoMode';
import React from 'react';

const SignLegalDocumentsCard: React.FC<{ onClick: () => void }> = ({
  onClick
}) => {
  const isDemoMode = useDemoMode();

  return (
    <button
      onClick={isDemoMode ? () => ({}) : () => onClick()}
      className="align-middle"
    >
      <div className="rounded-t-2xl space-x-4 flex items-stretch">
        <div className="flex-shrink-0">
          <img
            src="/images/pencil.and.outline.gray.svg"
            className="mt-1"
            alt="sign legal documents"
          />
        </div>
        <div className="space-y-1">
          <p className="text-base leading-6">Sign legal agreements</p>
        </div>
      </div>
    </button>
  );
};

export default SignLegalDocumentsCard;

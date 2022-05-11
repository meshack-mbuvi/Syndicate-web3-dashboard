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
      <div className="rounded-t-2xl flex items-stretch">
        <div className="flex-shrink-0">
          <img
            src="/images/pencil.and.outline.gray.svg"
            className="mt-1"
            alt=""
          />
        </div>
        <div className="space-y-1 ml-4">
          <p className="text-base leading-6">Sign legal agreements</p>
        </div>
      </div>
    </button>
  );
};

export default SignLegalDocumentsCard;

import { useDemoMode } from '@/hooks/useDemoMode';
import React from 'react';
import { useRouter } from 'next/router';

const MakeDistributionCard: React.FC = () => {
  const isDemoMode = useDemoMode();

  const router = useRouter();
  const { clubAddress } = router.query;
  return (
    <a href={isDemoMode ? undefined : `/clubs/${clubAddress}/distribute`}>
      <div className="rounded-t-2xl space-x-4 flex items-stretch">
        <div className="flex-shrink-0">
          <img src="/images/Distribute.svg" className="mt-1" alt="arrow" />
        </div>
        <div className="space-y-1">
          <p className="text-base leading-6">Make a distribution</p>
          <p className="text-sm leading-6 text-gray-syn4">
            Send all or a portion of tokens to members
          </p>
        </div>
      </div>
    </a>
  );
};

export default MakeDistributionCard;

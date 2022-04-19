import { SkeletonLoader } from '@/components/skeletonLoader';
import React from 'react';

const LoadingClaim: React.FC = () => {
  return (
    <div className=" w-full flex flex-col justify-center items-center">
      <div className="w-full mb-14">
        <div className="mb-4 flex justify-center">
          <SkeletonLoader width="56" height="5" margin="m-0" />
        </div>
        <div className="flex justify-center">
          <SkeletonLoader width="100" height="12" margin="m-0" />
        </div>
        <div className="mt-4 flex justify-center">
          <SkeletonLoader width="72" height="7" margin="m-0" />
        </div>
      </div>
      <div className="w-full">
        <div className="w-full flex items-center justify-between mb-10 h-12"></div>
        <div className="flex gap-5 flex-wrap">
          <div>
            <div className="rounded-1.5lg border-1 border-gray-syn6 relative">
              <div className="rounded-t-1.5lg h-88 w-88 bg-gray-syn6">
                <SkeletonLoader width="full" height="full" margin="m-0" />
              </div>
              <div className="py-6 px-8 w-88 space-y-3">
                <SkeletonLoader width="56" height="8" margin="m-0" />
                <SkeletonLoader width="64" height="8" margin="mb-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingClaim;

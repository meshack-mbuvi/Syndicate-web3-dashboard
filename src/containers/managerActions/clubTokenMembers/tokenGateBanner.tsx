import React from 'react';

/** token-gated banner for admin view to show that club is token-gated */
const TokenGateBanner: React.FC = (): React.ReactElement => {
  return (
    <div className="flex justify-between items-center rounded bg-gray-syn7 px-4 py-3">
      <div className="space-x-2 flex items-center">
        <img
          src="/images/managerActions/token-gated-icon.svg"
          alt=""
          className="h-4"
        />
        <span className="text-sm text-white">Token-gated</span>
      </div>
      <div>
        <span className="text-gray-syn4 text-sm">
          Only token owners can deposit
        </span>
      </div>
    </div>
  );
};

export default TokenGateBanner;

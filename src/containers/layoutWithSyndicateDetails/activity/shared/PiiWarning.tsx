import React from 'react';

const PiiWarning: React.FC = () => {
  return (
    <div className="w-full py-4 px-5 mt-6 rounded-lg font-whyte text-yellow-saffron bg-brown-dark">
      <p className="text-base">
        This information may be publicly visible off-chain, so we do not
        recommend storing sensitive information.
      </p>
    </div>
  );
};

export default PiiWarning;

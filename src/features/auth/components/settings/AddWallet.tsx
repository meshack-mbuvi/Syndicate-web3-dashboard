import React from 'react';
import { B2 } from '@/components/typography';

const AddWallet: React.FC<{ handleAddWallet: () => void }> = ({
  handleAddWallet
}) => {
  return (
    <button className="flex items-center space-x-4" onClick={handleAddWallet}>
      <div>
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="16" cy="16" r="16" fill="#232529" />
          <path
            d="M8 16C8 16.4752 8.39758 16.863 8.86303 16.863H15.137V23.137C15.137 23.6024 15.5248 24 16 24C16.4752 24 16.8727 23.6024 16.8727 23.137V16.863H23.137C23.6024 16.863 24 16.4752 24 16C24 15.5248 23.6024 15.1273 23.137 15.1273H16.8727V8.86303C16.8727 8.39758 16.4752 8 16 8C15.5248 8 15.137 8.39758 15.137 8.86303V15.1273H8.86303C8.39758 15.1273 8 15.5248 8 16Z"
            fill="#B8BDC7"
          />
        </svg>
      </div>
      <B2 extraClasses="text-gray-syn3">Add wallet</B2>
    </button>
  );
};

export default AddWallet;

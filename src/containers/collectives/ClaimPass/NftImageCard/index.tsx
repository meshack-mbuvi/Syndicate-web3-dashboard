import { SkeletonLoader } from '@/components/skeletonLoader';

const NftImageCard: React.FC = () => {
  // TODO: Fetch loading state from redux store
  const loading = false;
  return (
    <div
      className="flex items-center justify-center w-full h-80 sm:h-auto sm:w-5/12"
      style={{
        background: `url('/images/placeholder-nft-bg.svg')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundOrigin: 'center center'
      }}
    >
      <div className="flex items-center justify-center w-24 h-24 border border-gray-syn4">
        {loading ? (
          <SkeletonLoader width="20" height="20" borderRadius="rounded-none" />
        ) : (
          <img
            src="https://lh3.googleusercontent.com/kGd5K1UPnRVe2k_3na9U5IKsAKr2ERGHn6iSQwQBPGywEMcRWiKtFmUh85nuG0tBPKLVqaXsWqHKCEJidwa2w4oUgcITcJ7Kh-ObsA"
            height={80}
            width={80}
            alt=""
          />
        )}
      </div>
    </div>
  );
};

export default NftImageCard;

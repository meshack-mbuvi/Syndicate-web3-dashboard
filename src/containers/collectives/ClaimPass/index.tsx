import NftImageCard from '@/containers/collectives/ClaimPass/NftImageCard';
import NftClaimAndInfoCard from '@/containers/collectives/ClaimPass/NftClaimAndInfoCard';

const ClaimPass: React.FC = () => {
  return (
    <div className="flex container mx-auto sm:mt-24 justify-center space-y-6 sm:space-x-32 flex-col sm:flex-row w-full">
      {/* nft image  */}
      <NftImageCard />
      {/* claim and info card  */}
      <NftClaimAndInfoCard />
    </div>
  );
};

export default ClaimPass;

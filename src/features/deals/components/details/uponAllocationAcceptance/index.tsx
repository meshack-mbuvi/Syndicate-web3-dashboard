import { L2, B3 } from '@/components/typography';
import Image from 'next/image';

interface UponAllocationAcceptanceProps {
  dealCommitTokenLogo: string;
  dealCommitTokenSymbol: string;
  dealTokenLogo: string;
  dealTokenSymbol: string;
}

const UponAllocationAcceptance: React.FC<UponAllocationAcceptanceProps> = ({
  dealCommitTokenLogo,
  dealCommitTokenSymbol,
  dealTokenLogo,
  dealTokenSymbol
}) => {
  return (
    <div className="rounded-2.5xl bg-gray-syn8 p-8 space-y-4.5 max-w-120">
      {/* title  */}
      <L2>Upon allocation acceptance</L2>

      <div className="rounded-custom divide-y-1 divide-gray-syn6 border border-gray-syn6">
        <div className="flex py-6 px-4.5 space-x-1 items-center justify-between">
          <B3 extraClasses="text-gray-syn3 w-1/4">Transfer</B3>
          <div className="flex items-center justify-start space-x-2 w-3/4">
            <Image
              src={dealCommitTokenLogo}
              height={20}
              width={20}
              className="pr-1"
            />
            <B3 className="ml-2 text-white">{dealCommitTokenSymbol}</B3>
            <B3 className="ml-2 text-gray-syn4">your allocation</B3>
          </div>
        </div>
        <div className="flex py-6 px-4.5 items-center justify-between">
          <B3 extraClasses="text-gray-syn3 w-1/4">Recieve</B3>
          <div className="flex items-center justify-start space-x-2 w-3/4">
            <Image
              src={dealTokenLogo}
              height={20}
              width={20}
              className="pr-1"
            />
            <B3 className="ml-2 text-white">{dealTokenSymbol}</B3>
            <B3 className="ml-2 text-gray-syn4">deal tokens</B3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UponAllocationAcceptance;

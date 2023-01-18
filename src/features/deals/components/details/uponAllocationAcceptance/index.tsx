import { H2, B3, H4, B4 } from '@/components/typography';
import { PrecommitStatus } from '@/hooks/deals/types';
import { getWeiAmount } from '@/utils/conversions';
import { formatAddress } from '@/utils/formatAddress';
import Image from 'next/image';
import { Wallet } from '../dealAllocationCard';
import { JazziconGenerator } from '@/features/auth/components/jazziconGenerator';
import { Callout } from '@/components/callout';

interface UponAllocationAcceptanceProps {
  dealName: string;
  dealCommitTokenLogo: string;
  dealCommitTokenSymbol: string;
  dealTokenLogo: string;
  dealTokenSymbol: string;
  connectedWallet: Wallet;
  precommitAmount: string;
  status: PrecommitStatus;
}

const UponAllocationAcceptance: React.FC<UponAllocationAcceptanceProps> = ({
  dealName,
  dealCommitTokenLogo,
  dealCommitTokenSymbol,
  dealTokenLogo,
  dealTokenSymbol,
  connectedWallet,
  precommitAmount,
  status
}) => {
  const commitAccepted = status === PrecommitStatus.EXECUTED;
  return (
    <div className={`rounded-2.5xl bg-gray-syn8 p-8 space-y-4 max-w-120`}>
      {/* title  */}
      <div className="space-y-2">
        <B3 extraClasses="text-gray-syn4">Your contribution to</B3>
        <H2 extraClasses="text-white">{dealName}</H2>
      </div>

      <div className="space-y-4">
        {/* contribution details in case of acceptance  */}
        <div
          className={`rounded-custom divide-y-1 divide-gray-syn6 border border-gray-syn6 `}
        >
          <div className="flex py-6 px-4.5 space-x-1 items-start justify-between">
            <B3 extraClasses="text-gray-syn3 w-1/4 ">
              {commitAccepted ? 'Transfer' : 'Proposal'}
            </B3>
            <div className="flex flex-col items-start justify-start w-3/4 -mt-1">
              <div className="flex items-center">
                <div className="mr-2 text-white">
                  <H4 extraclasses="text-white">
                    {getWeiAmount(precommitAmount, 6, false)}
                  </H4>
                </div>
                <Image
                  src={dealCommitTokenLogo || '/images/token-gray-4.svg'}
                  height={20}
                  width={20}
                />
                <B3 extraClasses="ml-2 text-white">{dealCommitTokenSymbol}</B3>
              </div>
              <div className="flex justify-start items-center">
                <div className="mr-1">
                  <JazziconGenerator
                    address={connectedWallet.address}
                    diameterRem={0.75}
                  />
                </div>

                <B4 extraClasses="text-gray-syn4">
                  {connectedWallet?.name
                    ? connectedWallet.name
                    : formatAddress(connectedWallet.address, 6, 4)}
                </B4>
              </div>
            </div>
          </div>

          {/* show receive amount in case of acceptance only  */}
          {commitAccepted && (
            <div className="flex py-6 px-4.5 items-center justify-between">
              <B3 extraClasses="text-gray-syn3 w-1/4">Receive</B3>
              <div className="flex items-center justify-start space-x-2 w-3/4">
                <B3 className="mr-2 text-white">
                  {getWeiAmount(precommitAmount, 6, false)}
                </B3>
                <Image
                  src={dealTokenLogo}
                  height={20}
                  width={20}
                  className="pr-1"
                />
                <B3 className="ml-2 text-white">{dealTokenSymbol}</B3>
              </div>
            </div>
          )}
        </div>

        {/* colored banner to show whether commit was accepted or rejected after closure */}
        <Callout
          backgroundColor={
            commitAccepted ? 'bg-green-semantic' : 'bg-red-error'
          }
          backgroundOpacity="bg-opacity-30"
          extraClasses="rounded-1.5lg p-4 text-center"
        >
          <B3 extraClasses="text-white">
            {commitAccepted
              ? 'Your contribution was accepted!'
              : 'Your contribution was rejected'}
          </B3>
        </Callout>
      </div>
    </div>
  );
};

export default UponAllocationAcceptance;

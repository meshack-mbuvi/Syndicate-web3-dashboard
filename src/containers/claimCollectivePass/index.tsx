import { CtaButton } from '@/components/CTAButton';
import { B2, B3, B4, H1, H2, H3, H4, L2 } from '@/components/typography';

export enum WalletState {
  NOT_CONNECTED = 'NOT_CONNECTED',
  WRONG_WALLET = 'WRONG_WALLET',
  CONNECTED = 'CONNECTED'
}

interface Props {
  numberOfExistingMembers: number;
  nameOfCollective: string;
  dateOfCreation: string;
  nameOfCreator: string;
  remainingPasses: number;
  priceToJoin: { tokenAmount: number; tokenSymbol: string; fiatAmount: number };
  walletState: WalletState;
  gasEstimate?: {
    tokenAmount: number;
    tokenSymbol: string;
    fiatAmount: number;
  };
}

export const ClaimCollectivePass: React.FC<Props> = ({
  numberOfExistingMembers,
  nameOfCollective,
  dateOfCreation,
  nameOfCreator,
  remainingPasses,
  priceToJoin,
  walletState,
  gasEstimate
}) => {
  const created = (
    <>
      {/* Desktop */}
      <div className="hidden sm:block">
        <B3 extraClasses="text-gray-syn4">
          Created {dateOfCreation} by {nameOfCreator}
        </B3>
      </div>
      {/* Mobile */}
      <div className="sm:hidden">
        <B4 extraClasses="text-gray-syn4">
          Created {dateOfCreation} by {nameOfCreator}
        </B4>
      </div>
    </>
  );

  const title = (
    <>
      {/* Desktop */}
      <div className="hidden sm:block">
        <H1 extraClasses="leading-10">{nameOfCollective}</H1>
      </div>
      {/* Mobile */}
      <div className="sm:hidden">
        <H2 extraClasses="leading-10">{nameOfCollective}</H2>
      </div>
    </>
  );

  const walletText =
    walletState === WalletState.CONNECTED
      ? 'Your wallet is eligible to claim this NFT'
      : walletState === WalletState.WRONG_WALLET
      ? `Your connected wallet is not eligible to claim this NFT`
      : walletState === WalletState.NOT_CONNECTED
      ? 'Connect your wallet to claim a pass'
      : null;
  const walletLabel = (
    <div>
      {/* Desktop */}
      <div className="hidden sm:block">
        <H4 extraClasses="mt-2">{walletText}</H4>
      </div>
      {/* Mobile */}
      <div className="sm:hidden">
        <B3>{walletText}</B3>
      </div>
    </div>
  );
  const walletButtonText =
    walletState === WalletState.CONNECTED
      ? 'Claim'
      : walletState === WalletState.WRONG_WALLET
      ? `Connect a different wallet`
      : walletState === WalletState.NOT_CONNECTED
      ? 'Connect wallet'
      : null;

  const passes = (
    <>
      {/* Desktop */}
      <div className="sm:flex sm:justify-between hidden sm:block space-y-4 sm:space-y-0 sm:space-x-5">
        <div>
          <B2 extraClasses="text-gray-syn4">Remaining passes</B2>
          <H3 regular>
            {remainingPasses}{' '}
            <span className="text-gray-syn4">
              of {remainingPasses + numberOfExistingMembers}
            </span>
          </H3>
        </div>
        <div>
          <B2 extraClasses="text-gray-syn4">Price to join</B2>
          <H3 regular>
            {priceToJoin.tokenAmount} {priceToJoin.tokenSymbol}{' '}
            <span className="text-gray-syn4">{priceToJoin.fiatAmount}</span>
          </H3>
        </div>
      </div>

      {/* Mobile */}
      <div className="sm:flex sm:justify-between sm:hidden space-y-4 sm:space-y-0 sm:space-x-5">
        <div className="space-y-2">
          <B3 extraClasses="text-gray-syn4">Remaining passes</B3>
          <H4 regular>
            {remainingPasses}{' '}
            <span className="text-gray-syn4">
              of {remainingPasses + numberOfExistingMembers}
            </span>
          </H4>
        </div>
        <div className="space-y-2">
          <B3 extraClasses="text-gray-syn4">Price to join</B3>
          <H4 regular>
            {priceToJoin.tokenAmount} {priceToJoin.tokenSymbol}{' '}
            <span className="text-gray-syn4">{priceToJoin.fiatAmount}</span>
          </H4>
        </div>
      </div>
    </>
  );

  return (
    <div className="space-y-6 sm:space-y-10 max-w-120">
      <div className="sm:space-y-4">
        <L2 extraClasses="mb-2">Join {numberOfExistingMembers} members of</L2>
        <div className="mb-4 sm:mb-0 sm:flex items-center space-y-2 sm:space-y-0 sm:space-x-4">
          {title}
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-gray-syn7 w-8 h-8"></div>
            <div className="rounded-full bg-gray-syn7 w-8 h-8"></div>
          </div>
        </div>
        {created}
      </div>

      {passes}

      <div className="fixed sm:relative bottom-0 left-0 py-6 sm:py-auto px-4 w-full sm:p-8 bg-gray-syn8 space-y-4 sm:space-y-10 text-center sm:rounded-2.5xl">
        {walletLabel}
        <CtaButton greenCta={walletState === WalletState.CONNECTED}>
          {walletButtonText}
        </CtaButton>
        {walletState === WalletState.CONNECTED && gasEstimate && (
          <B3 extraClasses="text-gray-syn5">
            Est. gas fee: {gasEstimate.tokenAmount} {gasEstimate.tokenSymbol}{' '}
            (56.78 USD)
          </B3>
        )}
      </div>
    </div>
  );
};

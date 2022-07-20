import { CtaButton } from '@/components/CTAButton';
import { ProgressCard, ProgressState } from '@/components/progressCard';
import { B2, B3, B4, H1, H2, H3, H4, L2 } from '@/components/typography';
import { showWalletModal } from '@/state/wallet/actions';
import { useDispatch } from 'react-redux';

export enum WalletState {
  NOT_CONNECTED = 'NOT_CONNECTED',
  WRONG_WALLET = 'WRONG_WALLET',
  CONNECTED = 'CONNECTED',
  MAX_PASSES_REACHED = 'MAX_PASSES_REACHED'
}

interface Props {
  links?: { openSea: string; externalLink: string };
  numberOfExistingMembers: number;
  nameOfCollective: string;
  dateOfCreation: string;
  nameOfCreator: string;
  remainingPasses: number;
  priceToJoin: {
    tokenAmount: number;
    tokenSymbol: string;
    fiatAmount: number;
  };
  walletState: WalletState;
  walletAddress?: string;
  gasEstimate?: {
    tokenAmount: number;
    tokenSymbol: string;
    fiatAmount: number;
  };
  progressState?: ProgressState;
  transactionHash?: string;
  transactionType?: string;
}

export const ClaimCollectivePass: React.FC<Props> = ({
  links,
  numberOfExistingMembers,
  nameOfCollective,
  dateOfCreation,
  nameOfCreator,
  remainingPasses,
  priceToJoin,
  walletState,
  walletAddress,
  gasEstimate,
  progressState,
  transactionHash,
  transactionType
}) => {
  const dispatch = useDispatch();

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
      ? `Your connected wallet${
          walletAddress ? `, ${walletAddress}, ` : ' '
        }is not eligible to claim this NFT`
      : walletState === WalletState.NOT_CONNECTED
      ? 'Connect your wallet to claim a pass'
      : walletState === WalletState.MAX_PASSES_REACHED
      ? 'You have reached the maximum number of passes per wallet'
      : null;

  const walletLabel = (
    <div>
      {/* Desktop */}
      <div className="hidden sm:block">
        <H4 regular>{walletText}</H4>
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
      : walletState === WalletState.WRONG_WALLET ||
        walletState === WalletState.MAX_PASSES_REACHED
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
            {remainingPasses.toLocaleString('en-US')}{' '}
            <span className="text-gray-syn4">
              of{' '}
              {(remainingPasses + numberOfExistingMembers).toLocaleString(
                'en-US'
              )}
            </span>
          </H3>
        </div>
        <div>
          <B2 extraClasses="text-gray-syn4">Price per NFT</B2>
          <H3 regular>
            {priceToJoin.tokenAmount} {priceToJoin.tokenSymbol}{' '}
            <span className="text-gray-syn4">${priceToJoin.fiatAmount}</span>
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
          <B3 extraClasses="text-gray-syn4">Price per NFT</B3>
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
        <L2 extraClasses="mb-2">
          Join{' '}
          {numberOfExistingMembers > 0
            ? numberOfExistingMembers.toLocaleString('en-US')
            : 'the'}{' '}
          members of
        </L2>
        <div className="mb-4 sm:mb-0 sm:flex items-center space-y-2 sm:space-y-0 sm:space-x-4">
          {title}
          {links && (
            <div className="flex items-center space-x-4">
              <a
                href={links.openSea}
                className="rounded-full bg-gray-syn7 hover:bg-gray-syn6 w-8 h-8"
              >
                <img
                  src="/images/collectives/opensea.svg"
                  alt="Opensea"
                  className="mx-auto vertically-center"
                />
              </a>
              <a
                href={links.externalLink}
                className="rounded-full bg-gray-syn7 hover:bg-gray-syn6 w-8 h-8"
              >
                <img
                  src="/images/collectives/external-link.svg"
                  alt="External link"
                  className="mx-auto vertically-center"
                />
              </a>
            </div>
          )}
        </div>
        {created}
      </div>

      {passes}

      {progressState &&
      progressState === ProgressState.PENDING &&
      walletState === WalletState.CONNECTED ? (
        <div className="fixed sm:relative bottom-0 left-0 sm:py-auto w-full bg-gray-syn8 text-center sm:rounded-2.5xl">
          <ProgressCard
            title="Claiming NFT"
            state={progressState}
            transactionHash={transactionHash}
            transactionType={transactionType}
          />
        </div>
      ) : progressState &&
        progressState === ProgressState.CONFIRM &&
        walletState === WalletState.CONNECTED ? (
        <div className="fixed sm:relative bottom-0 left-0 sm:py-auto w-full bg-gray-syn8 text-center sm:rounded-2.5xl">
          <ProgressCard
            title="Confirm in wallet"
            description="Please confirm the changes in your wallet"
            state={progressState}
            transactionHash=""
            transactionType={transactionType}
          />
        </div>
      ) : progressState &&
        progressState === ProgressState.FAILURE &&
        walletState === WalletState.CONNECTED ? (
        <div className="fixed sm:relative bottom-0 left-0 sm:py-auto w-full bg-gray-syn8 text-center sm:rounded-2.5xl">
          <ProgressCard
            title="Claim failed"
            state={progressState}
            transactionHash={transactionHash}
            buttonLabel="Try again"
            buttonFullWidth={true}
            transactionType={transactionType}
          />
        </div>
      ) : (
        <div className="fixed sm:relative bottom-0 left-0 py-6 sm:py-auto px-4 w-full sm:px-8 sm:py-10 bg-gray-syn8 space-y-4 sm:space-y-10 text-center sm:rounded-2.5xl">
          {walletLabel}
          <div className="space-y-4">
            {walletState !== WalletState.MAX_PASSES_REACHED && (
              <CtaButton
                greenCta={walletState === WalletState.CONNECTED}
                onClick={() => {
                  if (
                    walletState === WalletState.NOT_CONNECTED ||
                    walletState === WalletState.WRONG_WALLET
                  ) {
                    dispatch(showWalletModal());
                  } else if (walletState === WalletState.CONNECTED) {
                    // TODO: add trigger for claiming here
                    return;
                  }
                }}
              >
                {walletButtonText}
              </CtaButton>
            )}
            {walletState === WalletState.CONNECTED && gasEstimate && (
              // Positioned absolutely so it doesn't take up space
              <div className="relative">
                <B3 extraClasses="absolute top-0 left-0 w-full text-gray-syn5">
                  Est. gas fee: {gasEstimate.tokenAmount}{' '}
                  {gasEstimate.tokenSymbol}{' '}
                  {Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(gasEstimate.fiatAmount)}{' '}
                  USD
                </B3>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

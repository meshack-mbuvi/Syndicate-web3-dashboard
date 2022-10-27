import { CtaButton } from '@/components/CTAButton';
import { ArrowRightIcon } from '@/components/icons/arrowRight';
import { WalletIcon } from '@/components/iconWrappers';
import StatusBadge from '@/components/syndicateDetails/statusBadge';
import { H4 } from '@/components/typography';

export enum AuthSignInWidgetState {
  SIGN_IN = 'SIGN_IN',
  CONNECT_WALLET = 'CONNECT_WALLET'
}

interface Props {
  state: AuthSignInWidgetState;
  handleCTAClick: () => void;
}

export const AuthSignInWidget: React.FC<Props> = ({
  state,
  handleCTAClick
}) => {
  return (
    <>
      <div className="bg-gray-syn8 rounded-2.5xl max-w-480">
        <StatusBadge depositsEnabled={true} hideCountdown={true} />
        <div className="p-8 space-y-8 text-center">
          {state === AuthSignInWidgetState.CONNECT_WALLET ? (
            <H4>To deposit into this investment club, connect a wallet</H4>
          ) : (
            <H4>Sign in to join this investment club</H4>
          )}
          <CtaButton
            extraClasses="flex items-center space-x-2 justify-center font-semibold"
            onClick={handleCTAClick}
          >
            {state === AuthSignInWidgetState.CONNECT_WALLET ? (
              <>
                <WalletIcon width="16" height="16" className="text-black" />
                <div>Connect wallet</div>
              </>
            ) : (
              <>
                <div>Sign in</div>
                <ArrowRightIcon />
              </>
            )}
          </CtaButton>
        </div>
      </div>
    </>
  );
};

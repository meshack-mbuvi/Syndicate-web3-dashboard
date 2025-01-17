import { amplitudeLogger, Flow } from '@/components/amplitude';
import { CONTINUE_WALLET_CLICK } from '@/components/amplitude/eventNames';
import { CTAButton, CTAType } from '@/components/CTAButton';
import AccountPill from '@/components/shared/accountPill';
import { L2 } from '@/components/typography';
import { useConnectWalletContext } from '@/context/ConnectWalletProvider';
import { useCreateInvestmentClubContext } from '@/context/CreateInvestmentClubContext';
import useAdminClubs from '@/hooks/clubs/useAdminClubs';
import { showWalletModal } from '@/state/wallet/actions';
import { ArrowRightIcon } from '@heroicons/react/outline';
import { useDispatch } from 'react-redux';
import { SkeletonLoader } from 'src/components/skeletonLoader';

const WalletWarnings: React.FC = () => {
  const dispatch = useDispatch();

  const { myClubs, totalClubs, loading } = useAdminClubs();

  const { disconnectWallet } = useConnectWalletContext();

  const { setShowModal, handleCreateInvestmentClub } =
    useCreateInvestmentClubContext();

  const hasExistingClubs = myClubs.some((club) => club) && totalClubs >= 1;

  const getWarningText = (): string | undefined => {
    const existingClub = totalClubs ? myClubs[0] : null;
    const _base = `This wallet is already being used for ${
      existingClub?.clubName ?? ''
    } (${existingClub?.clubSymbol ?? ''})`;

    if (totalClubs === 1) {
      return _base;
    }
    if (totalClubs > 1) {
      return `${_base} and ${totalClubs - 1} other clubs`;
    }
    return;
  };

  const handleDisconnectWallet = (): void => {
    disconnectWallet?.();
    setShowModal?.((prev) => ({
      ...prev,
      warningModal: false
    }));
    dispatch(showWalletModal());
  };

  return (
    <div>
      {loading ? (
        <div className="flex flex-col space-y-6">
          <div>
            <SkeletonLoader width="1/2" height="4" borderRadius="rounded-md" />
          </div>
          <div>
            <SkeletonLoader width="full" height="4" borderRadius="rounded-md" />
            <SkeletonLoader width="full" height="4" borderRadius="rounded-md" />
            <SkeletonLoader width="full" height="4" borderRadius="rounded-md" />
          </div>
          <div className="flex justify-center">
            <SkeletonLoader width="48" height="8" borderRadius="rounded-2xl" />
          </div>
          <div>
            <SkeletonLoader width="full" height="4" borderRadius="rounded-md" />
            <SkeletonLoader width="full" height="4" borderRadius="rounded-md" />
          </div>
          <div>
            <SkeletonLoader
              width="full"
              height="14"
              borderRadius="rounded-lg"
            />
          </div>
        </div>
      ) : (
        <>
          {hasExistingClubs && (
            <img
              className="w-7.5 h-7.5 mb-4"
              src="/images/syndicateStatusIcons/warning-triangle-yellow.svg"
              alt="warning"
            />
          )}
          <L2>
            {hasExistingClubs
              ? getWarningText()
              : 'Use wallet as permanent club wallet?'}
          </L2>
          {hasExistingClubs ? (
            <p className="text-gray-syn3 text-sm pb-9 pt-4">
              <span>
                By using the same wallet for multiple clubs, note that:
              </span>
              <ul className="list-disc py-2 pl-6">
                <li>Existing assets will be visible in this club</li>
                <li>Assets will be co-mingled</li>
                <li>Activity will be shared across clubs</li>
              </ul>
              <span>
                To keep each club’s assets separate, use a unique wallet for
                each club you create.
              </span>
            </p>
          ) : (
            <p className="py-6">
              Confirm the connected wallet or create a new wallet for this
              investment club. Deposits will be collected in this wallet, and
              any existing assets in this wallet will be visible to all club
              members.
              <div className="flex justify-center my-6">
                <AccountPill />
              </div>
            </p>
          )}
          <CTAButton
            fullWidth={true}
            type={hasExistingClubs ? CTAType.WARNING : CTAType.TRANSACTIONAL}
            extraClasses={`flex items-center justify-center space-x-2`}
            onClick={(): void => {
              handleCreateInvestmentClub?.();
              void amplitudeLogger(CONTINUE_WALLET_CLICK, {
                flow: Flow.CLUB_CREATE
              });
            }}
          >
            <span>
              {hasExistingClubs ? 'C' : 'Yes, c'}ontinue with this wallet
            </span>
            <ArrowRightIcon className="w-5 h-5" />
          </CTAButton>
          <p className="text-center pt-6 font">
            <button onClick={handleDisconnectWallet}>
              Use a different wallet instead
            </button>
          </p>
        </>
      )}
    </div>
  );
};

export default WalletWarnings;

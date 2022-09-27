import { useDispatch, useSelector } from 'react-redux';
import AccountPill from '@/components/shared/accountPill';
import { SkeletonLoader } from 'src/components/skeletonLoader';
import { ArrowRightIcon } from '@heroicons/react/outline';
import { useConnectWalletContext } from '@/context/ConnectWalletProvider';
import { useCreateInvestmentClubContext } from '@/context/CreateInvestmentClubContext';
import { showWalletModal } from '@/state/wallet/actions';
import { useMyClubs } from '@/hooks/clubs/useMyClubs';
import { useEffect } from 'react';
import { L2 } from '@/components/typography';
import { AppState } from '@/state';
import { amplitudeLogger, Flow } from '@/components/amplitude';
import { CONTINUE_WALLET_CLICK } from '@/components/amplitude/eventNames';

const WalletWarnings: React.FC = () => {
  const dispatch = useDispatch();
  const {
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const { myClubs, refetch, loading, isFetched, totalClubs } = useMyClubs();

  useEffect(() => {
    if (!isFetched && activeNetwork.chainId) refetch();
  }, [activeNetwork.chainId]);

  const { disconnectWallet } = useConnectWalletContext();

  const { setShowModal, handleCreateInvestmentClub } =
    useCreateInvestmentClubContext();

  const hasExistingClubs = myClubs.some((club) => club) && totalClubs >= 1;

  const getWarningText = () => {
    const existingClub = totalClubs ? myClubs[0] : null;
    const _base = `This wallet is already being used for ${existingClub.clubName} (${existingClub.clubSymbol})`;
    if (totalClubs === 1) {
      return _base;
    }
    if (totalClubs > 1) {
      return `${_base} and ${totalClubs - 1} other clubs`;
    }
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    setShowModal((prev) => ({
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
          <button
            className={`${
              hasExistingClubs ? 'orange-CTA' : 'green-CTA'
            } w-full flex items-center justify-center space-x-2`}
            onClick={() => {
              handleCreateInvestmentClub();
              amplitudeLogger(CONTINUE_WALLET_CLICK, {
                flow: Flow.CLUB_CREATE
              });
            }}
          >
            <span>
              {hasExistingClubs ? 'C' : 'Yes, c'}ontinue with this wallet
            </span>
            <ArrowRightIcon className="w-5 h-5" />
          </button>
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

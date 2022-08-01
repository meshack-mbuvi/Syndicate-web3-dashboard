import { useCreateInvestmentClubContext } from '@/context/CreateInvestmentClubContext';
import { AppState } from '@/state';
import { setDispatchCreateFlow, showWalletModal } from '@/state/wallet/actions';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { animated, useSpring } from 'react-spring';
import { useConnectWalletContext } from '@/context/ConnectWalletProvider';
import { useProvider } from '@/hooks/web3/useProvider';

const InvestmentClubCTAs: React.FC = () => {
  const {
    reviewStep,
    firstStep,
    handleBack,
    handleNext,
    backBtnDisabled,
    nextBtnDisabled,
    setShowModal,
    showNextButton,
    handleCreateInvestmentClub,
    isWalletConfirmed,
    isEditStep,
    setIsEditStep,
    setCurrentStep
  } = useCreateInvestmentClubContext();

  const { switchNetworks } = useConnectWalletContext();

  const {
    web3Reducer: { web3 }
  } = useSelector((state: AppState) => state);

  const { account, activeNetwork } = web3;

  const dispatch = useDispatch();
  const { providerName } = useProvider();

  const [preSelectednetwork, setPreSelectedNetwork] = useState<number>(null);

  const connectWallet = () => {
    setPreSelectedNetwork(activeNetwork.chainId);
    dispatch(showWalletModal());
    dispatch(setDispatchCreateFlow(true));
  };

  useEffect(() => {
    if (
      activeNetwork.chainId &&
      account &&
      providerName &&
      preSelectednetwork !== activeNetwork.chainId
    ) {
      if (providerName === 'WalletConnect') {
        // TODO: handle wallet connect info here
        // inform users when they connect to a different network from the pre-selected one.
      } else {
        switchNetworks(preSelectednetwork);
      }
    }
  }, [account, activeNetwork.chainId, providerName]);

  const confirmWallet = () => {
    setShowModal((prev) => ({
      ...prev,
      warningModal: true
    }));
  };

  const styles = useSpring({
    to: { y: 0 },
    from: { y: -50 },
    delay: 500
  });

  return (
    <animated.div
      className={`bg-black flex-none flex flex-col sm:items-center ${
        reviewStep ? 'fixed w-full left-0 bottom-0 h-32 px-10 ' : ''
      }`}
      style={styles}
    >
      <div
        className={`flex flex-col-reverse items-center pt-4 sm:w-full sm:flex-row sm:max-w-480 sm:h-full sm:pt-0 sm:ml-0 ml-5 ${
          firstStep || isEditStep ? 'justify-end' : 'justify-between'
        }
          ${reviewStep ? 'sm:border-t border-gray-syn4' : ''}
        }`}
      >
        {!firstStep && !isEditStep && (
          <button
            className={`flex items-center mt-6 sm:mt-0 text-gray-syn4 text-base opacity-80 hover:opacity-100 focus:outline-none sm:ml-5 ml-0 ${
              backBtnDisabled ? 'cursor-not-allowed' : ''
            }`}
            onClick={handleBack}
            disabled={backBtnDisabled}
          >
            <img className="w-5 h-5" src="/images/arrowBack.svg" alt="" />
            <span className="ml-2">Back</span>
          </button>
        )}
        {showNextButton && (
          <button
            className={`w-full sm:w-auto ${
              nextBtnDisabled
                ? 'primary-CTA-disabled text-gray-syn4'
                : reviewStep
                ? 'green-CTA transition-all'
                : 'primary-CTA'
            }`}
            onClick={
              reviewStep
                ? !account
                  ? connectWallet
                  : isWalletConfirmed
                  ? handleCreateInvestmentClub
                  : confirmWallet
                : isEditStep
                ? () => {
                    setIsEditStep(false);
                    setCurrentStep(4);
                  }
                : handleNext
            }
            disabled={nextBtnDisabled}
          >
            {reviewStep
              ? !account
                ? 'Connect wallet to create'
                : isWalletConfirmed
                ? 'Create investment club'
                : 'Confirm wallet'
              : isEditStep
              ? 'Done'
              : 'Next'}
          </button>
        )}
      </div>
    </animated.div>
  );
};

export default InvestmentClubCTAs;

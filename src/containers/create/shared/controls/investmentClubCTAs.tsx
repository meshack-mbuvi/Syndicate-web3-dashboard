import { amplitudeLogger, Flow } from '@/components/amplitude';
import { CONFIRM_WALLET_CLICK } from '@/components/amplitude/eventNames';
import { CTAButton, CTAType } from '@/components/CTAButton';
import EstimateGas from '@/components/EstimateGas';
import { useConnectWalletContext } from '@/context/ConnectWalletProvider';
import { useCreateInvestmentClubContext } from '@/context/CreateInvestmentClubContext';
import { CreateActiveSteps } from '@/context/CreateInvestmentClubContext/steps';
import { ContractMapper } from '@/hooks/useGasDetails';
import { useProvider } from '@/hooks/web3/useProvider';
import { AppState } from '@/state';
import { setDispatchCreateFlow, showWalletModal } from '@/state/wallet/actions';
import { getWeiAmount } from '@/utils/conversions';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { animated, useSpring } from 'react-spring';

const InvestmentClubCTAs: React.FC<{ disabled: boolean }> = ({ disabled }) => {
  const {
    isReviewStep,
    // isCreatingInvestmentClub,
    editingStep,
    handleBack,
    handleNext,
    backBtnDisabled,
    nextBtnDisabled,
    setShowModal,
    handleCreateInvestmentClub,
    isWalletConfirmed,
    currentStep,
    stepsCategories
  } = useCreateInvestmentClubContext();

  const { switchNetworks } = useConnectWalletContext();

  const {
    web3Reducer: { web3: web3Wallet },
    createInvestmentClubSliceReducer: {
      investmentClubName,
      investmentClubSymbol,
      mintEndTime: { value: endMintTime },
      membersCount,
      tokenDetails: { depositToken },
      tokenCap,
      tokenRules,
      tokenGateOption,
      logicalOperator
    }
  } = useSelector((state: AppState) => state);

  const { account, activeNetwork } = web3Wallet;

  const dispatch = useDispatch();
  const { providerName } = useProvider();

  // @ts-expect-error TS(2345): Argument of type 'null' is not assignable to par... Remove this comment to see the full error message
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
      preSelectednetwork &&
      preSelectednetwork !== activeNetwork.chainId
    ) {
      if (providerName === 'WalletConnect') {
        // TODO: handle wallet connect info here
        // inform users when they connect to a different network from the pre-selected one.
      } else {
        // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefined'.
        switchNetworks(preSelectednetwork);
      }
    }
  }, [account, activeNetwork.chainId, providerName]);

  const confirmWallet = () => {
    // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
    setShowModal((prev) => ({
      ...prev,
      warningModal: true
    }));
    amplitudeLogger(CONFIRM_WALLET_CLICK, {
      flow: Flow.CLUB_CREATE
    });
  };

  const styles = useSpring({
    to: { y: 0 },
    from: { y: -50 },
    delay: 500
  });

  // button text should change to 'Review' on the membership step
  const isMembershipStep =
    currentStep == stepsCategories?.indexOf(CreateActiveSteps.MEMBERSHIP);

  // Do not show the back button if we are on the getting started page (category selection page)
  // or if we are on CLUB_DETAILS step
  const showBackButton = !editingStep && (isReviewStep || isMembershipStep);

  return (
    <animated.div
      className={`bg-gray-syn9 flex-none flex flex-col items-center ${
        isReviewStep ? 'w-full h-10.875' : ''
      }`}
      style={styles}
    >
      <div
        className={`flex flex-col w-full sm:h-full sm:pt-0
          ${isReviewStep ? 'sm:border-t border-gray-syn4' : ''}
        }`}
      >
        {isReviewStep && (
          <div className="pt-6">
            <EstimateGas
              contract={ContractMapper.ERC20ClubFactory}
              args={{
                clubParams: {
                  clubTokenName: investmentClubName,
                  clubTokenSymbol: investmentClubSymbol,
                  isNativeDeposit: true,
                  depositToken: depositToken,
                  tokenCap: getWeiAmount(
                    (
                      +tokenCap * activeNetwork.nativeCurrency.exchangeRate
                    ).toString(),
                    18,
                    true
                  ),
                  startTime: (~~(new Date().getTime() / 1000)).toString(),
                  endTime: endMintTime.toString(),
                  membersCount: Number(membersCount),
                  tokenRules: tokenRules,
                  tokenGateOption: tokenGateOption,
                  logicalOperator: logicalOperator
                }
              }}
            />
          </div>
        )}

        <div
          className={`flex flex-col-reverse sm:flex-row py-4 bg-gray-syn9 ${
            !showBackButton ? 'justify-end' : 'justify-between'
          }`}
        >
          {showBackButton && (
            <button
              className={`flex items-center my-6 sm:my-0 text-gray-syn4 text-base opacity-80 hover:opacity-100 focus:outline-none ${
                backBtnDisabled ? 'cursor-not-allowed' : ''
              }`}
              onClick={handleBack}
              disabled={backBtnDisabled}
            >
              <span className="ml-2">Back</span>
            </button>
          )}

          <CTAButton
            type={
              nextBtnDisabled
                ? CTAType.DISABLED
                : isReviewStep
                ? CTAType.TRANSACTIONAL
                : CTAType.PRIMARY
            }
            extraClasses={`${
              isReviewStep ? 'transition-all' : ''
            } w-full sm:w-auto`}
            onClick={
              isReviewStep
                ? !account
                  ? connectWallet
                  : isWalletConfirmed
                  ? handleCreateInvestmentClub
                  : confirmWallet
                : handleNext
            }
            disabled={nextBtnDisabled || disabled}
          >
            {isReviewStep
              ? !account
                ? 'Connect wallet to create'
                : isWalletConfirmed
                ? 'Create investment club'
                : 'Confirm wallet'
              : editingStep
              ? 'Done'
              : isMembershipStep
              ? 'Review'
              : 'Next'}
          </CTAButton>
        </div>
      </div>
    </animated.div>
  );
};

export default InvestmentClubCTAs;

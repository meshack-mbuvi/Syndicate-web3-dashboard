import { DealsCreateReview } from '@/features/deals/components/create/review';
import { useCreateDealContext } from '@/context/createDealContext';
import { SelectedTimeWindow } from '@/features/deals/components/create/window';
import NetworkComponent from '@/components/collectives/create/networkComponent';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '@/state';
import { ContractMapper } from '@/hooks/useGasDetails';
import { showWalletModal } from '@/state/wallet/actions';

export const ReviewDealDetails: React.FC = () => {
  const {
    web3Reducer: {
      web3: { account }
    }
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();

  const {
    name,
    details,
    commitmentGoal,
    minimumCommitment,
    destinationAddress,
    selectedTimeWindow,
    customDate,
    customTime,
    tokenSymbol,
    destinationAddressError,
    isEditingField,
    isReviewStep,
    handleNameChange,
    handleDetailsChange,
    handleCommitmentGoalChange,
    handleMinimumCommitmentChange,
    handleDestinationAddressChange,
    handleSelectedTimeWindowChange,
    handleCustomDateChange,
    handleCustomTimeChange,
    handleTokenSymbolChange,
    handleShuffle,
    handleCreateDeal,
    setIsEditingField
  } = useCreateDealContext();

  const handleLaunch = (): void => {
    if (handleCreateDeal) {
      handleCreateDeal();
    }
  };
  const handleConnectWallet = (): void => {
    dispatch(showWalletModal());
  };

  // bottom bar with gas estimates and launch button
  const launchBar = (
    <div
      className={`flex w-full justify-center items-center bg-black transition-all duration-700 ${
        isEditingField ? '-mb-40' : 'mb-0'
      }`}
      style={{
        borderRadius: '40px 40px 0px 0px'
      }}
    >
      <NetworkComponent
        account={account}
        disabled={false}
        handleLaunch={handleLaunch}
        handleConnectWallet={handleConnectWallet}
        contract={ContractMapper.ERC20DealFactory}
        args={{
          dealParams: {
            dealName: name,
            dealTokenSymbol: tokenSymbol,
            dealDestination: destinationAddress,
            dealGoal: commitmentGoal ? parseInt(commitmentGoal) : 0,
            minPerMember: minimumCommitment ? parseInt(minimumCommitment) : 0,
            startTime: '1670334136',
            endTime: '1701870136'
          }
        }}
      />
    </div>
  );
  return (
    <div className="h-full">
      <DealsCreateReview
        // About
        name={name ? name : ''}
        handleNameChange={handleNameChange}
        details={details ? details : ''}
        handleDetailsChange={handleDetailsChange}
        handleShuffle={handleShuffle}
        // Goal
        commitmentGoal={commitmentGoal ? commitmentGoal : ''}
        handleCommitmentGoalChange={handleCommitmentGoalChange}
        minimumCommitment={minimumCommitment ? minimumCommitment : ''}
        handleMinimumCommitmentChange={handleMinimumCommitmentChange}
        tokenSymbol={tokenSymbol ? tokenSymbol : ''}
        handleTokenClick={() => {
          alert('Change token');
        }}
        handleTokenSymbolChange={handleTokenSymbolChange}
        tokenLogo="/images/prodTokenLogos/USDCoin.svg"
        destinationAddress={destinationAddress ? destinationAddress : ''}
        destinationAddressError={destinationAddressError}
        handleDestinationAddressChange={handleDestinationAddressChange}
        // Window
        selectedTimeWindow={
          selectedTimeWindow ? selectedTimeWindow : SelectedTimeWindow.DAY
        }
        handleSelectedTimeWindowChange={handleSelectedTimeWindowChange}
        customDate={customDate}
        handleCustomDateChange={handleCustomDateChange}
        customTime={customTime}
        handleCustomTimeChange={handleCustomTimeChange}
        formattedWindowEndTime="Jan 1, 2023 11:59pm PST"
        isReviewStep={isReviewStep}
        setIsEditingField={setIsEditingField}
      />
      <div
        className={`transition-opacity fixed w-full animate-move-in left-0 z-30 bottom-0 transparent`}
        style={{
          borderRadius: '40px 40px 0px 0px'
        }}
      >
        <div className="flex justify-center w-full">{launchBar}</div>
      </div>
    </div>
  );
};

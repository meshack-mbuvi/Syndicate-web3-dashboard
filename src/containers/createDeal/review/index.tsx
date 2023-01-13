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
    ensName,
    // details,
    commitmentGoal,
    commitmentGoalTokenSymbol,
    minimumCommitment,
    destinationAddress,
    selectedTimeWindow,
    customDate,
    customTime,
    endTime,
    tokenSymbol,
    destinationAddressError,
    isEditingField,
    isReviewStep,
    isCreateDealDisabled,
    handleNameChange,
    // handleDetailsChange,
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
      className={`flex w-full justify-center items-center bg-gray-syn9 transition-all duration-700 ${
        isEditingField ? '-mb-40' : 'mb-0'
      }`}
      style={{
        borderRadius: '40px 40px 0px 0px'
      }}
    >
      <NetworkComponent
        account={account}
        disabled={!!isCreateDealDisabled}
        handleLaunch={handleLaunch}
        handleConnectWallet={handleConnectWallet}
        contract={ContractMapper.ERC20DealFactory}
        args={{
          dealParams: {
            dealName: name || 'Test Name',
            dealTokenSymbol: tokenSymbol || 'TN',
            dealDestination:
              destinationAddress && !destinationAddressError
                ? destinationAddress
                : '0x0000000000000000000000000000000000000001',
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
        ensName={ensName}
        handleNameChange={handleNameChange}
        // details={details ? details : ''}
        // handleDetailsChange={handleDetailsChange}
        handleShuffle={handleShuffle}
        // Goal
        depositTokenLogo="/images/prodTokenLogos/USDCoin.svg"
        depositTokenSymbol="USDC"
        commitmentGoal={commitmentGoal ? commitmentGoal : ''}
        handleCommitmentGoalChange={handleCommitmentGoalChange}
        commitmentGoalTokenSymbol={commitmentGoalTokenSymbol}
        minimumCommitment={minimumCommitment ? minimumCommitment : ''}
        handleMinimumCommitmentChange={handleMinimumCommitmentChange}
        tokenSymbol={tokenSymbol ? tokenSymbol : ''}
        handleTokenClick={(): void => {
          alert('Change token');
        }}
        handleTokenSymbolChange={handleTokenSymbolChange}
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
        endTime={endTime}
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

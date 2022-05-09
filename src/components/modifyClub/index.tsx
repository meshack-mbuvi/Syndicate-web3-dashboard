import { MintPolicyContract } from '@/ClubERC20Factory/policyMintERC20';
import { ProgressModal, ProgressModalState } from '@/components/progressModal';
import { Switch, SwitchType } from '@/components/switch';
import EstimateGas from '@/containers/createInvestmentClub/gettingStarted/estimateGas';
import { SettingsDisclaimerTooltip } from '@/containers/createInvestmentClub/shared/SettingDisclaimer';
import { useIsClubOwner } from '@/hooks/useClubOwner';
import { useDemoMode } from '@/hooks/useDemoMode';
import { AppState } from '@/state';
import { setClubCreationReceipt } from '@/state/createInvestmentClub/slice';
import {
  setExistingAmountRaised,
  setExistingMaxAmountRaising,
  setExistingMaxNumberOfMembers,
  setExistingNumberOfMembers,
  setExistingOpenToDepositsUntil
} from '@/state/modifyClubSettings/slice';
import { Status } from '@/state/wallet/types';
import { getWeiAmount } from '@/utils/conversions';
import {
  floatedNumberWithCommas,
  numberInputRemoveCommas,
  numberStringInputRemoveCommas
} from '@/utils/formattedNumbers';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SkeletonLoader } from 'src/components/skeletonLoader';
import { Callout } from '../callout';
import { EmailSupport } from '../emailSupport';
import { ExternalLinkColor } from '../iconWrappers';
import { InputFieldWithButton } from '../inputs/inputFieldWithButton';
import { InputFieldWithDate } from '../inputs/inputFieldWithDate';
import { InputFieldWithToken } from '../inputs/inputFieldWithToken';
import { AmountAndMembersDisclaimer } from '@/containers/managerActions/mintAndShareTokens/AmountAndMembersDisclaimer';
import { PillButtonLarge } from '../pillButtons/pillButtonsLarge';

const progressModalStates = {
  confirm: {
    title: 'Confirm in wallet',
    description: 'Confirm the modification of club settings in your wallet',
    state: ProgressModalState.CONFIRM,
    buttonLabel: ''
  },
  success: {
    title: 'Settings successfully modified',
    description: '',
    state: ProgressModalState.SUCCESS,
    buttonLabel: 'Back to club dashboard'
  },
  pending: {
    title: 'Pending confirmation',
    description:
      'This could take up to a few minutes depending on network congestion and the gas fees you set. Feel free to leave this screen.',
    state: ProgressModalState.PENDING,
    buttonLabel: 'Back to club dashboard'
  },
  failure: {
    title: 'Transaction failed',
    description: (
      <span>
        Please try again and
        <EmailSupport
          linkText="let us know"
          className="text-blue focus:outline-none mx-1"
        />
        if the issue persists.
      </span>
    ),
    state: ProgressModalState.FAILURE,
    buttonLabel: 'Try again'
  }
};

export const ModifyClubSettings = (props: { isVisible: boolean }) => {
  const { isVisible } = props;

  const dispatch = useDispatch();
  const isDemoMode = useDemoMode();

  const {
    modifyClubSettingsReducer: {
      existingIsOpenToDeposits,
      existingOpenToDepositsUntil,
      existingAmountRaised,
      existingMaxAmountRaising,
      existingMaxNumberOfMembers,
      existingNumberOfMembers
    },
    erc20TokenSliceReducer: {
      erc20Token,
      depositDetails: { depositTokenLogo, depositTokenSymbol }
    },
    web3Reducer: {
      web3: { account, status, web3 }
    }
  } = useSelector((state: AppState) => state);

  const {
    startTime,
    name,
    address,
    memberCount,
    totalSupply,
    endTime,
    owner,
    maxMemberCount,
    maxTotalSupply,
    symbol,
    loading,
    currentMintPolicyAddress,
    depositsEnabled
  } = erc20Token;

  let showMintingForClosedClubDisclaimer = false;
  if (typeof window !== 'undefined') {
    const mintingForClosedClubDetails = JSON.parse(
      localStorage.getItem('mintingForClosedClub')
    );

    if (mintingForClosedClubDetails?.mintingForClosedClub) {
      const { mintingForClosedClub, clubAddress } = mintingForClosedClubDetails;
      showMintingForClosedClubDisclaimer =
        mintingForClosedClub && clubAddress === address;
    }
  }

  // True is ETH, False is USDC
  const [depositTokenType, setDepositTokenType] = useState(true);
  const [isOpenToDeposits, setIsOpenToDeposits] = useState<boolean>(
    existingIsOpenToDeposits
  );
  const [openToDepositsUntil, setOpenToDepositsUntil] = useState<Date>(
    new Date(endTime)
  );
  const [maxAmountRaising, setMaxAmountRaising] =
    useState<number>(maxTotalSupply);
  const [maxNumberOfMembers, setMaxNumberOfMembers] =
    useState<number>(maxMemberCount);
  const [, setTotalDepositsAmount] = useState(0);
  const [transactionHash, setTransactionHash] = useState('');

  // Errors
  const [openToDepositsUntilWarning, setOpenToDepositsUntilWarning] =
    useState(null);
  const [maxAmountRaisingError, setMaxAmountRaisingError] = useState(null);
  const [maxNumberOfMembersError, setMaxNumberOfMembersError] = useState(null);

  // Settings change
  const [areClubChangesAvailable, setAreClubChangesAvailable] =
    useState<boolean>(false);

  const [progressState, setProgressState] = useState<string>('');

  const MAX_MEMBERS_ALLOWED = 99;

  const router = useRouter();

  const {
    pathname,
    isReady,
    query: { clubAddress }
  } = router;

  const isOwner = useIsClubOwner();

  const handleExit = () => {
    router && router.push(`/clubs/${clubAddress}/manage`);
  };

  useEffect(() => {
    if (
      loading ||
      !clubAddress ||
      status === Status.CONNECTING ||
      !owner ||
      !isReady
    )
      return;

    if ((pathname.includes('/modify') && !isOwner) || isDemoMode) {
      router.replace(`/clubs/${clubAddress}`);
    }
  }, [
    owner,
    clubAddress,
    account,
    loading,
    status,
    isReady,
    isOwner,
    pathname,
    isDemoMode
  ]);

  // makes sure that current settings render when content is available
  useEffect(() => {
    if (name && depositTokenLogo) {
      if (
        existingOpenToDepositsUntil.toUTCString() === new Date(0).toUTCString()
      ) {
        setOpenToDepositsUntil(new Date(endTime));
        const eodToday = new Date(new Date().setHours(23, 59, 0, 0));
        if (new Date(endTime).getTime() < eodToday.getTime()) {
          setIsOpenToDeposits(false);
        } else {
          setOpenToDepositsUntilWarning(null);
          setIsOpenToDeposits(true);
        }
        dispatch(setExistingOpenToDepositsUntil(new Date(endTime)));
      }
      if (existingMaxAmountRaising === 0 && depositTokenSymbol) {
        if (depositTokenSymbol === 'ETH') {
          setMaxAmountRaising(maxTotalSupply / 10000);
          setTotalDepositsAmount(totalSupply / 10000);
          dispatch(setExistingMaxAmountRaising(maxTotalSupply / 10000));
          dispatch(setExistingAmountRaised(totalSupply / 10000));
        } else {
          setMaxAmountRaising(maxTotalSupply);
          setTotalDepositsAmount(totalSupply);
          dispatch(setExistingMaxAmountRaising(maxTotalSupply));
          dispatch(setExistingAmountRaised(totalSupply));
        }
      }
      if (existingMaxNumberOfMembers === 0) {
        setMaxNumberOfMembers(maxMemberCount);
        dispatch(setExistingMaxNumberOfMembers(maxMemberCount));
      }
      setDepositTokenType(depositTokenSymbol === 'ETH');
      dispatch(setExistingNumberOfMembers(memberCount));
    }
  }, [
    name,
    currentMintPolicyAddress,
    depositTokenLogo,
    depositTokenSymbol,
    maxTotalSupply,
    totalSupply,
    depositTokenSymbol,
    endTime,
    maxMemberCount,
    memberCount,
    dispatch,
    existingOpenToDepositsUntil,
    existingMaxAmountRaising,
    existingMaxNumberOfMembers
  ]);

  useEffect(() => {
    // Check that the existing date for when it's open to deposits until,
    // and make sure it's not earlier than today's date
    const eodToday = new Date(new Date().setHours(23, 59, 0, 0));
    if (
      existingOpenToDepositsUntil < eodToday &&
      openToDepositsUntil < eodToday
    ) {
      setOpenToDepositsUntilWarning(
        "You'll need a new date to reopen for deposits"
      );
    } else {
      setOpenToDepositsUntilWarning(null);
    }

    // Make sure there's a settings change and that there are no errors
    if (
      // Check if settings changed
      (existingIsOpenToDeposits !== isOpenToDeposits ||
        Number(existingOpenToDepositsUntil.getTime()) !==
          openToDepositsUntil.getTime() ||
        Number(existingMaxAmountRaising) !==
          Number(numberStringInputRemoveCommas(String(maxAmountRaising))) ||
        Number(existingMaxNumberOfMembers) !== Number(maxNumberOfMembers)) &&
      // Check if there are no errors
      maxAmountRaisingError === null &&
      maxNumberOfMembersError === null &&
      openToDepositsUntilWarning === null
    ) {
      setAreClubChangesAvailable(true);
    } else {
      setAreClubChangesAvailable(false);
    }
  }, [
    isOpenToDeposits,
    openToDepositsUntil,
    maxAmountRaising,
    maxNumberOfMembers,
    existingIsOpenToDeposits,
    existingMaxNumberOfMembers,
    existingMaxAmountRaising,
    existingOpenToDepositsUntil,
    maxAmountRaisingError,
    maxNumberOfMembersError,
    openToDepositsUntilWarning
  ]);

  const onTxConfirm = (transactionHash: string) => {
    setTransactionHash(transactionHash);
    setProgressState('pending');
  };

  const onTxReceipt = (receipt) => {
    dispatch(setClubCreationReceipt(receipt.events.ConfigUpdated.returnValues));
  };

  const handleTransaction = async () => {
    setProgressState('confirm');
    try {
      const updatedEndTime = new Date(openToDepositsUntil);

      const _tokenCap = depositTokenType
        ? getWeiAmount((maxAmountRaising * 10000).toString(), 18, true)
        : getWeiAmount(String(maxAmountRaising), 18, true);

      const mintPolicy = new MintPolicyContract(currentMintPolicyAddress, web3);

      await mintPolicy.modifyERC20(
        account,
        address,
        startTime / 1000,
        updatedEndTime.getTime() / 1000,
        +maxNumberOfMembers,
        _tokenCap,
        onTxConfirm,
        onTxReceipt
      );

      dispatch(setExistingOpenToDepositsUntil(openToDepositsUntil));
      dispatch(setExistingMaxAmountRaising(maxAmountRaising));
      dispatch(setExistingMaxNumberOfMembers(maxNumberOfMembers));
      setProgressState('success');
    } catch (error) {
      setProgressState('failure');
    }
  };

  const ProgressStates = () => {
    if (!progressState) return null;

    if (progressState === 'success' || progressState === 'failure') {
      setTransactionHash('');
    }

    return (
      <ProgressModal
        {...{
          ...progressModalStates[progressState],
          isVisible: true,
          etherscanHash: transactionHash,
          buttonOnClick:
            progressModalStates[progressState].buttonLabel == 'Try again'
              ? () => setProgressState('')
              : handleExit,
          etherscanLinkText: 'View on Etherscan',
          iconColor: ExternalLinkColor.BLUE,
          transactionType: 'transaction'
        }}
      />
    );
  };

  return (
    <div className={`${isVisible ? 'block' : 'hidden'}`}>
      {/* Titles and close button */}
      <div className={`flex justify-between items-center mb-10 space-x-3`}>
        {loading ? (
          <div className="flex w-full flex-col">
            <SkeletonLoader width={'full'} height={'6'} />
            <SkeletonLoader width={'full'} height={'8'} />
          </div>
        ) : (
          <div className="space-y-2 sm:w-7/12">
            <div className="flex items-center space-x-6">
              <div className="text-xl">Modify settings</div>
            </div>
            <div className="text-sm text-gray-syn4">
              Submit multiple changes in one on-chain transaction to save on gas
              fees
            </div>
          </div>
        )}

        {loading == false && (
          <PillButtonLarge onClick={handleExit} extraClasses="flex-shrink-0">
            <div>
              {areClubChangesAvailable && isOpenToDeposits
                ? 'Discard & Exit'
                : 'Exit'}
            </div>
            <img src="/images/xmark-gray.svg" className="w-4" alt="cancel" />
          </PillButtonLarge>
        )}
      </div>

      {/* Modal */}
      <div
        className={`bg-gray-syn8 p-6 pb-7 transition-all`}
        style={{ borderRadius: '10px' }}
      >
        {/* Open to deposits */}
        {!loading &&
        (!isOpenToDeposits ||
          existingOpenToDepositsUntil.getTime() <
            new Date(new Date().setHours(23, 59, 0, 0)).getTime()) ? (
          <div
            className="flex justify-between items-center"
            data-tip
            data-for="deposits-switch"
          >
            <div>Open to deposits</div>
            <Switch
              isOn={isOpenToDeposits}
              type={SwitchType.EXPLICIT}
              onClick={() => {
                setIsOpenToDeposits(!isOpenToDeposits);
              }}
            />
          </div>
        ) : null}

        <div
          className={`absolute ${
            !isOpenToDeposits ? 'opacity-100 ' : ''
          }opacity-0`}
        >
          <SettingsDisclaimerTooltip
            id="deposits-switch"
            tip={
              <span data-tip>
                To modify settings, the club <br /> must be open for deposits.
              </span>
            }
          />
        </div>

        <div
          className={`${
            isOpenToDeposits ? 'max-h-2screen' : 'max-h-0'
          } overflow-hidden transition-all duration-700`}
        >
          <div
            className={`${
              isOpenToDeposits ? 'opacity-100' : 'opacity-0'
            } transition-opacity`}
          >
            {/* Open until */}
            <div
              className={`xl:flex xl:justify-between 
              ${
                isOpenToDeposits &&
                existingOpenToDepositsUntil.getTime() <
                  new Date(new Date().setHours(23, 59, 0, 0)).getTime()
                  ? `ml-0 mt-10`
                  : `ml-0 mt-0`
              }`}
            >
              <div className="mb-4 xl:mb-0">Until</div>
              <div className="xl:w-76 mr-6 xl:mr-0">
                {loading ? (
                  <SkeletonLoader
                    width="100%"
                    height="10"
                    borderRadius="rounded-1.5lg"
                  />
                ) : (
                  <InputFieldWithDate
                    selectedDate={
                      openToDepositsUntilWarning ? null : openToDepositsUntil
                    }
                    onChange={(targetDate) => {
                      const eodToday = new Date(
                        new Date().setHours(23, 59, 0, 0)
                      ).getTime();
                      const dateToSet =
                        (targetDate as any) < eodToday ? eodToday : targetDate;
                      setOpenToDepositsUntil(new Date(dateToSet));
                      setOpenToDepositsUntilWarning(null); // clear error if any
                    }}
                    infoLabel={
                      openToDepositsUntilWarning && openToDepositsUntilWarning
                    }
                  />
                )}
              </div>
            </div>

            {/* Max amount raising */}
            <div
              className={`xl:flex xl:justify-between mt-10 ${
                isOpenToDeposits ? `ml-0` : `ml-6`
              }`}
            >
              <div className="mb-4 xl:mb-0">Max amount raising</div>
              <div className="xl:w-76 mr-6 xl:mr-0">
                {loading ? (
                  <SkeletonLoader
                    width="100%"
                    height="10"
                    borderRadius="rounded-1.5lg"
                  />
                ) : (
                  <InputFieldWithToken
                    depositTokenSymbol={depositTokenSymbol}
                    depositTokenLogo={depositTokenLogo}
                    value={String(maxAmountRaising)}
                    onChange={(e) => {
                      const amount = numberInputRemoveCommas(e);
                      if (
                        Number(amount) < existingAmountRaised &&
                        Number(amount) >= 0
                      ) {
                        setMaxAmountRaisingError(
                          'Below the current amount raised. Please withdraw funds first before setting a lower limit.'
                        );
                      } else if (amount < 0 || isNaN(amount)) {
                        setMaxAmountRaisingError('Max amount is required');
                      } else {
                        setMaxAmountRaisingError(null);
                      }
                      setMaxAmountRaising(amount >= 0 ? amount : 0);
                    }}
                    isInErrorState={maxAmountRaisingError}
                    infoLabel={
                      maxAmountRaisingError
                        ? maxAmountRaisingError
                        : `Upper limit of the club’s raise, corresponding to a club token supply of ${
                            depositTokenSymbol === 'ETH'
                              ? floatedNumberWithCommas(
                                  maxAmountRaising * 10000
                                )
                              : floatedNumberWithCommas(maxAmountRaising)
                          } ${symbol}.`
                    }
                  />
                )}
              </div>
            </div>

            {/* Max number of members */}
            <div
              className={`xl:flex xl:justify-between mt-10 ${
                isOpenToDeposits ? `ml-0` : `ml-6`
              }`}
            >
              <div className="mb-4 xl:mb-0">Max number of members</div>
              <div className="xl:w-76 mr-6 xl:mr-0">
                {loading ? (
                  <SkeletonLoader
                    width="100%"
                    height="10"
                    borderRadius="rounded-1.5lg"
                  />
                ) : (
                  <InputFieldWithButton
                    value={String(maxNumberOfMembers)}
                    buttonLabel="Max"
                    buttonOnClick={() => {
                      setMaxNumberOfMembers(99);
                      setMaxNumberOfMembersError(null);
                    }}
                    onChange={(e) => {
                      const numberOfMembers = e.target.value;
                      if (Number(numberOfMembers) < 0) {
                        setMaxNumberOfMembersError(`Number can't be negative`);
                      } else if (
                        isNaN(numberOfMembers) ||
                        Number(numberOfMembers) == 0
                      ) {
                        setMaxNumberOfMembersError(
                          `Please enter a number between 1 and 99`
                        );
                      } else if (
                        Number(numberOfMembers) < existingNumberOfMembers
                      ) {
                        setMaxNumberOfMembersError(
                          `Club already has ${existingNumberOfMembers} members`
                        );
                      } else if (
                        Number(numberOfMembers) > MAX_MEMBERS_ALLOWED
                      ) {
                        setMaxNumberOfMembersError(
                          <div>
                            Between 1 and 99 accepted to maintain investment
                            club status. Reach out to us at{' '}
                            <a
                              href="mailto:hello@syndicate.io"
                              className="text-blue-neptune"
                            >
                              hello@syndicate.io
                            </a>{' '}
                            if you’re looking to involve more members.
                          </div>
                        );
                      } else {
                        setMaxNumberOfMembersError(null);
                      }
                      setMaxNumberOfMembers(
                        Number(
                          `${
                            numberOfMembers > 0 && !isNaN(numberOfMembers)
                              ? numberOfMembers
                              : ''
                          }`
                        )
                      );
                    }}
                    isInErrorState={maxNumberOfMembersError}
                    infoLabel={
                      maxNumberOfMembersError ? (
                        maxNumberOfMembersError
                      ) : (
                        <div>
                          Investment clubs may have up to 99 members{' '}
                          <a
                            href="https://www.sec.gov/reportspubs/investor-publications/investorpubsinvclubhtm.html"
                            className="underline"
                          >
                            according to the SEC
                          </a>
                          . Syndicate encourages all users to consult with their
                          own legal and tax counsel.
                        </div>
                      )
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Since we have the fixed disclaimer fixed at the bottom on mobile, we need some space to allow scrolling */}
      <div
        className={`${
          areClubChangesAvailable ? 'h-80 sm:h-0' : 'h-0'
        } transition-all`}
      ></div>

      {/* Submit changes */}
      <div
        className={`${
          areClubChangesAvailable
            ? `fixed bottom-0 left-0 space-y-6 p-6 pb-8 bg-black bg-opacity-100 sm:bg-opacity-0 sm:p-0 sm:pb-0 ${
                depositsEnabled ? 'sm:mt-10' : 'sm:mt-6'
              } sm:static`
            : 'bg-opacity-0 p-0 pb-0 mt-10 static'
        }`}
      >
        {/* Disclaimer when re-opening club to add new member(s) */}
        <div
          className={`${
            areClubChangesAvailable &&
            isOpenToDeposits &&
            !depositsEnabled &&
            showMintingForClosedClubDisclaimer
              ? 'max-h-2screen'
              : 'max-h-0'
          } transition-all duration-700`}
        >
          <div
            className={`${
              areClubChangesAvailable &&
              isOpenToDeposits &&
              !depositsEnabled &&
              showMintingForClosedClubDisclaimer
                ? 'opacity-100'
                : 'opacity-0'
            } transition-opacity duration-700`}
          >
            <AmountAndMembersDisclaimer />
          </div>
        </div>

        {/* Disclaimer for submitting changes */}
        <div
          className={`${
            areClubChangesAvailable && isOpenToDeposits
              ? 'max-h-2screen'
              : 'max-h-0'
          } transition-all duration-700`}
        >
          <div
            className={`${
              areClubChangesAvailable && isOpenToDeposits
                ? 'opacity-100'
                : 'opacity-0'
            } transition-opacity duration-700`}
          >
            <div className="text-xs text-gray-syn4">
              By submitting these changes, I represent that my access and use of
              Syndicate’s app and its protocol will fully comply with all
              applicable laws and regulations, including United States
              securities laws, and that I will not access or use the protocol to
              conduct, promote, or otherwise facilitate any illegal activity.
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:flex lg:space-x-6 lg:space-y-0">
          {/* Gas fees */}
          <div className="flex-grow">
            <div
              className={`${
                areClubChangesAvailable && isOpenToDeposits
                  ? 'max-h-2screen'
                  : 'max-h-0'
              } transition-all duration-700`}
            >
              <div
                className={`${
                  areClubChangesAvailable && isOpenToDeposits
                    ? 'opacity-100'
                    : 'opacity-0'
                } transition-opacity duration-700`}
              >
                <Callout>
                  <EstimateGas customClasses="bg-opacity-20 rounded-custom w-full flex cursor-default items-center" />
                </Callout>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <button
            onClick={
              areClubChangesAvailable && isOpenToDeposits
                ? handleTransaction
                : null
            }
            className={`${
              areClubChangesAvailable && isOpenToDeposits
                ? 'primary-CTA'
                : 'primary-CTA-disabled'
            } transition-all duration-700 w-full lg:w-auto`}
          >
            Submit changes
          </button>
        </div>
      </div>
      <ProgressStates />
    </div>
  );
};

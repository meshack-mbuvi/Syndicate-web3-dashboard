import { MintPolicyContract } from '@/ClubERC20Factory/policyMintERC20';
import AddToCalendar from '@/components/addToCalendar';
import EstimateGas from '@/components/EstimateGas';
import { ProgressModal } from '@/components/progressModal';
import { Switch, SwitchType } from '@/components/switch';
import TimeField from '@/containers/createInvestmentClub/mintMaxDate/timeField';
import { SettingsDisclaimerTooltip } from '@/containers/createInvestmentClub/shared/SettingDisclaimer';
import { AmountAndMembersDisclaimer } from '@/containers/managerActions/mintAndShareTokens/AmountAndMembersDisclaimer';
import { useTokenOwner } from '@/hooks/clubs/useClubOwner';
import { useDemoMode } from '@/hooks/useDemoMode';
import { ContractMapper } from '@/hooks/useGasDetails';
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
import { DAY_IN_SECONDS } from '@/utils/constants';

import { getWeiAmount } from '@/utils/conversions';
import {
  floatedNumberWithCommas,
  numberInputRemoveCommas,
  numberStringInputRemoveCommas
} from '@/utils/formattedNumbers';
import { getFirstOrString } from '@/utils/stringUtils';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SkeletonLoader } from 'src/components/skeletonLoader';
import { Callout } from '../callout';
import { CTAButton, CTAType } from '../CTAButton';
import { EmailSupport } from '../emailSupport';
import { ExternalLinkColor } from '../iconWrappers';
import { InputFieldWithAddOn } from '../inputs/inputFieldWithAddOn';
import { InputFieldWithDate } from '../inputs/inputFieldWithDate';
import {
  InputFieldWithToken,
  SymbolDisplay
} from '../inputs/inputFieldWithToken';
import { PillButtonLarge } from '../pillButtons/pillButtonsLarge';
import { ProgressState } from '../progressCard';
import { Spinner } from '../shared/spinner';

const progressModalStates = {
  confirm: {
    title: 'Confirm in wallet',
    description: 'Confirm the modification of club settings in your wallet',
    state: ProgressState.CONFIRM,
    buttonLabel: ''
  },
  success: {
    title: 'Settings successfully modified',
    description: '',
    state: ProgressState.SUCCESS,
    buttonLabel: 'Back to club dashboard'
  },
  pending: {
    title: 'Pending confirmation',
    description:
      'This could take up to a few minutes depending on network congestion and the gas fees you set. Feel free to leave this screen.',
    state: ProgressState.PENDING,
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
    state: ProgressState.FAILURE,
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
      depositDetails: { depositTokenLogo, depositTokenSymbol },
      isNewClub
    },
    web3Reducer: {
      web3: { account, status, web3, activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const {
    startTime,
    name,
    address,
    memberCount,
    totalSupply,
    owner,
    maxMemberCount,
    maxTotalSupply,
    symbol,
    loading,
    currentMintPolicyAddress,
    depositsEnabled,
    endTime
  } = erc20Token;

  const { symbol: nativeSymbol, exchangeRate: nativeEchageRate } =
    activeNetwork.nativeCurrency;
  let showMintingForClosedClubDisclaimer = false;

  if (typeof window !== 'undefined') {
    const mintingForClosedClubDetails = JSON.parse(
      localStorage.getItem('mintingForClosedClub') || '{}'
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

  // time check states
  const [closeTime, setCloseTime] = useState('');
  const [closeDate, setCloseDate] = useState(0);
  const [closeTimeError, setCloseTimeError] = useState('');
  const [warning, setWarning] = useState('');
  const [currentTime, setCurrentTime] = useState(0);

  const MAX_MEMBERS_ALLOWED = 99;

  const router = useRouter();

  const { pathname, isReady } = router;

  const clubAddress = getFirstOrString(router.query.clubAddress);

  const { isOwner, isLoading } = useTokenOwner(
    clubAddress as string,
    web3,
    activeNetwork,
    account
  );

  const handleExit = (): void => {
    router &&
      clubAddress &&
      router.push(
        `/clubs/${clubAddress}/manage/${'?chain=' + activeNetwork.network}`
      );
  };

  useEffect(() => {
    if (
      loading ||
      !clubAddress ||
      status === Status.CONNECTING ||
      !owner ||
      !isReady ||
      isLoading
    )
      return;

    if ((pathname.includes('/modify') && !isOwner) || isDemoMode) {
      void router.replace(
        `/clubs/${clubAddress}${'?chain=' + activeNetwork.network}`
      );
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
    isDemoMode,
    isLoading
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
        if (depositTokenSymbol === nativeSymbol) {
          setMaxAmountRaising(maxTotalSupply / nativeEchageRate);
          // @ts-expect-error TS(2532): Object is possibly 'undefined'.
          setTotalDepositsAmount(totalSupply / nativeEchageRate);
          dispatch(
            setExistingMaxAmountRaising(maxTotalSupply / nativeEchageRate)
          );
          // @ts-expect-error TS(2532): Object is possibly 'undefined'.
          dispatch(setExistingAmountRaised(totalSupply / nativeEchageRate));
        } else {
          setMaxAmountRaising(maxTotalSupply);
          // @ts-expect-error TS(2345): Argument of type 'number | undefined' is not assig... Remove this comment to see the full error message
          setTotalDepositsAmount(totalSupply);
          dispatch(setExistingMaxAmountRaising(maxTotalSupply));
          // @ts-expect-error TS(2345): Argument of type 'number | undefined' is not assig... Remove this comment to see the full error message
          dispatch(setExistingAmountRaised(totalSupply));
        }
      }
      if (existingMaxNumberOfMembers === 0) {
        setMaxNumberOfMembers(maxMemberCount);
        dispatch(setExistingMaxNumberOfMembers(maxMemberCount));
      }
      setDepositTokenType(depositTokenSymbol === nativeSymbol);
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
        // @ts-expect-error TS(2345): Argument of type '"You'll need a new date to reope... Remove this comment to see the full error message
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
      openToDepositsUntilWarning === null &&
      !closeTimeError
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
    openToDepositsUntilWarning,
    closeTimeError
  ]);

  const onTxConfirm = (transactionHash: string) => {
    setTransactionHash(transactionHash);
    setProgressState('pending');
  };

  const onTxReceipt = (receipt: any) => {
    dispatch(setClubCreationReceipt(receipt.events.ConfigUpdated.returnValues));
  };

  const handleTransaction = async () => {
    setProgressState('confirm');
    try {
      const updatedEndTime = new Date(openToDepositsUntil);

      const _tokenCap = depositTokenType
        ? getWeiAmount(
            web3,
            (maxAmountRaising * nativeEchageRate).toString(),
            18,
            true
          )
        : getWeiAmount(web3, String(maxAmountRaising), 18, true);

      const mintPolicy = new MintPolicyContract(
        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
        currentMintPolicyAddress,
        web3,
        activeNetwork
      );

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
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          ...progressModalStates[progressState],
          isVisible: true,
          txHash: transactionHash,
          buttonOnClick:
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            progressModalStates[progressState].buttonLabel == 'Try again'
              ? () => setProgressState('')
              : () => handleExit(),
          explorerLinkText: 'View on ',
          iconcolor: ExternalLinkColor.BLUE,
          transactionType: 'transaction'
        }}
      />
    );
  };

  const calendarEvent = {
    title: `${name} closes to deposits on Syndicate`,
    description: '',
    startTime: moment(openToDepositsUntil).valueOf(),
    endTime: moment(moment(openToDepositsUntil).valueOf())
      .add(1, 'days')
      .valueOf(),
    location: ''
  };

  // get specific time changes
  const handleTimeChange = (time: string) => {
    // dispatch new time from here.
    setCloseTime(time);
  };

  const handleDateChange = (targetDate: any) => {
    setCloseDate(targetDate);
  };

  // the value of endTime gets set a few moments later.
  // need to update closeDate and closeTime when it does.
  useEffect(() => {
    if (endTime) {
      setCloseDate(endTime);
      setCloseTime(moment(new Date(endTime)).format('HH:mm'));
    }
  }, [endTime]);

  // check time every 15 seconds
  // can be adjusted depending on how accurate we would want to be.
  const TIME_CHECK_INTERVAL = 15000;
  useEffect(() => {
    const timeUpdate = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, TIME_CHECK_INTERVAL);

    return () => {
      clearInterval(timeUpdate);
    };
  }, []);

  // if the target date is less than the current time,
  // introduce an error.
  useEffect(() => {
    if (openToDepositsUntil.getTime() < currentTime) {
      setCloseTimeError('Close date cannot be in the past');
    } else {
      setCloseTimeError('');
    }
  }, [currentTime, openToDepositsUntil]);

  // extract the date section and then add specific time
  useEffect(() => {
    let targetDate = closeDate;
    if (closeTime && closeDate) {
      const dateString = new Date(closeDate).toDateString();
      targetDate = moment(dateString + ' ' + closeTime).valueOf();
    }

    setOpenToDepositsUntil(new Date(targetDate));
    setOpenToDepositsUntilWarning(null); // clear error if any
  }, [closeDate, closeTime]);

  // add relevant warnings for close time.
  useEffect(() => {
    const inTwentyFourHours = new Date(
      currentTime + DAY_IN_SECONDS * 1000
    ).getTime();
    const threeMonthsAfterToday = +moment(moment(), 'MM-DD-YYYY').add(
      3,
      'months'
    );

    if (+threeMonthsAfterToday < openToDepositsUntil.getTime()) {
      setWarning(
        'Keeping a syndicate open for longer than 3 months could create administrative complexities in managing members and deploying funds.'
      );
    } else if (
      openToDepositsUntil.getTime() > currentTime &&
      openToDepositsUntil.getTime() < inTwentyFourHours
    ) {
      setWarning(
        'Closing a Syndicate within 24 hours restricts the window to deposit for members.'
      );
    } else {
      setWarning('');
    }
  }, [openToDepositsUntil, currentTime]);

  return (
    <div className={`${isVisible ? 'block' : 'hidden'}`}>
      {/* Titles and close button */}
      <div className={`flex justify-between items-center mb-10 space-x-3`}>
        {loading || isLoading ? (
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
      {isLoading || loading ? (
        <div className="flex justify-end h-screen mt-56">
          <Spinner />
        </div>
      ) : (
        <>
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
                    To modify settings, the club <br /> must be open for
                    deposits.
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
                    {loading || isLoading ? (
                      <SkeletonLoader
                        width="100%"
                        height="10"
                        borderRadius="rounded-1.5lg"
                      />
                    ) : (
                      <div>
                        <InputFieldWithDate
                          // @ts-expect-error TS(2345): Argument of type 'Date | null' is not assignable t... Remove this comment to see the full error message
                          selectedDate={
                            openToDepositsUntilWarning
                              ? null
                              : openToDepositsUntil
                          }
                          onChange={(targetDate) =>
                            handleDateChange(targetDate)
                          }
                          // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'string | undefined'.
                          infoLabel={
                            openToDepositsUntilWarning &&
                            openToDepositsUntilWarning
                          }
                        />
                        <div className="mt-2">
                          <TimeField
                            handleTimeChange={handleTimeChange}
                            isInErrorState={Boolean(closeTimeError)}
                          />
                        </div>
                        {!closeTimeError && !warning && (
                          <div className="flex justify-start text-base leading-4 text-blue-navy font-whyte mt-4">
                            <AddToCalendar calEvent={calendarEvent} />
                          </div>
                        )}

                        {(warning || closeTimeError) && (
                          <div
                            className={`${
                              warning &&
                              !closeTimeError &&
                              'text-yellow-warning'
                            } ${
                              closeTimeError ? 'text-red-error' : ''
                            } text-sm w-full mt-2`}
                          >
                            {closeTimeError
                              ? closeTimeError
                              : warning
                              ? warning
                              : ''}
                          </div>
                        )}
                      </div>
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
                    {loading || isLoading ? (
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
                        symbolDisplayVariant={SymbolDisplay.LOGO_AND_SYMBOL}
                        onChange={(e) => {
                          const amount = numberInputRemoveCommas(e);
                          if (
                            Number(amount) < existingAmountRaised &&
                            Number(amount) >= 0
                          ) {
                            setMaxAmountRaisingError(
                              // @ts-expect-error TS(2345): Argument of type '"Below the current amount raised"'... Remove this comment to see the full error message
                              'Below the current amount raised. Please withdraw funds first before setting a lower limit.'
                            );
                            // @ts-expect-error TS(2365): Operator '<' cannot be applied to types 'string' a... Remove this comment to see the full error message
                          } else if (amount < 0 || isNaN(amount)) {
                            // @ts-expect-error TS(2345): Argument of type '"Max amount is required"' is not assignable to par... Remove this comment to see the full error message
                            setMaxAmountRaisingError('Max amount is required');
                          } else {
                            setMaxAmountRaisingError(null);
                          }
                          // @ts-expect-error TS(2365): Operator '<' cannot be applied to types 'string' a... Remove this comment to see the full error message
                          setMaxAmountRaising(amount >= 0 ? amount : 0);
                        }}
                        // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'boolean | un... Remove this comment to see the full error message
                        isInErrorState={maxAmountRaisingError}
                        infoLabel={
                          maxAmountRaisingError
                            ? maxAmountRaisingError
                            : `Upper limit of the club’s raise, corresponding to a club token supply of ${
                                depositTokenSymbol === nativeSymbol
                                  ? floatedNumberWithCommas(
                                      maxAmountRaising * nativeEchageRate
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
                    {loading || isLoading ? (
                      <SkeletonLoader
                        width="100%"
                        height="10"
                        borderRadius="rounded-1.5lg"
                      />
                    ) : (
                      <InputFieldWithAddOn
                        value={String(maxNumberOfMembers)}
                        addOn="Max"
                        addOnOnClick={() => {
                          setMaxNumberOfMembers(99);
                          setMaxNumberOfMembersError(null);
                        }}
                        onChange={(e) => {
                          const numberOfMembers = e.target.value;
                          if (Number(numberOfMembers) < 0) {
                            setMaxNumberOfMembersError(
                              // @ts-expect-error TS(2345): Argument of type "Number can't be negative" is not assignable to par... Remove this comment to see the full error message
                              `Number can't be negative`
                            );
                          } else if (
                            isNaN(numberOfMembers) ||
                            Number(numberOfMembers) == 0
                          ) {
                            setMaxNumberOfMembersError(
                              // @ts-expect-error TS(2345): Argument of type "Please enter a number between 1 and 99" is not assignable to par... Remove this comment to see the full error message
                              `Please enter a number between 1 and 99`
                            );
                          } else if (
                            Number(numberOfMembers) < existingNumberOfMembers
                          ) {
                            setMaxNumberOfMembersError(
                              // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
                              `Club already has ${existingNumberOfMembers} members`
                            );
                          } else if (
                            Number(numberOfMembers) > MAX_MEMBERS_ALLOWED
                          ) {
                            setMaxNumberOfMembersError(
                              // @ts-expect-error TS(2345): Argument of type 'Element' is not assignable to pa... Remove this comment to see the full error message
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
                        // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'boolean | un... Remove this comment to see the full error message
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
                              . Syndicate encourages all users to consult with
                              their own legal and tax counsel.
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
                  By submitting these changes, I represent that my access and
                  use of Syndicate’s app and its protocol will fully comply with
                  all applicable laws and regulations, including United States
                  securities laws, and that I will not access or use the
                  protocol to conduct, promote, or otherwise facilitate any
                  illegal activity.
                </div>
              </div>
            </div>

            <div className="flex flex-col xl:flex-row space-x-0 xl:space-x-6 space-y-6 xl:space-y-0">
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
                      <EstimateGas
                        contract={ContractMapper.MintPolicy}
                        args={{
                          clubAddress,
                          openToDepositsUntil,
                          maxMemberCount,
                          maxTotalSupply
                        }}
                        skipQuery={
                          loading ||
                          !clubAddress ||
                          status === Status.CONNECTING ||
                          !owner ||
                          !isReady ||
                          isNewClub
                        }
                        customClasses="bg-opacity-20 rounded-custom w-full flex cursor-default items-center"
                      />
                    </Callout>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <CTAButton
                type={
                  areClubChangesAvailable && isOpenToDeposits
                    ? CTAType.PRIMARY
                    : CTAType.DISABLED
                }
                onClick={
                  areClubChangesAvailable && isOpenToDeposits
                    ? handleTransaction
                    : null
                }
                extraClasses="transition-all duration-700 w-full lg:w-auto"
              >
                Submit changes
              </CTAButton>
            </div>
          </div>{' '}
          <ProgressStates />
        </>
      )}
    </div>
  );
};

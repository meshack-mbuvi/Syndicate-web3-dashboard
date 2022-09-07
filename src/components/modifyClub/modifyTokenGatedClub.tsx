import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react';
import BackButton from '../buttons/BackButton';
import { CollapsibleTable } from '../collapsibleTable';
import { SkeletonLoader } from '../skeletonLoader';
import { T5, H4 } from '../typography';
import Image from 'next/image';
import { AppState } from '@/state';
import { useDispatch, useSelector } from 'react-redux';
import { getFormattedDateTimeWithTZ } from '@/utils/dateUtils';
import { InputFieldWithDate } from '@/components/inputs/inputFieldWithDate';
import { TimeInputField } from '@/components/inputs/timeInputField';
import { default as _moment } from 'moment-timezone';
import moment from 'moment';
import AddToCalendar from '../addToCalendar';
import {
  InputFieldWithToken,
  SymbolDisplay
} from '../inputs/inputFieldWithToken';
import {
  floatedNumberWithCommas,
  numberInputRemoveCommas
} from '@/utils/formattedNumbers';
import { InputFieldWithButton } from '../inputs/inputFieldWithButton';
import { useRouter } from 'next/router';
import Modal, { ModalStyle } from '@/components/modal';
import { B2 } from '@/components/typography';
import { ProgressCard, ProgressState } from '../progressCard';
import {
  LogicalOperator,
  TokenGateOption
} from '@/state/createInvestmentClub/types';
import { getWeiAmount } from '@/utils/conversions';
import AllowedMembers from '@/containers/createInvestmentClub/membership/allowedMembers';
import { DAY_IN_SECONDS } from '@/utils/constants';
import {
  setExistingOpenToDepositsUntil,
  setExistingIsOpenToDeposits,
  setExistingMaxAmountRaising,
  setExistingAmountRaised,
  setExistingMaxNumberOfMembers,
  setExistingNumberOfMembers,
  setMaxNumberOfMembers,
  setMaxAmountRaising
} from '@/state/modifyClubSettings/slice';
import { setActiveRowIdx } from '@/state/collectiveDetails';
import { EditRowIndex } from '@/state/collectiveDetails/types';
import { ChangeSettingsDisclaimerModal } from '../collectives/changeSettingsDisclaimerModal';
import { BigNumber } from 'bignumber.js';
import { validateAndOrderTokenRules } from '@/utils/mixins/mixinHelpers';
import useIsPolygon from '@/hooks/collectives/useIsPolygon';
import { SUPPORTED_TOKENS } from '@/Networks';
import { getCollectivesDetails, getTokenDetails } from '@/utils/api';
import {
  resetClubCreationReduxState,
  setActiveTokenGateOption,
  setLogicalOperator,
  setTokenRules
} from '@/state/createInvestmentClub/slice';
import { isZeroAddress } from '@/utils';
import { IRequiredTokenRules } from '@/types/modules';
import { useIsClubOwner } from '@/hooks/useClubOwner';
import { Status } from '@/state/wallet/types';
import { useDemoMode } from '@/hooks/useDemoMode';

const MAX_MEMBERS_ALLOWED = 99;

const ModifyTokenGatedClub: React.FC = () => {
  const {
    modifyClubSettingsReducer: {
      existingIsOpenToDeposits,
      existingOpenToDepositsUntil,
      existingAmountRaised,
      existingNumberOfMembers,
      maxNumberOfMembers,
      maxAmountRaising
    },
    erc20TokenSliceReducer: {
      erc20Token: {
        name,
        maxMemberCount,
        maxTotalSupply,
        owner,
        loading,
        startTime,
        endTime,
        totalSupply,
        memberCount
      },
      activeModuleDetails,
      depositDetails: { depositTokenLogo, depositTokenSymbol }
    },
    initializeContractsReducer: {
      syndicateContracts: {
        timeRequirements,
        maxMemberCountMixin,
        maxTotalSupplyMixin,
        tokenGatedMixin,
        guardMixinManager
      }
    },
    web3Reducer: {
      web3: { web3, account, activeNetwork, status }
    },
    collectiveDetailsReducer: { activeRow },
    createInvestmentClubSliceReducer: {
      tokenRules,
      logicalOperator,
      tokenGateOption
    }
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();
  const router = useRouter();
  const { clubAddress } = router.query;
  const { isPolygon } = useIsPolygon();

  const [openToDepositsUntil, setOpenToDepositsUntil] = useState<Date>(
    new Date(endTime)
  );

  // Modal
  const [progressState, setProgressState] = useState<ProgressState>();
  const [progressTitle, setProgressTitle] = useState('');
  const [progressDescription, setProgressDescription] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [isDisclaimerModalVisible, setDisclaimerModal] = useState(false);
  const [isProgressModalVisible, setProgressModal] = useState(false);

  const [isOpenToDeposits, setIsOpenToDeposits] = useState<boolean>(
    existingIsOpenToDeposits
  );

  // Time
  const [closeTime, setCloseTime] = useState('');
  const [closeDate, setCloseDate] = useState(0);

  // Errors
  const [closeTimeError, setCloseTimeError] = useState('');
  const [warning, setWarning] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [maxAmountRaisingError, setMaxAmountRaisingError] = useState(null);
  const [openToDepositsUntilWarning, setOpenToDepositsUntilWarning] =
    useState(null);
  const [maxNumberOfMembersError, setMaxNumberOfMembersError] = useState(null);

  // Settings change
  const [isSubmitDisabled, setSubmitDisabled] = useState(true);

  const calendarEvent = {
    title: `${name} closes to deposits on Syndicate`,
    description: '',
    startTime: moment(openToDepositsUntil).valueOf(),
    endTime: moment(moment(openToDepositsUntil).valueOf())
      .add(1, 'days')
      .valueOf(),
    location: ''
  };

  const isOwner = useIsClubOwner();
  const isDemoMode = useDemoMode();

  const { pathname, isReady } = router;

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
      router.replace(
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
    isDemoMode
  ]);

  const { symbol: nativeSymbol, exchangeRate: nativeEchageRate } =
    activeNetwork.nativeCurrency;

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
          dispatch(setExistingIsOpenToDeposits(false));
        } else {
          setOpenToDepositsUntilWarning(null);
          setIsOpenToDeposits(true);
          dispatch(setExistingIsOpenToDeposits(true));
        }
        dispatch(setExistingOpenToDepositsUntil(new Date(endTime)));
      }
      if (+maxTotalSupply === 0 && depositTokenSymbol) {
        if (depositTokenSymbol === nativeSymbol) {
          dispatch(setMaxAmountRaising(+maxTotalSupply / nativeEchageRate));
          dispatch(setExistingAmountRaised(totalSupply / nativeEchageRate));
        } else {
          dispatch(setMaxAmountRaising(maxTotalSupply));
          dispatch(setExistingMaxAmountRaising(maxTotalSupply));
          dispatch(setExistingAmountRaised(totalSupply));
        }
      }
      if (maxMemberCount === 0) {
        const _memberCount = maxMemberCount
          ? maxMemberCount
          : MAX_MEMBERS_ALLOWED;
        dispatch(setMaxNumberOfMembers(_memberCount));
        dispatch(setExistingMaxNumberOfMembers(_memberCount));
      }
      dispatch(setExistingNumberOfMembers(memberCount));
    }
  }, [
    name,
    depositTokenLogo,
    depositTokenSymbol,
    maxTotalSupply,
    totalSupply,
    maxMemberCount,
    existingOpenToDepositsUntil
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
      (maxTotalSupply !== maxAmountRaising ||
        Number(maxMemberCount) !== Number(maxNumberOfMembers)) /* ||
        TODO: disable submit btn And Estimate Gas
        existingOpenToDepositsUntil.getTime() !==
          openToDepositsUntil.getTime() */ &&
      // Check if there are no errors
      maxAmountRaisingError === null &&
      maxNumberOfMembersError === null &&
      openToDepositsUntilWarning === null &&
      !closeTimeError
    ) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(false); // TODO: [TOKEN-GATING] enable this
    }
  }, [
    openToDepositsUntil,
    maxAmountRaising,
    maxNumberOfMembers,
    existingIsOpenToDeposits,
    existingOpenToDepositsUntil,
    maxAmountRaisingError,
    maxNumberOfMembersError,
    openToDepositsUntilWarning,
    closeTimeError
  ]);

  useEffect(() => {
    const _memberCount = maxMemberCount ? maxMemberCount : MAX_MEMBERS_ALLOWED; // Default is 99 if it wasn't set in Create flow

    dispatch(setMaxNumberOfMembers(_memberCount));
  }, [maxMemberCount]);

  useEffect(() => {
    if (
      activeModuleDetails &&
      activeModuleDetails?.activeMintModuleReqs &&
      depositTokenSymbol
    ) {
      const maxTotalSupplyMintValue =
        activeModuleDetails?.activeMintModuleReqs.maxTotalSupply;

      let _tokencap = getWeiAmount(
        web3,
        new BigNumber(maxTotalSupplyMintValue).toFixed(),
        18,
        false
      );
      if (
        depositTokenSymbol == activeNetwork.nativeCurrency.symbol &&
        activeNetwork.nativeCurrency.name
      ) {
        _tokencap = getWeiAmount(
          web3,
          new BigNumber(maxTotalSupplyMintValue)
            .dividedBy(activeNetwork.nativeCurrency.exchangeRate)
            .toFixed(),
          18,
          false
        );
      }
      dispatch(setMaxAmountRaising(_tokencap));
    }
  }, [
    depositTokenSymbol,
    nativeSymbol,
    maxMemberCount,
    endTime,
    JSON.stringify(activeModuleDetails),
    activeNetwork.nativeCurrency
  ]);

  // if the target date is less than the current time,
  // introduce an error.
  useEffect(() => {
    if (new Date(openToDepositsUntil).getTime() < currentTime) {
      setCloseTimeError('Close date cannot be in the past');
    } else {
      setCloseTimeError('');
    }
  }, [currentTime, openToDepositsUntil, existingIsOpenToDeposits]);

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

  const handleOpenCollective = () => {
    let row = EditRowIndex.Default;

    if (activeRow === EditRowIndex.CloseTimeWindow) {
      row = EditRowIndex.Default;
    } else if (existingIsOpenToDeposits) {
      row = EditRowIndex.CloseTimeWindow;
    } else {
      row = EditRowIndex.Time;
    }

    setActiveRow(row);
    setIsOpenToDeposits(!isOpenToDeposits);
  };

  const handleDisclaimerConfirmation = () => {
    setDisclaimerModal(true);
  };

  const handleSubmit = async () => {
    setDisclaimerModal(false);
    setProgressModal(true);
    setProgressTitle('Confirm in wallet');
    setProgressDescription('Please confirm the changes in your wallet');
    setProgressState(ProgressState.CONFIRM);

    const _startTime = startTime / 1000;
    const _endTime = new Date(openToDepositsUntil).getTime() / 1000;

    const isNativeDeposit =
      depositTokenSymbol == activeNetwork.nativeCurrency.symbol;
    const _tokenCap = isNativeDeposit
      ? getWeiAmount(
          web3,
          new BigNumber(maxAmountRaising)
            .multipliedBy(activeNetwork.nativeCurrency.exchangeRate)
            .toFixed(),
          18,
          true
        )
      : getWeiAmount(web3, new BigNumber(maxAmountRaising).toFixed(), 18, true);

    switch (activeRow) {
      case EditRowIndex.Time:
        if (!timeRequirements || !clubAddress) return;
        await timeRequirements.updateTimeRequirements(
          account,
          clubAddress as string,
          _startTime,
          _endTime,
          onTxConfirm,
          onTxReceipt,
          onTxFail
        );
        break;
      case EditRowIndex.MaxMembers:
        if (!maxMemberCountMixin || !clubAddress) return;
        await maxMemberCountMixin.updateMaxMember(
          account,
          clubAddress as string,
          maxNumberOfMembers,
          onTxConfirm,
          onTxReceipt,
          onTxFail
        );
        break;
      case EditRowIndex.TotalSupply:
        if (!maxTotalSupplyMixin || !clubAddress) return;
        await maxTotalSupplyMixin.updateTotalSupply(
          account,
          clubAddress as string,
          _tokenCap,
          onTxConfirm,
          onTxReceipt,
          onTxFail
        );
        break;
      case EditRowIndex.TokenGate:
        if (!tokenGatedMixin || !clubAddress) return;
        handleTokenGatingUpdates();
        break;
      case EditRowIndex.CloseTimeWindow:
        if (!timeRequirements || !clubAddress) return;
        await timeRequirements.closeTimeWindow(
          account,
          clubAddress as string,
          onTxConfirm,
          onTxReceipt,
          onTxFail
        );
        break;
      default:
        break;
    }
  };

  const onTxConfirm = (txn: string) => {
    setTransactionHash(txn);
    setProgressTitle('Approving');
    setProgressDescription(
      'This could take anywhere from seconds to hours depending on network congestion and gas fees. You can safely leave this page while you wait.'
    );
    setProgressState(ProgressState.PENDING);
  };

  const onTxReceipt = () => {
    setProgressTitle('Settings updated');
    setProgressDescription('');
    setProgressState(ProgressState.SUCCESS);
  };

  const onTxReceiptGuardUpdate = () => {
    setProgressTitle('Confirm in wallet');
    setProgressDescription('Please confirm the changes in your wallet');
    setProgressState(ProgressState.CONFIRM);
  };

  const onTxFail = () => {
    setProgressTitle('Update Failed');
    setProgressDescription('');
    setProgressState(ProgressState.FAILURE);
  };

  const handleTokenGatingUpdates = async () => {
    const mixins = activeModuleDetails?.activeMintModuleReqs?.mixins;

    if (tokenGateOption === TokenGateOption.UNRESTRICTED) {
      const _mixins = mixins.filter(
        (mixin) => mixin !== tokenGatedMixin.address
      );
      await guardMixinManager.updateDefaultMixins(
        account,
        clubAddress as string,
        _mixins,
        onTxConfirm,
        onTxReceipt,
        onTxFail
      );
      return;
    }

    if (!tokenRules.filter((t) => t.name).length) {
      setProgressModal(false);
      return; // TODO [TOKEN GATING] this is hacky. Should be handled by disabling submit button
    }

    const tokens = [];
    const balances = [];
    const logicOperator =
      logicalOperator === LogicalOperator.AND ? true : false;
    const sortedTokenRules = validateAndOrderTokenRules(tokenRules);

    sortedTokenRules.forEach((_token) => {
      tokens.push(
        _token.contractAddress || '0x0000000000000000000000000000000000000000'
      );
      balances.push(
        _token.decimals
          ? getWeiAmount(
              web3,
              new BigNumber(_token.quantity).toFixed(),
              _token.decimals,
              true
            )
          : _token.quantity
      );
    });

    const isClubGated = mixins.find(
      (mixin) => mixin === tokenGatedMixin.address
    );

    if (!isClubGated) {
      await guardMixinManager.updateDefaultMixins(
        account,
        clubAddress as string,
        [...mixins, tokenGatedMixin.address],
        onTxConfirm,
        onTxReceiptGuardUpdate,
        onTxFail
      );
    }

    await tokenGatedMixin.updateTokenGatedRequirements(
      account,
      clubAddress as string,
      logicOperator,
      tokens,
      balances,
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  };

  const setActiveRow = (rowIdx: EditRowIndex) => {
    dispatch(setActiveRowIdx(rowIdx));
  };

  const handleOnChangeAmountRaising = (e) => {
    const amount = numberInputRemoveCommas(e);
    if (Number(amount) < existingAmountRaised && Number(amount) >= 0) {
      setMaxAmountRaisingError(
        'Below the current amount raised. Please withdraw funds first before setting a lower limit.'
      );
    } else if (amount < 0 || isNaN(amount)) {
      setMaxAmountRaisingError('Max amount is required');
    } else {
      setMaxAmountRaisingError(null);
    }
    dispatch(setMaxAmountRaising(amount >= 0 ? amount : 0));
  };

  const cancelEdit = () => {
    dispatch(setMaxAmountRaising(maxTotalSupply));
    dispatch(setMaxNumberOfMembers(maxMemberCount));
    if (activeRow === EditRowIndex.CloseTimeWindow) {
      handleOpenCollective();
      setActiveRow(EditRowIndex.Default);
    }
  };

  const handleOnChangeMaxMembers = (e) => {
    const numberOfMembers = e.target.value;
    if (Number(numberOfMembers) < 0) {
      setMaxNumberOfMembersError(`Number can't be negative`);
    } else if (isNaN(numberOfMembers) || Number(numberOfMembers) == 0) {
      setMaxNumberOfMembersError(`Please enter a number between 1 and 99`);
    } else if (Number(numberOfMembers) < existingNumberOfMembers) {
      setMaxNumberOfMembersError(
        `Club already has ${existingNumberOfMembers} members`
      );
    } else if (Number(numberOfMembers) > MAX_MEMBERS_ALLOWED) {
      setMaxNumberOfMembersError(
        <div>
          Between 1 and 99 accepted to maintain investment club status. Reach
          out to us at{' '}
          <a href="mailto:hello@syndicate.io" className="text-blue-neptune">
            hello@syndicate.io
          </a>{' '}
          if you’re looking to involve more members.
        </div>
      );
    } else {
      setMaxNumberOfMembersError(null);
    }
    dispatch(
      setMaxNumberOfMembers(
        Number(
          `${
            numberOfMembers > 0 && !isNaN(numberOfMembers)
              ? numberOfMembers
              : ''
          }`
        )
      )
    );
  };

  return (
    <div id="ModifyTokenGatedClubSettings">
      <div className="flex justify-between items-center mt-14 space-x-3">
        <div className="space-y-2 sm:w-7/12">
          <div className="flex items-center space-x-6 relative">
            <T5>Settings</T5>
            <div className="absolute top-0">
              {' '}
              <BackButton
                isHidden={loading}
                isSettingsPage={true}
                transform="left-14 top-0"
              />
            </div>
          </div>
          <H4 extraClasses="text-gray-syn4">{name}</H4>
        </div>
      </div>

      <div className="py-16 transition-all flex flex-col space-y-18">
        {loading ? (
          <SkeletonLoader width="50vw" height="50vh" />
        ) : (
          <CollapsibleTable
            title="Open to deposits"
            expander={{
              isExpanded: isOpenToDeposits,
              setIsExpanded: handleOpenCollective,
              showSubmitCTA:
                existingIsOpenToDeposits &&
                isOpenToDeposits !== existingIsOpenToDeposits
            }}
            isSubmitDisabled={isSubmitDisabled}
            cancelEdit={cancelEdit}
            disableHeightUpdate={true}
            handleDisclaimerConfirmation={handleDisclaimerConfirmation}
            rows={[
              {
                title: 'Until',
                value: (
                  <div className="flex flex-col space-y-4">
                    <div>
                      {getFormattedDateTimeWithTZ(
                        +activeModuleDetails?.activeMintModuleReqs?.endTime *
                          1000,
                        'dddd, MMM D, YYYY h:mma zz'
                      )
                        .split(' ')
                        .map((item, index, arr) => {
                          return (
                            <span
                              key={index}
                              className={`${
                                index === arr.length - 1 ? 'text-gray-syn4' : ''
                              }`}
                            >
                              {item}{' '}
                            </span>
                          );
                        })}
                    </div>
                    <div className="text-blue">
                      <AddToCalendar calEvent={calendarEvent} />
                    </div>
                  </div>
                ),
                edit: {
                  isEditable: true,
                  rowIndex: EditRowIndex.Time,
                  handleDisclaimerConfirmation,
                  inputField: (
                    <EditCloseTime
                      isInErrorState={Boolean(closeTimeError)}
                      warning={warning}
                      closeTimeError={closeTimeError}
                      setCloseTime={setCloseTime}
                      setCloseDate={setCloseDate}
                      dateWarning={openToDepositsUntilWarning}
                    />
                  )
                }
              },
              {
                title: 'Max amount raising',
                value: (
                  <div className="flex space-x-2">
                    <div>{floatedNumberWithCommas(maxAmountRaising)}</div>
                    <div>
                      <Image
                        width={20}
                        height={20}
                        src={depositTokenLogo}
                        alt={depositTokenSymbol}
                      />
                    </div>
                    <div>{depositTokenSymbol}</div>
                  </div>
                ),
                edit: {
                  isEditable: true,
                  rowIndex: EditRowIndex.TotalSupply,
                  handleDisclaimerConfirmation,
                  inputField: (
                    <InputFieldWithToken
                      depositTokenSymbol={depositTokenSymbol}
                      depositTokenLogo={depositTokenLogo}
                      value={String(maxAmountRaising)}
                      symbolDisplayVariant={SymbolDisplay.LOGO_AND_SYMBOL}
                      onChange={handleOnChangeAmountRaising}
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
                            } ${depositTokenSymbol}.`
                      }
                    />
                  )
                }
              },
              {
                title: 'Max number of members',
                value: maxNumberOfMembers,
                edit: {
                  isEditable: true,
                  rowIndex: EditRowIndex.MaxMembers,
                  handleDisclaimerConfirmation,
                  inputField: (
                    <InputFieldWithButton
                      value={String(maxNumberOfMembers)}
                      buttonLabel="Max"
                      buttonOnClick={() => {
                        dispatch(setMaxNumberOfMembers(MAX_MEMBERS_ALLOWED));
                        setMaxNumberOfMembersError(null);
                      }}
                      onChange={handleOnChangeMaxMembers}
                    />
                  )
                }
              },
              ...(!isPolygon
                ? [
                    {
                      title: 'Token-gate membership',
                      value: <TokenGatedModules />,
                      edit: {
                        isEditable: true,
                        rowIndex: EditRowIndex.TokenGate,
                        handleDisclaimerConfirmation,
                        inputField: <AllowedMembers />
                      }
                    }
                  ]
                : [])
            ]}
            {...{ activeRow, setActiveRow }}
          />
        )}
      </div>

      <ChangeSettingsDisclaimerModal
        isModalVisible={isDisclaimerModalVisible}
        handleModalClose={() => setDisclaimerModal(false)}
        onClick={() => handleSubmit()}
      />

      <Modal
        show={isProgressModalVisible}
        closeModal={() => setProgressModal(false)}
        showCloseButton={false}
        modalStyle={ModalStyle.DARK}
        customWidth="w-102"
        customClassName="pt-8"
        showHeader={false}
      >
        <ProgressCard
          title={progressTitle}
          description={progressDescription}
          state={progressState}
          transactionHash={transactionHash}
          transactionType="transaction"
          buttonLabel={
            progressState === ProgressState.FAILURE
              ? 'Try Again'
              : progressState === ProgressState.SUCCESS
              ? 'Back to club'
              : ''
          }
          buttonFullWidth={true}
          buttonOnClick={() => {
            if (progressState === ProgressState.FAILURE) {
              setProgressModal(false);
            } else {
              router.push(
                `/clubs/${clubAddress}/manage?chain=${activeNetwork.network}`
              );
              dispatch(resetClubCreationReduxState());
            }
          }}
        />
      </Modal>
    </div>
  );
};

export default ModifyTokenGatedClub;

const EditCloseTime: React.FC<{
  setCloseTime: Dispatch<SetStateAction<string>>;
  setCloseDate: Dispatch<SetStateAction<number>>;
  isInErrorState: boolean;
  warning?: string;
  closeTimeError?: string;
  dateWarning: string;
}> = ({
  dateWarning,
  isInErrorState,
  warning,
  closeTimeError,
  setCloseTime,
  setCloseDate
}) => {
  const {
    erc20TokenSliceReducer: {
      erc20Token: { endTime }
    }
  } = useSelector((state: AppState) => state);

  const [time, setTime] = useState(moment(endTime).format('HH:mm'));
  const [openToDepositsUntil, setOpenToDepositsUntil] = useState<Date>(
    new Date(endTime)
  );

  const onTimeChange = (timeValue: string) => {
    setTime(timeValue);
    setCloseTime(timeValue);
  };

  const handleDateChange = (targetDate) => {
    setCloseDate(targetDate);
    setOpenToDepositsUntil(targetDate);
  };

  const now = new Date();
  const timeZoneString = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const tz = _moment(now).tz(timeZoneString).format('zz');

  return (
    <div className="flex flex-col">
      <div className="flex flex-col sm:flex-row flex-shrink-0 sm:space-x-5">
        <div className="sm:w-1/2 flex-shrink-0">
          <InputFieldWithDate
            onChange={(targetDate) => handleDateChange(targetDate)}
            isInErrorState={isInErrorState}
            selectedDate={dateWarning ? null : openToDepositsUntil}
            infoLabel={dateWarning && dateWarning}
          />
        </div>
        <div className="mt-4 sm:mt-0 sm:w-1/2">
          <TimeInputField
            placeholderLabel="11:59PM"
            onChange={(e) => {
              onTimeChange(e.target.value);
            }}
            extraClasses={`flex w-full min-w-0 text-base font-whyte flex-grow dark-input-field-advanced`}
            value={time}
            currentTimeZone={tz}
            isInErrorState={isInErrorState}
            // infoLabel={error}
          />
        </div>
      </div>
      {(warning || closeTimeError) && (
        <div
          className={`${warning && !closeTimeError && 'text-yellow-warning'} ${
            closeTimeError ? 'text-red-error' : ''
          } text-sm w-full mt-2`}
        >
          {closeTimeError ? closeTimeError : warning ? warning : ''}
        </div>
      )}
    </div>
  );
};

const TokenGatedModules: React.FC = () => {
  const {
    web3Reducer: {
      web3: { web3, activeNetwork }
    },
    erc20TokenSliceReducer: {
      activeModuleDetails: {
        activeMintModuleReqs: {
          requiredTokenRules,
          requiredTokensLogicalOperator,
          requiredTokenGateOption: tokenGateOption
        }
      }
    },
    createInvestmentClubSliceReducer: { tokenRules, logicalOperator }
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setLogicalOperator(
        requiredTokensLogicalOperator ? LogicalOperator.AND : LogicalOperator.OR
      )
    );
  }, [requiredTokensLogicalOperator]);

  useEffect(() => {
    dispatch(setActiveTokenGateOption(tokenGateOption));
  }, [tokenGateOption]);

  useEffect(() => {
    if (requiredTokenRules.length) {
      const chainTokens: typeof SUPPORTED_TOKENS[1 | 4 | 137] =
        SUPPORTED_TOKENS[activeNetwork.chainId] ?? SUPPORTED_TOKENS[1];

      const notFoundTokens: IRequiredTokenRules[] = [];

      const tokens = requiredTokenRules.map((_token) => {
        const contractAddress = isZeroAddress(_token.contractAddress)
          ? ''
          : _token.contractAddress;
        const chainToken = chainTokens.find(
          (t) => t.address.toLowerCase() === contractAddress.toLowerCase()
        );

        if (!chainToken || !chainToken.name) {
          notFoundTokens.push(_token);
          return null;
        } else {
          return {
            name: chainToken.name,
            quantity: getWeiAmount(
              web3,
              new BigNumber(_token.quantity).toFixed(),
              chainToken.decimals,
              false
            ),
            symbol: chainToken.symbol,
            chainId: activeNetwork.chainId,
            contractAddress: _token.contractAddress,
            icon: chainToken.logoURI,
            decimals: chainToken.decimals
          };
        }
      });

      if (notFoundTokens.length) {
        fetchCollectiveDetails(
          notFoundTokens,
          tokens.filter((t) => t?.name)
        );
      } else {
        dispatch(setTokenRules(tokens.filter((t) => t)));
      }
    }
  }, [activeNetwork.chainId, requiredTokenRules]);

  const fetchTokenDetails = useCallback(
    async (notFoundTokens, foundTokens) => {
      const tokens = await Promise.all(
        notFoundTokens.map((token) =>
          getTokenDetails(token.contractAddress, activeNetwork.chainId)
        )
      ).then((res) =>
        res.map((_res) => {
          const quantity = requiredTokenRules.find(
            (t) => t.contractAddress === _res.data.contractAddress
          )?.quantity;

          return {
            icon: _res.data.logo,
            quantity: getWeiAmount(
              web3,
              new BigNumber(quantity).toFixed(),
              _res.data.decimals,
              false
            ),
            name: _res.data.name,
            symbol: _res.data.symbol,
            chainId: activeNetwork.chainId,
            contractAddress: _res.data.contractAddress,
            decimals: _res.data.decimals
          };
        })
      );

      dispatch(
        setTokenRules([...(foundTokens.length && foundTokens), ...tokens])
      );
    },
    [activeNetwork.chainId, requiredTokenRules]
  );

  const fetchCollectiveDetails = useCallback(
    async (tokenAddresses: IRequiredTokenRules[], foundTokens) => {
      const tokens = await getCollectivesDetails(
        tokenAddresses.map((token) =>
          token.contractAddress.toLocaleLowerCase()
        ),
        activeNetwork.chainId
      ).then((res) => res.data.data.syndicateCollectives);

      const _tokens = [];

      if (tokens?.length) {
        _tokens.push(
          ...tokens.map((token) => {
            return {
              name: token.name,
              quantity: +tokenAddresses.find(
                (t) => t.contractAddress === token.contractAddress
              ).quantity,
              symbol: token.symbol,
              chainId: activeNetwork.chainId,
              contractAddress: token.contractAddress,
              icon: '/images/token-gray-5.svg',
              decimals: 0
            };
          })
        );
      }

      const notFoundTokens2 = tokenAddresses.filter((t) =>
        _tokens.every((t2) => !t2.contractAddress.includes(t.contractAddress))
      );

      const tokens2 = [...foundTokens, ..._tokens];

      if (notFoundTokens2.length) {
        fetchTokenDetails(notFoundTokens2, tokens2);
      } else {
        dispatch(setTokenRules(tokens2));
      }
    },
    [activeNetwork.chainId]
  );

  return (
    <B2>
      {tokenGateOption === TokenGateOption.RESTRICTED ? (
        <>
          <span>Yes - Token-gated</span>
          <div className="grid auto-cols-auto sm:flex sm:flex-wrap sm:flex-col">
            {tokenRules
              .filter((token) => token && token.name)
              .map((token, index) => {
                const { name, quantity, icon } = token;
                return (
                  <div
                    key={`${name}-${index}`}
                    className="flex min-w-0 items-center mt-1"
                  >
                    <div className="flex min-w-0 flex-shrink-1 items-center rounded-full bg-gray-syn8 px-4 py-2">
                      <p className="mr-2">{quantity}</p>
                      <div className="relative flex-shrink-0 w-6 h-6">
                        <Image
                          layout="fill"
                          src={icon || '/images/token-gray-5.svg'}
                        />
                      </div>
                      <p className="ml-2 shrink-1 truncate overflow-hidden whitespace-nowrap">
                        {name}
                      </p>
                    </div>
                    {index < tokenRules.length - 1 ? (
                      <p className="mr-2 ml-2 flex-shrink-0">
                        {index === 0
                          ? logicalOperator.toLowerCase()
                          : LogicalOperator.OR.toLowerCase()}
                      </p>
                    ) : null}
                  </div>
                );
              })}
          </div>
        </>
      ) : (
        <span>No - Unrestricted</span>
      )}
    </B2>
  );
};
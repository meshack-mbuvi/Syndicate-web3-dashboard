import { amplitudeLogger, Flow } from '@/components/amplitude';
import { DEPOSIT_WINDOW_CLICK } from '@/components/amplitude/eventNames';
import TimeField from '@/containers/createInvestmentClub/mintMaxDate/timeField';
import { useCreateInvestmentClubContext } from '@/context/CreateInvestmentClubContext';
import { DetailsSteps } from '@/context/CreateInvestmentClubContext/steps';
import { AppState } from '@/state';
import {
  setMintEndTime,
  setMintSpecificEndTime
} from '@/state/createInvestmentClub/slice';
import { mintEndTime } from '@/state/createInvestmentClub/types';
import { CreateFlowStepTemplate } from '@/templates/createFlowStepTemplate';
import { DAY_IN_SECONDS } from '@/utils/constants';
import moment from 'moment';
import { FC, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import { animated, useSpring } from 'react-spring';
import DateCard from './DateCard';

const MintMaxDate: FC<{ className?: string; isReview?: boolean }> = ({
  className,
  isReview
}) => {
  const dispatch = useDispatch();

  const {
    setShowNextButton,
    handleNext,
    currentStep,
    setNextBtnDisabled,
    setShowSaveButton,
    stepsNames,
    setIsCustomDate
  } = useCreateInvestmentClubContext();

  const [warning, setWarning] = useState('');
  const [disableButtons, setDisableButtons] = useState(false);

  const {
    createInvestmentClubSliceReducer: { mintEndTime, mintSpecificEndTime }
  } = useSelector((state: AppState) => state);

  const [closeDate, setCloseDate] = useState(
    new Date(mintEndTime?.value * 1000).toString()
  );
  const [closeTime, setCloseTime] = useState(mintSpecificEndTime);
  const [currentTime, setCurrentTime] = useState(0);
  const [closeTimeError, setCloseTimeError] = useState('');
  // hide next button
  useEffect(() => {
    if (currentStep && currentStep <= 2) {
      setShowNextButton?.(false);
      setDisableButtons(false);
    }
  }, [setShowNextButton, currentStep]);

  useEffect(() => {
    const inTwentyFourHours = new Date(
      currentTime + DAY_IN_SECONDS * 1000
    ).getTime();
    const threeMonthsAfterToday = +moment(moment(), 'MM-DD-YYYY').add(
      3,
      'months'
    );

    if (+threeMonthsAfterToday < +mintEndTime.value) {
      setWarning(
        'Keeping a syndicate open for longer than 3 months could create administrative complexities in managing members and deploying funds.'
      );
    } else if (
      +mintEndTime.value * 1000 > currentTime &&
      +mintEndTime.value * 1000 < inTwentyFourHours
    ) {
      setWarning(
        'Closing a Syndicate within 24 hours restricts the window to deposit for members.'
      );
    } else {
      setWarning('');
    }
  }, [mintEndTime?.value, currentTime]);

  const startDate = moment();
  const futureWeek = +moment(startDate, 'MM-DD-YYYY').add(7, 'days');
  const futureMonth = +moment(startDate, 'MM-DD-YYYY').add(1, 'months');
  const futureThreeMonths = +moment(startDate, 'MM-DD-YYYY').add(3, 'months');

  const mintTimes: mintEndTime[] = [
    {
      mintTime: '1 week',
      value: futureWeek
    },
    {
      mintTime: '1 month',
      value: futureMonth
    },
    {
      mintTime: '3 months',
      value: futureThreeMonths
    },
    {
      mintTime: 'Custom',
      // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'number'.
      value: null
    }
  ];
  // get last element of array
  // use it to hide right border
  const lastMintTime = mintTimes[mintTimes.length - 1];

  const [activeDateCard, setActiveDateCard] = useState<number | null>();
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  const handleSetMintTime = (index: number, mintTime: mintEndTime) => {
    const { value } = mintTime;

    setActiveDateCard(index);
    if (value) {
      setShowCustomDatePicker(false);
      setIsCustomDate?.(false);
      // push amount to the redux store.
      dispatch(
        setMintEndTime({
          ...mintTime,
          value: parseInt((value / 1000).toString()) // convert to seconds.
        })
      );

      if (currentStep == stepsNames?.indexOf(DetailsSteps.DATE)) {
        setTimeout(() => {
          handleNext?.();
          setShowNextButton?.(true);
        }, 400);
      }
    } else {
      // Show custom date picker
      setNextBtnDisabled?.(false);
      setShowNextButton?.(true);
      setShowCustomDatePicker(true);
      setIsCustomDate?.(true);
    }
  };

  const handleDateChange = (targetDate: any) => {
    setCloseDate(targetDate);
  };

  const handleTimeChange = (time: any) => {
    if (time) {
      setCloseTime(time);
      dispatch(setMintSpecificEndTime(time));
    }
  };

  // check time every 15 seconds
  // can be adjusted depending on how accurate we would want to be.
  const TIME_CHECK_INTERVAL = 15000;
  useEffect(() => {
    setCurrentTime(new Date().getTime());
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
    if (mintEndTime?.value * 1000 < currentTime) {
      setCloseTimeError('Close date cannot be in the past.');
      setNextBtnDisabled?.(true);
      setShowSaveButton?.(false);
    } else {
      setCloseTimeError('');
      setNextBtnDisabled?.(false);
      setShowSaveButton?.(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mintEndTime?.value, currentTime]);

  useEffect(() => {
    let targetDate = closeDate;
    if (closeTime && closeDate) {
      // extract the date section and then add specific time
      const dateString = new Date(closeDate).toDateString();
      targetDate = moment(dateString + ' ' + closeTime)
        .valueOf()
        .toString();
    }
    const dateToSet = targetDate
      ? parseInt((+targetDate / 1000).toString())
      : parseInt((new Date().getTime() / 1000 + DAY_IN_SECONDS).toString());
    dispatch(setMintEndTime({ mintTime: 'Custom', value: dateToSet }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeDate, closeTime]);

  const styles = useSpring({
    to: { y: showCustomDatePicker && 0, opacity: 1 },
    from: { y: showCustomDatePicker && -10, opacity: 0.5 },
    duration: 100
  });

  useEffect(() => {
    if (mintEndTime.mintTime === 'Custom') {
      setShowCustomDatePicker(true);
      setIsCustomDate?.(true);
      setShowNextButton?.(true);
      setActiveDateCard(3);
    }
  }, []);

  return (
    <>
      {isReview ? (
        <div className={className}>
          <div className="pb-4">
            <div
              className="flex justify-between items-center border content-center border-gray-24 rounded-md w-full h-14"
              data-tip
              data-for="disclaimer-tip"
            >
              {mintTimes.map(({ mintTime, value }, index) => (
                <button
                  className="flex items-center w-full h-full"
                  key={index}
                  onClick={(e: React.MouseEvent): void => {
                    e.preventDefault();
                    handleSetMintTime(index, { mintTime, value });
                    void amplitudeLogger(DEPOSIT_WINDOW_CLICK, {
                      flow: Flow.CLUB_CREATE,
                      deposit_window: mintTime
                    });
                  }}
                  disabled={disableButtons}
                >
                  <DateCard
                    mintTime={mintTime}
                    isLastItem={mintTime === lastMintTime.mintTime}
                    index={index}
                    activeIndex={activeDateCard ?? 0}
                  />
                </button>
              ))}
            </div>

            {showCustomDatePicker && (
              <div>
                <animated.div
                  // @ts-expect-error TS(2322): Type 'SpringValue<number | false>' is not assign... Remove this comment to see the full error message
                  style={styles}
                  className="pb-2 mt-6 flex items-center justify-between"
                >
                  <div style={{ width: '48%' }}>
                    <div className="pb-2">Close date</div>
                    <div className="">
                      <DatePicker
                        minDate={new Date()}
                        popperProps={{
                          positionFixed: true // use this to make the popper position: fixed
                        }}
                        closeOnScroll={(e) => e.target === document}
                        selected={new Date(mintEndTime?.value * 1000)}
                        onChange={(date: Date | null): void => {
                          if (handleDateChange && date !== null)
                            handleDateChange(+date);
                        }}
                        todayButton="Go to Today"
                        dateFormat="P"
                        formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 1)}
                        showPopperArrow={false}
                        dropdownMode="select"
                        className="focus:border-blue-navy hover:border-gray-syn3 border-gray-24"
                      />
                    </div>
                  </div>
                  <div style={{ width: '48%' }}>
                    <div className="w-full">
                      <div className="pb-2">Time</div>

                      <TimeField
                        handleTimeChange={handleTimeChange}
                        isInErrorState={Boolean(closeTimeError)}
                      />
                    </div>
                  </div>
                </animated.div>
                {(warning || closeTimeError) && (
                  <div
                    className={`${
                      warning && !closeTimeError && 'text-yellow-warning'
                    } ${closeTimeError ? 'text-red-error' : ''} text-sm w-full`}
                  >
                    {closeTimeError ? closeTimeError : warning ? warning : ''}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <CreateFlowStepTemplate
          hideCallouts={false}
          title={'When will deposits close?'}
          activeInputIndex={0}
          showNextButton={true}
          isNextButtonDisabled={false}
          handleNext={handleNext}
          inputs={[
            {
              label: '',
              info: 'Extending the close date will require an on-chain transaction with gas, so aim for further in the future to leave ample time for collection. You can close deposits early if needed.',
              input: (
                <div className={className}>
                  <div className="pb-4">
                    <div className="flex justify-between items-center border content-center border-gray-24 rounded-md w-full h-14">
                      {mintTimes.map(({ mintTime, value }, index) => (
                        <button
                          className="flex items-center w-full h-full"
                          key={index}
                          onClick={(e: React.MouseEvent): void => {
                            e.preventDefault();
                            handleSetMintTime(index, { mintTime, value });
                            void amplitudeLogger(DEPOSIT_WINDOW_CLICK, {
                              flow: Flow.CLUB_CREATE,
                              deposit_window: mintTime
                            });
                          }}
                          disabled={disableButtons}
                        >
                          <DateCard
                            mintTime={mintTime}
                            isLastItem={mintTime === lastMintTime.mintTime}
                            index={index}
                            activeIndex={activeDateCard ?? 0}
                          />
                        </button>
                      ))}
                    </div>

                    {showCustomDatePicker && (
                      <div>
                        <animated.div
                          // @ts-expect-error TS(2322): Type 'SpringValue<number | false>' is not assign... Remove this comment to see the full error message
                          style={styles}
                          className="pb-2 mt-6 flex items-center justify-between"
                        >
                          <div style={{ width: '48%' }}>
                            <div className="pb-2">Close date</div>
                            <div className="">
                              <DatePicker
                                minDate={new Date()}
                                popperProps={{
                                  positionFixed: true // use this to make the popper position: fixed
                                }}
                                closeOnScroll={(e): boolean =>
                                  e.target === document
                                }
                                selected={new Date(mintEndTime?.value * 1000)}
                                onChange={(date: Date | null): void => {
                                  if (handleDateChange && date !== null)
                                    handleDateChange(+date);
                                }}
                                todayButton="Go to Today"
                                dateFormat="P"
                                formatWeekDay={(nameOfDay) =>
                                  nameOfDay.substr(0, 1)
                                }
                                showPopperArrow={false}
                                dropdownMode="select"
                                className="focus:border-blue-navy hover:border-gray-syn3 border-gray-24"
                              />
                            </div>
                          </div>
                          <div style={{ width: '48%' }}>
                            <div className="w-full">
                              <div className="pb-2">Time</div>

                              <TimeField
                                handleTimeChange={handleTimeChange}
                                isInErrorState={Boolean(closeTimeError)}
                              />
                            </div>
                          </div>
                        </animated.div>
                        {(warning || closeTimeError) && (
                          <div
                            className={`${
                              (warning &&
                                !closeTimeError &&
                                'text-yellow-warning') ||
                              ''
                            } ${
                              closeTimeError ? 'text-red-error' : ''
                            } text-sm w-full`}
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
              )
            }
          ]}
        />
      )}
    </>
  );
};

export default MintMaxDate;

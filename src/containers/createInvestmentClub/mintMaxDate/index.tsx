import Fade from '@/components/Fade';
import { useCreateInvestmentClubContext } from '@/context/CreateInvestmentClubContext';
import { AppState } from '@/state';
import {
  setMintEndTime,
  setMintSpecificEndTime
} from '@/state/createInvestmentClub/slice';
import { mintEndTime } from '@/state/createInvestmentClub/types';
import { DAY_IN_SECONDS } from '@/utils/constants';
import moment from 'moment';
import { FC, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import { animated, useSpring } from 'react-spring';
import DateCard from './DateCard';
import { H4 } from '@/components/typography';
import TimeField from '@/containers/createInvestmentClub/mintMaxDate/timeField';
import { DetailsSteps } from '@/context/CreateInvestmentClubContext/steps';
import { amplitudeLogger, Flow } from '@/components/amplitude';
import { DEPOSIT_WINDOW_CLICK } from '@/components/amplitude/eventNames';

const MintMaxDate: FC<{ className?: string }> = ({ className }) => {
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
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    if (currentStep <= 2) {
      // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
      setShowNextButton(false);
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
      // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
      setIsCustomDate(false);
      // push amount to the redux store.
      dispatch(
        setMintEndTime({
          ...mintTime,
          value: parseInt((value / 1000).toString()) // convert to seconds.
        })
      );

      if (currentStep == stepsNames?.indexOf(DetailsSteps.DATE)) {
        setTimeout(() => {
          // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
          handleNext();
          // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
          setShowNextButton(true);
        }, 400);
      }
    } else {
      // Show custom date picker
      // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
      setNextBtnDisabled(false);
      // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
      setShowNextButton(true);
      setShowCustomDatePicker(true);
      // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
      setIsCustomDate(true);
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
      // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
      setNextBtnDisabled(true);
      // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
      setShowSaveButton(false);
    } else {
      setCloseTimeError('');
      // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
      setNextBtnDisabled(false);
      // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
      setShowSaveButton(true);
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
      // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
      setIsCustomDate(true);
      // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
      setShowNextButton(true);
      setActiveDateCard(3);
    }
  }, []);

  return (
    <Fade delay={500}>
      <div className={className}>
        <H4 extraClasses="pb-1">When will deposits close?</H4>
        <div className="text-sm text-gray-syn4 pb-4">
          {' '}
          Extending the close date will require an on-chain transaction with
          gas, so aim for further in the future to leave ample time for
          collection. You can close deposits early if needed.
        </div>
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
                onClick={(e) => {
                  e.preventDefault();
                  handleSetMintTime(index, { mintTime, value });
                  amplitudeLogger(DEPOSIT_WINDOW_CLICK, {
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
                  // @ts-expect-error TS(2345): Argument of type 'number | null |  undefined' is not assig... Remove this comment to see the full error message
                  activeIndex={activeDateCard}
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
                      onChange={(date: Date | null) =>
                        // @ts-expect-error TS(2531): Object is possibly 'null'.
                        handleDateChange(+date as any)
                      }
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
    </Fade>
  );
};

export default MintMaxDate;

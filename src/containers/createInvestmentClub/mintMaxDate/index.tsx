import Fade from "@/components/Fade";
import { useCreateInvestmentClubContext } from "@/context/CreateInvestmentClubContext";
import { AppState } from "@/state";
import { setMintEndTime } from "@/state/createInvestmentClub/slice";
import { mintEndTime } from "@/state/createInvestmentClub/types";
import { DAY_IN_SECONDS } from "@/utils/constants";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { animated, useSpring } from "react-spring";
import DateCard from "./DateCard";

const MintMaxDate: FC<{ className?: string }> = ({ className }) => {
  const dispatch = useDispatch();

  const { setShowNextButton, handleNext, currentStep, setNextBtnDisabled } =
    useCreateInvestmentClubContext();

  const [warning, setWarning] = useState("");
  const [disableButtons, setDisableButtons] = useState(false);

  const {
    createInvestmentClubSliceReducer: { mintEndTime },
  } = useSelector((state: AppState) => state);

  // hide next button
  useEffect(() => {
    if (currentStep <= 2) {
      setShowNextButton(false);
      setDisableButtons(false);
    }
  }, [setShowNextButton, currentStep]);

  useEffect(() => {
    const threeMonthsAfterToday = +moment(moment(), "MM-DD-YYYY").add(
      3,
      "months",
    );

    if (+threeMonthsAfterToday < +mintEndTime.value) {
      setWarning(
        "Keeping a syndicate open for longer than 3 months could create administrative complexities in managing members and deploying funds.",
      );
    } else if (new Date().getTime() > +mintEndTime.value * 1000) {
      setWarning(
        "Closing a Syndicate within 24 hours restricts the window to deposit for members.",
      );
    } else {
      setWarning("");
    }
  }, [mintEndTime]);

  const startDate = moment();
  const futureWeek = +moment(startDate, "MM-DD-YYYY").add(7, "days");
  const futureMonth = +moment(startDate, "MM-DD-YYYY").add(1, "months");
  const futureThreeMonths = +moment(startDate, "MM-DD-YYYY").add(3, "months");

  const mintTimes: mintEndTime[] = [
    {
      mintTime: "1 week",
      value: futureWeek,
    },
    {
      mintTime: "1 month",
      value: futureMonth,
    },
    {
      mintTime: "3 months",
      value: futureThreeMonths,
    },
    {
      mintTime: "Custom",
      value: null,
    },
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
      // setShowNextButton(false);
      // push amount to the redux store.
      dispatch(
        setMintEndTime({
          ...mintTime,
          value: parseInt((value / 1000).toString()), // convert to seconds.
        }),
      );
      setDisableButtons(true);
      if (currentStep == 2) {
        setTimeout(() => {
          handleNext();
          setShowNextButton(true);
        }, 400);
      }
    } else {
      // Show custom date picker
      setNextBtnDisabled(false);
      setShowNextButton(true);
      setShowCustomDatePicker(true);
    }
  };

  const handleDateChange = (targetDate) => {
    // this check prevents using null date which creates date as 01/01/1970
    const eodToday = new Date(new Date().setHours(23, 59, 0, 0)).getTime();
    const date = targetDate < eodToday ? eodToday : targetDate;
    const dateToSet = date
      ? parseInt((date / 1000).toString())
      : parseInt((new Date().getTime() / 1000 + DAY_IN_SECONDS).toString());
    dispatch(setMintEndTime({ mintTime: "Custom", value: dateToSet }));
  };

  const styles = useSpring({
    to: { y: showCustomDatePicker && 0, opacity: 1 },
    from: { y: showCustomDatePicker && -10, opacity: 0.5 },
    duration: 100,
  });

  useEffect(() => {
    if (mintEndTime.mintTime === "Custom") {
      setShowCustomDatePicker(true);
      setShowNextButton(true);
      setActiveDateCard(3);
    }
  }, []);

  return (
    <Fade delay={500}>
      <div className="ml-5">
        <div className={className}>
          <div className="h3 pb-1">When will deposits close?</div>
          <div className="text-sm text-gray-syn4 pb-4">
            {" "}
            Extending the close date will require an on-chain transaction with
            gas, so aim for further in the future to leave ample time for
            collection. You can close deposits early if needed.
          </div>
          <div className="pb-6">
            <div
              className="flex justify-between items-center border content-center border-gray-24 rounded-md w-full h-14"
              data-tip
              data-for="disclaimer-tip"
            >
              {mintTimes.map(({ mintTime, value }, index) => (
                <button
                  className="flex items-center w-full h-full"
                  key={index}
                  onClick={() => {
                    handleSetMintTime(index, { mintTime, value });
                  }}
                  disabled={disableButtons}
                >
                  <DateCard
                    mintTime={mintTime}
                    isLastItem={mintTime === lastMintTime.mintTime}
                    index={index}
                    activeIndex={activeDateCard}
                  />
                </button>
              ))}
            </div>

            {showCustomDatePicker && (
              <animated.div style={styles} className="pb-6">
                <div className="pb-2">Close date</div>
                <div className="">
                  <DatePicker
                    minDate={new Date()}
                    popperProps={{
                      positionFixed: true, // use this to make the popper position: fixed
                    }}
                    closeOnScroll={(e) => e.target === document}
                    selected={new Date(mintEndTime?.value * 1000)}
                    onChange={(date: Date | null) =>
                      handleDateChange(+date as any)
                    }
                    todayButton="Go to Today"
                    dateFormat="P"
                    formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 1)}
                    showPopperArrow={false}
                    dropdownMode="select"
                    className="focus:border-blue-navy hover:border-gray-syn3"
                  />
                </div>
                {warning && (
                  <div className="text-yellow-warning pt-2 text-sm">
                    {warning}
                  </div>
                )}
              </animated.div>
            )}
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default MintMaxDate;

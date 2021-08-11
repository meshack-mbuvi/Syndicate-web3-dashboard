import InputWithPercent from "@/components/inputs/inputWithPercent";
import { useCreateSyndicateContext } from "@/context/CreateSyndicateContext";
import {
  setExpectedAnnualOperatingFees,
  setProfitShareToSyndicateLead,
  setProfitShareToSyndProtocol,
} from "@/redux/actions/createSyndicate/syndicateOnChainData/feesAndDistribution";
import { RootState } from "@/redux/store";
import { classNames } from "@/utils/classNames";
import { PERCENTAGES } from "@/utils/constants";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const options = [PERCENTAGES.HALF, PERCENTAGES.ONE, PERCENTAGES.THREE];

const optionStyles = {
  [PERCENTAGES.HALF]: "rounded-tl-md rounded-bl-md",
  [PERCENTAGES.ONE]: "",
  [PERCENTAGES.THREE]: "border-r-0 rounded-tr-md rounded-br-md",
};

const DistributionShare: React.FC = () => {
  const dispatch = useDispatch();

  const { setButtonsDisabled } = useCreateSyndicateContext();

  const [resetToDefault, setResetToDefault] = useState(false);

  const {
    feesAndDistributionReducer: {
      createSyndicate: {
        feesAndDistribution: {
          syndicateProfitSharePercent,
          expectedAnnualOperatingFees,
          profitShareToSyndicateLead,
        },
      },
    },
  } = useSelector((state: RootState) => state);

  const [annualFeesCustomError, setAnnualFeesCustomError] = useState("");
  const [profitShareToLeadCustomError, setProfitShareToLeadCustomError] =
    useState("");
  const [
    profitShareToSyndicateCustomError,
    setProfitShareToSyndicateCustomError,
  ] = useState("");
  const [buttonOptionError, setButtonOptionError] = useState("");

  useEffect(() => {
    if (
      annualFeesCustomError ||
      profitShareToLeadCustomError ||
      profitShareToSyndicateCustomError ||
      buttonOptionError
    ) {
      setButtonsDisabled(true);
    } else {
      setButtonsDisabled(false);
    }
    return () => {
      setButtonsDisabled(false);
    };
  }, [
    annualFeesCustomError,
    profitShareToLeadCustomError,
    profitShareToSyndicateCustomError,
    buttonOptionError,
  ]);

  useEffect(() => {
    if (isNaN(syndicateProfitSharePercent)) {
      dispatch(setProfitShareToSyndProtocol(PERCENTAGES.HALF));
    }
  }, [syndicateProfitSharePercent, dispatch]);

  const handleSetExpectedAnnualOperatingFees = (value: number) => {
    dispatch(setExpectedAnnualOperatingFees(value));

    setProfitShareToLeadCustomError("");
    setProfitShareToSyndicateCustomError("");
    setButtonOptionError("");

    // check whether total percentage exceeds 100%
    const allowedPercent =
      100 - (syndicateProfitSharePercent + +profitShareToSyndicateLead);
    if (+value > allowedPercent) {
      setAnnualFeesCustomError(
        `Expected annual operating fees cannot exceed ${allowedPercent.toFixed(
          2,
        )}%. The sum of all distribution share values must not exceed 100%`,
      );
    } else {
      setAnnualFeesCustomError("");
    }
  };

  const handleSetProfitShareToSyndicateLead = (value: number) => {
    dispatch(setProfitShareToSyndicateLead(value));
    // Clear errors on other input fields
    setAnnualFeesCustomError("");
    setProfitShareToSyndicateCustomError("");
    setButtonOptionError("");

    const allowedPercent =
      100 - (syndicateProfitSharePercent + +expectedAnnualOperatingFees);
    if (+value > allowedPercent) {
      setProfitShareToLeadCustomError(
        `Share of distributions to Syndicate Lead cannot exceed ${allowedPercent.toFixed(
          2,
        )}%. The sum of all distribution share values must not exceed 100%`,
      );
    } else {
      setProfitShareToLeadCustomError("");
    }
  };

  const handleSetProfitShareToSyndProtocol = (value: number) => {
    dispatch(setProfitShareToSyndProtocol(value));
    setProfitShareToLeadCustomError("");
    setAnnualFeesCustomError("");
    setButtonOptionError("");

    const allowedPercent =
      100 - (profitShareToSyndicateLead + +expectedAnnualOperatingFees);

    if (+value > allowedPercent) {
      setProfitShareToSyndicateCustomError(
        `Share of distributions to Syndicate Protocol cannot exceed ${allowedPercent.toFixed(
          2,
        )}%. The sum of all distribution share values must not exceed 100%`,
      );
    } else {
      setProfitShareToSyndicateCustomError("");
    }
  };

  const handleTogglePercentages = (option: number) => {
    dispatch(setProfitShareToSyndProtocol(option));

    setProfitShareToLeadCustomError("");
    setAnnualFeesCustomError("");
    setProfitShareToSyndicateCustomError("");

    const allowedPercent =
      100 - (profitShareToSyndicateLead + +expectedAnnualOperatingFees);

    if (+option > allowedPercent) {
      setButtonOptionError(
        `Share of distributions to Syndicate Protocol cannot exceed ${allowedPercent.toFixed(
          2,
        )}%. The sum of all distribution share values must not exceed 100%`,
      );
    } else {
      setButtonOptionError("");
    }
    setResetToDefault(true);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="mb-10 text-2xl leading-8">Distribution share</div>

      <div className="w-full">
        <InputWithPercent
          name="expectedAnnualOperatingFees"
          label="Expected annual operating fees"
          setInputValue={handleSetExpectedAnnualOperatingFees}
          placeholder="0%"
          storedValue={expectedAnnualOperatingFees}
          customError={annualFeesCustomError}
        />

        <InputWithPercent
          name="profitShareToSyndicateLead"
          label="Share of distributions to syndicate lead"
          setInputValue={handleSetProfitShareToSyndicateLead}
          placeholder="0%"
          storedValue={profitShareToSyndicateLead}
          customError={profitShareToLeadCustomError}
        />

        <div className="mb-7">
          <label className="text-base" htmlFor="syndicateProfitSharePercent">
            Share of distributions to Syndicate Protocol
          </label>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div className="grid grid-cols-3 mb-5  flex-grow col-span-2 rounded-md bg-black border border-gray-24 text-lg first:rounded-tl-md first:rounded-bl-md">
              {options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleTogglePercentages(option)}
                  className={classNames(
                    syndicateProfitSharePercent === option
                      ? "bg-blue-navy"
                      : "",
                    optionStyles[option],
                    "justify-center border-0 border-r-1 border-gray-24 focus:outline-none",
                  )}
                >
                  {option}%
                </button>
              ))}
            </div>
            <div className="col-span-1">
              <InputWithPercent
                name="profitShareToSyndProtocol"
                classnames=""
                placeholder="Other"
                min={0.5}
                resetToDefault={resetToDefault}
                setResetToDefault={setResetToDefault}
                setInputValue={handleSetProfitShareToSyndProtocol}
                customError={profitShareToSyndicateCustomError}
                storedValue={
                  !options.some(
                    (option) => option === syndicateProfitSharePercent,
                  )
                    ? syndicateProfitSharePercent
                    : undefined
                }
              />
            </div>
          </div>
          <div className="w-full">
            <p className="text-red-500 text-xs h-4 -mt-4">
              {buttonOptionError}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionShare;

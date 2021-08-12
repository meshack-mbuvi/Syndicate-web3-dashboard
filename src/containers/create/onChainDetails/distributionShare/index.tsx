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

  useEffect(() => {
    const totalDistributions =
      +syndicateProfitSharePercent + +profitShareToSyndicateLead;

    const allowedPercent = 100 - +syndicateProfitSharePercent;

    if (totalDistributions >= 100) {
      const errorMessage = `Share of distributions to syndicate lead cannot exceed ${allowedPercent.toFixed(
        2,
      )}%. The sum of all distribution share values must not exceed 100%.`;
      setButtonsDisabled(true);
      setProfitShareToLeadCustomError(errorMessage);
    } else {
      setButtonsDisabled(false);
      setProfitShareToLeadCustomError("");
    }

    return () => {
      setButtonsDisabled(false);
    };
  }, []);

  const [profitShareToLeadCustomError, setProfitShareToLeadCustomError] =
    useState("");
  const [
    profitShareToSyndicateCustomError,
    setProfitShareToSyndicateCustomError,
  ] = useState("");
  const [buttonOptionError, setButtonOptionError] = useState("");

  useEffect(() => {
    if (
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
  };

  const handleSetProfitShareToSyndicateLead = (value: number) => {
    dispatch(setProfitShareToSyndicateLead(value));
    // Clear errors on other input fields
    setProfitShareToSyndicateCustomError("");
    setButtonOptionError("");

    const allowedPercent = 100 - +syndicateProfitSharePercent;
    if (+value > allowedPercent) {
      setProfitShareToLeadCustomError(
        `Share of distributions to Syndicate Lead cannot exceed ${allowedPercent.toFixed(
          2,
        )}%. The sum of all distribution share values must not exceed 100%.`,
      );
      setButtonsDisabled(true);
    } else {
      setProfitShareToLeadCustomError("");
      setButtonsDisabled(false);
    }
  };

  const handleSetProfitShareToSyndProtocol = (value: number) => {
    dispatch(setProfitShareToSyndProtocol(value));
    setProfitShareToLeadCustomError("");
    setButtonOptionError("");

    const allowedPercent = 100 - +profitShareToSyndicateLead;

    if (+value > allowedPercent) {
      setProfitShareToSyndicateCustomError(
        `Share of distributions to Syndicate Protocol cannot exceed ${allowedPercent.toFixed(
          2,
        )}%. The sum of all distribution share values must not exceed 100%.`,
      );
      setButtonsDisabled(true);
    } else {
      setProfitShareToSyndicateCustomError("");
      setButtonsDisabled(false);
    }
  };

  const handleTogglePercentages = (option: number) => {
    dispatch(setProfitShareToSyndProtocol(option));

    setProfitShareToLeadCustomError("");
    setProfitShareToSyndicateCustomError("");

    const allowedPercent = 100 - +profitShareToSyndicateLead;

    if (+option + +profitShareToSyndicateLead > 100) {
      const setValueTo = +profitShareToSyndicateLead - +option + allowedPercent;

      setButtonOptionError(
        `Set share of distributions to syndicate lead to ${setValueTo.toFixed(
          2,
        )}%. The sum of all distribution share values must not exceed 100%.`,
      );
    } else {
      setButtonOptionError("");
    }
    setResetToDefault(true);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="mb-7 text-2xl leading-8">Distribution share</div>

      <div className="w-full space-y-3">
        <InputWithPercent
          name="expectedAnnualOperatingFees"
          label="Expected annual operating fees"
          setInputValue={handleSetExpectedAnnualOperatingFees}
          placeholder="0%"
          storedValue={expectedAnnualOperatingFees}
        />

        <InputWithPercent
          name="profitShareToSyndicateLead"
          label="Share of distributions to syndicate lead"
          setInputValue={handleSetProfitShareToSyndicateLead}
          placeholder="0%"
          max={99.5}
          storedValue={profitShareToSyndicateLead}
          customError={profitShareToLeadCustomError}
        />

        <div className="mb-7">
          <label className="text-base" htmlFor="syndicateProfitSharePercent">
            Share of distributions to Syndicate Protocol
          </label>
          <div className="grid grid-cols-3 gap-4 mt-1">
            <div className="grid grid-cols-3 mb-5 h-14  flex-grow col-span-2 rounded-md bg-black border border-gray-24 text-sm first:rounded-tl-md first:rounded-bl-md">
              {options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleTogglePercentages(option)}
                  className={classNames(
                    syndicateProfitSharePercent === option
                      ? "bg-blue-navy"
                      : "",
                    optionStyles[option],
                    "relative borderLeft bg-clip-padding bg-origin-padding w-full justify-center focus:outline-none",
                  )}
                >
                  {option}%
                </button>
              ))}
            </div>
            <div className="col-span-1">
              <InputWithPercent
                name="profitShareToSyndProtocol"
                placeholder="Other"
                min={0.5}
                resetToDefault={resetToDefault}
                setResetToDefault={setResetToDefault}
                setInputValue={handleSetProfitShareToSyndProtocol}
                customError={profitShareToSyndicateCustomError}
                centerText={true}
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
            <p className="text-red-500 text-xs h-4 -mt-8">
              {buttonOptionError}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionShare;

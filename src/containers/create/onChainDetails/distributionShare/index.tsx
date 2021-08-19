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
import { ContentTitle } from "../../shared";

const options = [PERCENTAGES.HALF, PERCENTAGES.ONE, PERCENTAGES.THREE];

const optionStyles = {
  [PERCENTAGES.HALF]: "rounded-tl-md rounded-bl-md",
  [PERCENTAGES.ONE]: "",
  [PERCENTAGES.THREE]: "",
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

  var isStoredValueATogglePreset = options.some(
    (option) => option === syndicateProfitSharePercent,
  )
  var shouldShowOtherPercentageInput = !isStoredValueATogglePreset && syndicateProfitSharePercent !== undefined
  const [isOtherPercentageInputVisible, setOtherPercentageInputVisibility] = useState(shouldShowOtherPercentageInput);

  useEffect(() => {
    const totalDistributions =
      +syndicateProfitSharePercent + +profitShareToSyndicateLead;

    const allowedPercent = 100 - +syndicateProfitSharePercent;

    if (totalDistributions > 100) {
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

  useEffect(() => {
    if (profitShareToLeadCustomError) {
      setButtonsDisabled(true);
    } else {
      setButtonsDisabled(false);
    }
    return () => {
      setButtonsDisabled(false);
    };
  }, [profitShareToLeadCustomError]);

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

    const allowedPercent = 100 - +profitShareToSyndicateLead;

    if (+value + +profitShareToSyndicateLead > 100) {
      const setValueTo = +profitShareToSyndicateLead - +value + allowedPercent;
      setProfitShareToLeadCustomError(
        `Set share of distributions to syndicate lead to ${setValueTo.toFixed(
          2,
        )}%. The sum of all distribution share values must not exceed 100%.`,
      );
      setButtonsDisabled(true);
    } else {
      setProfitShareToLeadCustomError("");
      setButtonsDisabled(false);
    }
  };

  const handleTogglePercentages = (option: number) => {
    dispatch(setProfitShareToSyndProtocol(option));

    setProfitShareToLeadCustomError("");

    const allowedPercent = 100 - +profitShareToSyndicateLead;

    if (+option + +profitShareToSyndicateLead > 100) {
      const setValueTo = +profitShareToSyndicateLead - +option + allowedPercent;

      setProfitShareToLeadCustomError(
        `Set share of distributions to syndicate lead to ${setValueTo.toFixed(
          2,
        )}%. The sum of all distribution share values must not exceed 100%.`,
      );
    } else {
      setProfitShareToLeadCustomError("");
    }
    setResetToDefault(true);
  };

  return (
    <div className="flex flex-col w-full">
      <ContentTitle>Distribution share</ContentTitle>

      <div className="w-full space-y-7 px-1">
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
          <div className="mt-2">
            <div className="grid grid-cols-4 rounded-md bg-black border border-gray-24 first:rounded-tl-md first:rounded-bl-md">
              {options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (isOtherPercentageInputVisible) {setOtherPercentageInputVisibility(false)}
                    handleTogglePercentages(option)
                  }}
                  className={classNames(
                    syndicateProfitSharePercent === option && !isOtherPercentageInputVisible ? "bg-blue" : "",
                    optionStyles[option],
                    "relative borderLeft bg-clip-padding py-3 bg-origin-padding w-full justify-center focus:outline-none",
                  )}
                >
                  {option}
                  {" %"}
                </button>
              ))}
              <button
                onClick={() => setOtherPercentageInputVisibility(true)}
                className={`${isOtherPercentageInputVisible && "bg-blue bottom-triangle-blue"} borderLeft py-3 bg-origin-padding bg-clip-padding relative rounded-tr-md rounded-br-md`}
              >
                Other
              </button>
            </div>
            <div className={`h-12 mt-3 ${isOtherPercentageInputVisible ? "opacity-100" : "opacity-0"} transition-all`}>
              <InputWithPercent
                name="profitShareToSyndProtocol"
                placeholder={String(syndicateProfitSharePercent) + "%"}
                min={0.5}
                resetToDefault={resetToDefault}
                setResetToDefault={setResetToDefault}
                setInputValue={handleSetProfitShareToSyndProtocol}
                storedValue={
                  !isStoredValueATogglePreset
                    ? syndicateProfitSharePercent
                    : undefined
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionShare;

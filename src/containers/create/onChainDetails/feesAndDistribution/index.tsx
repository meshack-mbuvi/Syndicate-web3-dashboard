import InputWithPercent from "@/components/inputs/inputWithPercent";
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

const FeesAndDistribution: React.FC = () => {
  const dispatch = useDispatch();

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
    if (isNaN(syndicateProfitSharePercent)) {
      dispatch(setProfitShareToSyndProtocol(PERCENTAGES.HALF));
    }
  }, [syndicateProfitSharePercent, dispatch]);

  const handleSetExpectedAnnualOperatingFees = (value: number) => {
    dispatch(setExpectedAnnualOperatingFees(value));
  };

  const handleSetProfitShareToSyndicateLead = (value: number) => {
    dispatch(setProfitShareToSyndicateLead(value));
  };

  const handleSetProfitShareToSyndProtocol = (value: number) => {
    dispatch(setProfitShareToSyndProtocol(value));
  };

  const handleTogglePercentages = (option: number) => {
    dispatch(setProfitShareToSyndProtocol(option));
    setResetToDefault(true);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="mb-10 text-2xl leading-8">
        Fees and distribution share
      </div>

      <div className="w-full">
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
          storedValue={profitShareToSyndicateLead}
        />

        <div className="mb-7">
          <label className="text-base" htmlFor="syndicateProfitSharePercent">
            Share of distributions to Syndicate Protocol
          </label>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div className="grid grid-cols-3 flex-grow col-span-2 rounded-md bg-black border border-gray-24 text-lg first:rounded-tl-md first:rounded-bl-md">
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
        </div>
      </div>
    </div>
  );
};

export default FeesAndDistribution;

import { InputField } from "@/components/inputs/inputField";
import { useCreateSyndicateContext } from "@/context/CreateSyndicateContext";
import {
  setDepositMemberMax,
  setDepositMemberMin,
  setDepositMembersMax,
  setDepositTotalMax,
} from "@/redux/actions/createSyndicate/syndicateOnChainData/tokenAndDepositsLimits";
import { RootState } from "@/redux/store";
import {
  numberInputRemoveCommas,
  numberWithCommas,
} from "@/utils/formattedNumbers";
import { isWholeNumber, Validate } from "@/utils/validators";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ContentTitle } from "../../shared";
import { TokenSelectInput } from "./tokenSelectInput";

const DepositTokenAndLimit: React.FC = () => {
  const {
    tokenAndDepositLimitReducer: {
      createSyndicate: {
        tokenAndDepositsLimits: {
          depositTotalMax,
          numMembersMax,
          depositMemberMin,
          depositMemberMax,
          depositTokenDetails: {
            depositTokenName,
            depositTokenSymbol,
            depositTokenLogo,
          },
        },
      },
    },
  } = useSelector((state: RootState) => state);

  const { buttonsDisabled, setContinueDisabled } = useCreateSyndicateContext();

  // error messages
  const [maxTotalDepositsError, setMaxTotalDepositsError] = useState("");
  const [depositsNumbMaxError, setDepositsNumbMaxError] = useState("");
  const [depositMemberMinError, setDepositMemberMinError] = useState("");
  const [depositMemberMaxError, setDepositMemberMaxError] = useState("");

  useEffect(() => {
    // disable buttons if no token is selected or errors
    if (!buttonsDisabled && !depositTokenName) {
      setContinueDisabled(true);
    } else if (
      maxTotalDepositsError ||
      depositsNumbMaxError ||
      depositMemberMinError ||
      depositMemberMaxError
    ) {
      setContinueDisabled(true);
    } else if (
      buttonsDisabled &&
      depositTokenName &&
      (!maxTotalDepositsError ||
        !depositsNumbMaxError ||
        !depositMemberMinError ||
        !depositMemberMaxError)
    ) {
      setContinueDisabled(false);
    }
    return () => {
      setContinueDisabled(false);
    };
  }, [
    buttonsDisabled,
    depositMemberMaxError,
    depositMemberMinError,
    depositTokenName,
    depositsNumbMaxError,
    maxTotalDepositsError,
    setContinueDisabled,
  ]);

  useEffect(() => {
    if (depositTotalMax && +depositTotalMax < +depositMemberMin) {
      setMaxTotalDepositsError(
        "Maximum total deposits must not be less than minimum deposit per member",
      );
    } else if (depositTotalMax && +depositTotalMax < +depositMemberMax) {
      setMaxTotalDepositsError(
        "Maximum total deposits must be greater than maximum deposit per member",
      );
    } else {
      setMaxTotalDepositsError("");
    }
    if (+depositMemberMax && +depositMemberMax < +depositMemberMin) {
      setDepositMemberMinError("Value cannot exceed member max deposit");
    } else {
      setDepositMemberMinError("");
    }

    if (
      depositMemberMax &&
      +depositMemberMax <= +depositMemberMin &&
      depositMemberMin
    ) {
      setDepositMemberMaxError("Value should exceed member min deposit");
    } else {
      setDepositMemberMaxError("");
    }

    if (+depositMemberMax === 0 && +depositTotalMax > 0) {
      // we have a user defined deposit total max but deposit member max is unlimited
      setMaxTotalDepositsError(
        "Maximum total deposits must be greater than maximum deposit per member",
      );
    }
  }, [depositMemberMin, depositMemberMax, depositTotalMax]);

  const dispatch = useDispatch();

  const handleDepositMaxTotal = (event) => {
    event.preventDefault();
    const value = numberInputRemoveCommas(event);

    setMaxTotalDepositsError("");
    // value should be set to unlimited once everything is deleted.
    if (!value.trim()) {
      dispatch(setDepositTotalMax(""));

      return;
    }
    dispatch(setDepositTotalMax(value));

    const message = Validate(value);
    if (message) {
      return setMaxTotalDepositsError(`Maximum total deposits ${message}`);
    } else {
      setMaxTotalDepositsError("");
    }
  };

  const handleDepositsNumMax = (event) => {
    event.preventDefault();
    const value = numberInputRemoveCommas(event);

    setDepositsNumbMaxError("");
    // value should be set to unlimited once everything is deleted.
    if (!value.trim()) {
      dispatch(setDepositMembersMax(""));
      return;
    }

    dispatch(setDepositMembersMax(value));
    const checkIsWholeNumber = isWholeNumber(value);

    if (value < 0) {
      setDepositsNumbMaxError("Total members cannot be less than 0");
    } else if (isNaN(value)) {
      setDepositsNumbMaxError("Total members should be a valid number.");
    } else if (!checkIsWholeNumber) {
      setDepositsNumbMaxError(`Total members must be a whole number`);
    } else {
      setDepositsNumbMaxError("");
    }
  };

  const handleDepositMemberMin = (event) => {
    event.preventDefault();
    const value = numberInputRemoveCommas(event);

    setDepositMemberMinError("");

    // value should be set to unlimited once everything is deleted.
    if (!value.trim()) {
      dispatch(setDepositMemberMin(""));
      return;
    }
    dispatch(setDepositMemberMin(value));

    const message = Validate(value);
    if (message) {
      setDepositMemberMinError(`Minimum deposit ${message}`);
    }
  };

  const handleDepositMemberMax = (event) => {
    event.preventDefault();
    const value = numberInputRemoveCommas(event);
    setDepositMemberMaxError("");

    // value should be set to unlimited once everything is deleted.
    if (!value.trim()) {
      dispatch(setDepositMemberMax(""));
      return;
    }
    dispatch(setDepositMemberMax(value));

    const message = Validate(value);

    if (message) {
      setDepositMemberMaxError(`Maximum deposits ${message}`);
    }
  };

  return (
    <div className="flex">
      <div className="">
        <ContentTitle>Deposit token and limits</ContentTitle>

        <div className="w-full space-y-3">
          <TokenSelectInput label="Deposit Token" required />
          <div>
            <InputField
              {...{
                value: numberWithCommas(numMembersMax as string),
                label:
                  "Maximum number of people who can deposit into this syndicate",
                addOn: "People",
                onChange: handleDepositsNumMax,
                error: depositsNumbMaxError,
                placeholder: "Unlimited",
                type: "text",
                isNumber: true,
              }}
            />

            {+numMembersMax > 2000 || !numMembersMax ? (
              <div className="rounded-md p-4 mt-3 font-whyte text-sm text-blue-melanie bg-blue-navy bg-opacity-15">
                <p>
                  US-based companies with 2,000 or more shareholders are
                  considered public companies by the SEC. Public companies must
                  register and follow certain reporting standards and
                  regulations.
                </p>
              </div>
            ) : null}
          </div>

          {/* Minimum and Maximum per depositor */}
          <div className="grid grid-cols-2">
            <div className="mr-4">
              <InputField
                {...{
                  value: numberWithCommas(depositMemberMin),
                  label: "Minimum deposit per depositor",
                  addOn: depositTokenSymbol.toUpperCase(), //This value should be obtained from selected token
                  logo: depositTokenLogo,
                  onChange: handleDepositMemberMin,
                  error: depositMemberMinError,
                  placeholder: "0",
                  type: "text",
                  isNumber: true,
                }}
              />
            </div>

            <div className="ml-4">
              <InputField
                {...{
                  value: numberWithCommas(depositMemberMax),
                  label: "Maximum deposit per depositor",
                  addOn: depositTokenSymbol.toUpperCase(),
                  logo: depositTokenLogo,
                  onChange: handleDepositMemberMax,
                  error: depositMemberMaxError,
                  placeholder: "Unlimited",
                  type: "text",
                  isNumber: true,
                }}
              />
            </div>
          </div>

          <InputField
            {...{
              value: numberWithCommas(depositTotalMax),
              label: "Max total that can be deposited into this syndicate",
              addOn: depositTokenSymbol.toUpperCase(),
              logo: depositTokenLogo,
              onChange: handleDepositMaxTotal,
              error: maxTotalDepositsError,
              placeholder: "Unlimited",
              type: "text",
              isNumber: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DepositTokenAndLimit;

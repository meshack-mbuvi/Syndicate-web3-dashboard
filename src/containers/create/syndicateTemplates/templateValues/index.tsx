import React, { useState, useMemo, useEffect } from "react";
import DatePicker from "react-datepicker";
import { TWO_WEEKS_IN_MS } from "@/utils/constants";
import { getLocaleObject } from "@/utils/dateUtils";
import generateTimeIntervals from "@/utils/generateTimeIntervals";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { InputField } from "@/components/inputs/inputField";
import {
  numberInputRemoveCommas,
  numberWithCommas,
} from "@/utils/formattedNumbers";
import { Validate, validateEmail } from "@/utils/validators";
import {
  setDepositTotalMax,
  setDepositMemberMax,
} from "@/redux/actions/createSyndicate/syndicateOnChainData/tokenAndDepositsLimits";
import {
  setExpectedAnnualOperatingFees,
  setProfitShareToSyndicateLead,
} from "@/redux/actions/createSyndicate/syndicateOnChainData/feesAndDistribution";
import { setEmail } from "@/redux/actions/createSyndicate/syndicateOffChainData";
import { TokenSelectInput } from "@/containers/create/onChainDetails/depositToken/tokenSelectInput";
import { setModifiable } from "@/redux/actions/createSyndicate/syndicateOnChainData/modifiable";
import InputWithPercent from "@/components/inputs/inputWithPercent";
import ct from "countries-and-timezones";
import { NonEditableSetting } from "@/containers/create/shared/NonEditableSetting";
import { useCreateSyndicateContext } from "@/context/CreateSyndicateContext";
import { useRouter } from "next/router";
import { setCloseDateAndTime } from "@/redux/actions/createSyndicate/syndicateOnChainData/closeDateAndTime";
import { SkeletonLoader } from "@/components/skeletonLoader";
import { CustomSelectInput } from "@/containers/create/shared/customSelectInput";

const TemplateValues: React.FC = () => {
  const {
    tokenAndDepositLimitReducer: {
      createSyndicate: {
        tokenAndDepositsLimits: { depositTotalMax },
      },
    },
    feesAndDistributionReducer: {
      createSyndicate: {
        feesAndDistribution: {
          syndicateProfitSharePercent,
          expectedAnnualOperatingFees,
          profitShareToSyndicateLead,
        },
      },
    },
    closeDateAndTimeReducer: {
      createSyndicate: {
        closeDateAndTime: {
          selectedDate: storedSelectedDate,
          selectedTimeValue: storedSelectedTimeValue,
          selectedTimezone: storedSelectedTimezone,
        },
      },
    },
    syndicateOffChainDataReducer: {
      createSyndicate: {
        syndicateOffChainData: { email, syndicateTemplateTitle },
      },
    },
    modifiableReducer: {
      createSyndicate: { modifiable },
    },
  } = useSelector((state: RootState) => state);

  const {
    setContinueDisabled,
    legalEntity,
    setLegalEntity,
  } = useCreateSyndicateContext();

  const dispatch = useDispatch();
  const timeIntervals = useMemo(() => generateTimeIntervals(), []);
  // used as the default date for a syndicates closure
  // close date is set to +2 weeks from current date
  const startDate = new Date(Date.now() + TWO_WEEKS_IN_MS);
  // we get user's locale
  const localeString = new Intl.NumberFormat().resolvedOptions().locale;
  // pass the locale string dateUtils to get locale object
  const locale = getLocaleObject(localeString);
  const timezones = ct.getAllTimezones();
  const formattedTimezones = useMemo(
    () =>
      Object.keys(timezones).map((timezone) => ({
        label: timezones[timezone]?.name,
        value: timezones[timezone]?.name,
        timezone: timezones[timezone]?.utcOffsetStr,
      })),
    [timezones],
  );
  const router = useRouter();

  // state variables
  const [maxTotalDepositsError, setMaxTotalDepositsError] = useState("");
  const [profitShareToLeadCustomError, setProfitShareToLeadCustomError] =
    useState("");
  const [emailError, setEmailError] = useState("");

  const [selectedDate, setSelectedDate] = useState(storedSelectedDate);
  const [selectedTimeValue, setSelectedTimeValue] = useState(
    storedSelectedTimeValue,
  );
  const [selectedTimezone, setSelectedTimezone] = useState<
    Record<"label" | "value" | "timezone", string>
  >(storedSelectedTimezone);

  // redirect to first template page if title is undefined
  useEffect(() => {
    if (!syndicateTemplateTitle) {
      router.replace("/syndicates/create");
    }
  }, [syndicateTemplateTitle]);

  const handleDepositMaxTotal = (event) => {
    event.preventDefault();
    const value = numberInputRemoveCommas(event);

    setMaxTotalDepositsError("");
    // value should be set to unlimited once everything is deleted.
    if (!value.trim()) {
      dispatch(setDepositMemberMax(""));
      dispatch(setDepositTotalMax(""));

      return;
    }
    dispatch(setDepositMemberMax(value));
    dispatch(setDepositTotalMax(value));

    const message = Validate(value);
    if (message) {
      return setMaxTotalDepositsError(`Maximum total deposits ${message}`);
    } else {
      setMaxTotalDepositsError("");
    }
  };

  // // check for errors in value differences
  // useEffect(() => {
  //   if (+depositMemberMax === 0 && +depositTotalMax > 0) {
  //     // we have a user defined deposit total max but deposit member max is unlimited

  //     setMaxTotalDepositsError(
  //       "Max. total deposits must be greater than max. deposit per member. Please adjust max. deposit per member on the next page.",
  //     );
  //     setTemplateMaxTotalError(
  //       "Max. member deposit exceeds max. total deposits. Please adjust it.",
  //     );
  //   } else {
  //     setMaxTotalDepositsError("");
  //   }
  // }, [depositTotalMax]);

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
      // disable continue button since there is an error.
      // setButtonsDisabled(true);
    } else {
      setProfitShareToLeadCustomError("");
      // setButtonsDisabled(false);
    }
  };

  const handleSetEmail = (event) => {
    event.preventDefault();
    const { value } = event.target;
    dispatch(setEmail(value));

    const validEmail = validateEmail(value);

    if (!validEmail) {
      setEmailError("Email is invalid");
    } else {
      setEmailError("");
    }
  };

  // handle change of modifiable setting.
  const [templateModifiable, setTemplateModifiable] = useState(modifiable);
  useEffect(() => {
    dispatch(setModifiable(templateModifiable));
  }, [templateModifiable]);

  // handle legal entity email setting
  // enable email field only if checkbox is checked
  const [chooseLegalEntity, setChooseLegalEntity] = useState(legalEntity);
  useEffect(() => {
    // clear email field if input is unchecked
    if (!chooseLegalEntity) {
      dispatch(setEmail(""));
    }
    setLegalEntity(chooseLegalEntity);
  }, [chooseLegalEntity, email]);

  // Disable continue button if there is an error
  useEffect(() => {
    if (emailError || profitShareToLeadCustomError || (!email && legalEntity)) {
      setContinueDisabled(true);
    } else {
      setContinueDisabled(false);
    }
  }, [
    email,
    emailError,
    maxTotalDepositsError,
    profitShareToLeadCustomError,
    legalEntity,
  ]);

  // store updated date and time
  useEffect(() => {
    dispatch(
      setCloseDateAndTime({
        selectedDate,
        selectedTimeValue,
        selectedTimezone,
      }),
    );
  }, [selectedDate, selectedTimeValue, selectedTimezone, dispatch]);

  // show skeleton loaders when user navigates straight to this page before redirecting
  // i.e template title is not defined
  const generateSkeletons = (rows: number) => {
    let skeletons = [];
    for (let i = 0; i < rows; i++) {
      skeletons.push(
        <div className="grid grid-cols-2">
          <div className="mr-1">
            <SkeletonLoader width="60" height="10" borderRadius="rounded-md" />
          </div>
          <div className="ml-1">
            <SkeletonLoader width="60" height="10" borderRadius="rounded-md" />
          </div>
        </div>,
      );
    }
    return skeletons;
  };
  const loadSkeletons = (
    <div className="mt-1">
      <div className="w-full space-y-7 px-1">{generateSkeletons(5)}</div>
    </div>
  );

  const storeSelectedTimezone = (timezone: any) => {
    setSelectedTimezone(timezone);
  };

  const storeSelectedTimeValue = (timeValue: any) => {
    setSelectedTimeValue(timeValue.replaceAll("_", " "));
  };

  return (
    <>
      {/* Form controls  */}
      {syndicateTemplateTitle ? (
        <div className="w-full">
          <div className="mb-6 leading-8 w-full text-center">
            <span className="text-1.5xl">{`Confirm values for your ${syndicateTemplateTitle}`}</span>
          </div>
          <div
            className={`w-full ${
              maxTotalDepositsError ? "space-y-12" : "space-y-7"
            } px-1`}
          >
            {/* Max deposits and deposit token  */}
            <div className="grid grid-cols-2">
              <div className="mr-1">
                <InputField
                  {...{
                    value: numberWithCommas(depositTotalMax),
                    label: "Maximum total deposits",
                    onChange: handleDepositMaxTotal,
                    error: maxTotalDepositsError,
                    placeholder: "Unlimited",
                    type: "text",
                    isNumber: true,
                  }}
                />
              </div>
              <div className="ml-1">
                <TokenSelectInput
                  label="Deposit token"
                  showInfoText={false}
                  showNonEditableText={false}
                  templateInUse={true}
                />
              </div>
            </div>

            {/* Operating fee and carried interest  */}
            <div className="grid grid-cols-2">
              <div className="mr-1">
                <InputWithPercent
                  name="expectedAnnualOperatingFees"
                  label="Operating fees"
                  setInputValue={handleSetExpectedAnnualOperatingFees}
                  placeholder="0%"
                  addOn="each year"
                  storedValue={expectedAnnualOperatingFees}
                />
              </div>
              <div className="ml-1">
                <InputWithPercent
                  name="profitShareToSyndicateLead"
                  label="Carried interest"
                  setInputValue={handleSetProfitShareToSyndicateLead}
                  placeholder="0%"
                  max={99.5}
                  addOn="each year"
                  storedValue={profitShareToSyndicateLead}
                  customError={profitShareToLeadCustomError}
                />
              </div>
            </div>

            {/* Close date and time zone  */}
            <div>
              <p>Close date and time</p>
              <div className="flex flex-wrap justify-between">
                <div className="w-full">
                  <div className="flex mt-2 space-x-2 justify-between items-center w-full">
                    <div className="w-5/12 flex flex-1">
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        startDate={startDate}
                        placeholderText={startDate?.toLocaleDateString()}
                        minDate={new Date()}
                        todayButton="Go to Today"
                        locale={locale}
                        dateFormat="P"
                        formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 1)}
                        showPopperArrow={false}
                        dropdownMode="select"
                      />
                    </div>

                    <div className="flex justify-center">
                      <p>at</p>
                    </div>
                    <div className="flex-1">
                      <CustomSelectInput
                        selectOptions={timeIntervals}
                        isSearchable={false}
                        placeholder="Choose time"
                        selectedValue={selectedTimeValue.replaceAll("_", " ")}
                        storeSelectedOption={storeSelectedTimeValue}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="w-full mt-2">
                    <CustomSelectInput
                      selectOptions={formattedTimezones}
                      isSearchable={true}
                      placeholder="Choose your timezone"
                      selectedValue={selectedTimezone}
                      storeSelectedOption={storeSelectedTimezone}
                      showMoreInfo={true}
                      usingTimezone={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modify deposits checkbox  */}
            <div className="relative flex items-center">
              <div className="flex items-center h-5">
                <input
                  aria-describedby="modify-deposits-description"
                  name="modify-deposits"
                  type="checkbox"
                  checked={templateModifiable}
                  onChange={() => setTemplateModifiable(!templateModifiable)}
                  className="focus:ring-indigo-500 h-4 w-4 text-blue bg-black border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-base">
                <p id="modify-deposits-text">
                  Allow the manager to modify deposit amounts{"*"}
                </p>
              </div>
            </div>

            {/* Help create a legal entity  */}
            <div className="space-y-4">
              <div className="relative flex items-center">
                <div className="flex items-center h-5">
                  <input
                    aria-describedby="legal-entity-description"
                    name="legal-entity"
                    type="checkbox"
                    checked={chooseLegalEntity}
                    onChange={() => setChooseLegalEntity(!chooseLegalEntity)}
                    className="focus:ring-indigo-500 h-4 w-4 text-blue bg-black border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-base">
                  <p id="legal-entity-text">
                    Help me create a legal entity for this syndicate
                  </p>
                </div>
              </div>
              {chooseLegalEntity && (
                <div className="pl-7">
                  <InputField
                    label="What email should we contact to set up your entity?"
                    name="email"
                    type="email"
                    placeholder="Email address"
                    onChange={handleSetEmail}
                    value={email}
                    error={emailError}
                    disabled={!legalEntity}
                  />
                </div>
              )}
            </div>

            {/* Non editable disclaimer  */}
            <div>
              <NonEditableSetting text="Note that settings marked with an asterisk (*) can’t be changed once the syndicate is created." />
            </div>
          </div>
        </div>
      ) : (
        loadSkeletons
      )}
    </>
  );
};

export default TemplateValues;

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useDispatch, useSelector } from "react-redux";
import { InputField } from "@/components/inputs/inputField";
import Select from "@/components/inputs/select";
import {
  setCountry,
  setEmail,
  setOrganization,
  setSyndicateName,
  setSyndicateType,
} from "@/redux/actions/createSyndicate/syndicateOffChainData";
import { SYNDICATE_CHAIN_TYPE } from "@/redux/reducers/initialState";
import { RootState } from "@/redux/store";
import { countryNames } from "@/utils/countryNames";
import { useCreateSyndicateContext } from "@/context/CreateSyndicateContext";
import { validateEmail } from "@/utils/validators";
import { useEffect, useState } from "react";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const SyndicateType: React.FC = () => {
  const {
    syndicateOffChainDataReducer: {
      createSyndicate: {
        syndicateOffChainData: {
          email,
          syndicateName,
          organization,
          country,
          type,
        },
      },
    },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const [emailError, setEmailError] = useState("");

  const { setContinueDisabled } = useCreateSyndicateContext();

  useEffect(() => {
    if (type === SYNDICATE_CHAIN_TYPE.offChain && !email) {
      setContinueDisabled(true);
    }
    else if ((type === SYNDICATE_CHAIN_TYPE.onChain && !email)) {
      setEmailError("")
      setContinueDisabled(false)
    }
  }, [email, setContinueDisabled, type]);

  const handleCountryChange = (event) => {
    event.preventDefault();
    const { value } = event.target;
    dispatch(setCountry(value));
  };

  const handleSetEmail = (event) => {
    event.preventDefault();
    const { value } = event.target;
    dispatch(setEmail(value));

    const validEmail = validateEmail(value);

    if (type === SYNDICATE_CHAIN_TYPE.offChain && !value.trim()) {
      setEmailError("Email is required");
      setContinueDisabled(true);
    } else if (!validEmail) {
      setEmailError("Email is invalid");
      setContinueDisabled(true);
    } else {
      setEmailError("");
      setContinueDisabled(false);
    }
  };

  const handleSetSyndicateName = (event) => {
    event.preventDefault();
    const { value } = event.target;
    dispatch(setSyndicateName(value));
  };

  const handleSetOrganization = (event) => {
    event.preventDefault();
    const { value } = event.target;
    dispatch(setOrganization(value));
  };

  const handleChangeType = (chainType: string) => {
    dispatch(setSyndicateType(chainType));

    // onChain email is optional
    if (
      (chainType === SYNDICATE_CHAIN_TYPE.onChain &&
        emailError === "Email is required") ||
      !emailError
    ) {
      setEmailError("");
      setContinueDisabled(false);
    }
  };

  return (
    <div className="flex w-full justify-center">
      <div className="text-container w-full">
        <div className="mb-10 text-2xl leading-8">
          Choose a type of syndicate to create
        </div>
        <div className="w-full">
          <div
            className={classNames(
              type === SYNDICATE_CHAIN_TYPE.onChain
                ? "border-blue"
                : "border-inactive hover:border-blue-50",
              "relative rounded-lg border p-6 shadow-sm items-center mb-4 cursor-pointer",
            )}
            onClick={() => handleChangeType(SYNDICATE_CHAIN_TYPE.onChain)}
          >
            <div className="flex space-x-3 items-center">
              <div className="flex-shrink-0">
                <img
                  className="inline mr-4 h-5"
                  src="/images/logo.svg"
                  alt="syndicate-protocal"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base leading-6">On-chain Syndicate DAO</p>
                <p className="text-sm leading-6 uppercase tracking-wider text-blue">
                  Best for crypto-only investments
                </p>
              </div>
            </div>

            {type === SYNDICATE_CHAIN_TYPE.onChain && (
              <div className="flex-col mt-5">
                <InputField
                  label="Email address"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  subTitle="Optional"
                  onChange={handleSetEmail}
                  value={email}
                  error={emailError}
                />
              </div>
            )}
          </div>

          <div
            className={classNames(
              type === SYNDICATE_CHAIN_TYPE.offChain
                ? "border-blue"
                : "border-inactive hover:border-blue-50",
              "relative rounded-lg border p-6 shadow-sm cursor-pointer",
            )}
            onClick={() => handleChangeType(SYNDICATE_CHAIN_TYPE.offChain)}
          >
            <div className="flex space-x-3 items-center">
              <div className="flex-shrink-0">
                <img
                  className="inline mr-4 h-5"
                  src="/images/logo.svg"
                  alt="syndicate-protocal"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base leading-6">
                  On-chain Syndicate DAO + off-chain legal entity
                </p>
                <p className="text-sm leading-6 uppercase tracking-wider text-blue">
                  Best for crypto + Traditional investments
                </p>
              </div>
            </div>
            {type === SYNDICATE_CHAIN_TYPE.offChain && (
              <div className="flex-col">
                <div className="mt-9 mb-6">
                  A few more details will get your request to the right place
                </div>
                <div className="space-y-4">
                  <InputField
                    label="Email address"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    onChange={handleSetEmail}
                    value={email}
                    error={emailError}
                    subTitle="Required"
                  />

                  <InputField
                    label="Name"
                    name="fullname"
                    placeholder="Full name"
                    value={syndicateName}
                    onChange={handleSetSyndicateName}
                    subTitle="Optional"
                  />

                  <InputField
                    label="Organization"
                    name="organization"
                    placeholder="Organization"
                    value={organization}
                    onChange={handleSetOrganization}
                    subTitle="Optional"
                  />

                  <Select
                    label="Country"
                    data={countryNames}
                    name={"country"}
                    onChange={handleCountryChange}
                    value={country}
                    defaultValue="United States"
                    subTitle="Optional"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyndicateType;

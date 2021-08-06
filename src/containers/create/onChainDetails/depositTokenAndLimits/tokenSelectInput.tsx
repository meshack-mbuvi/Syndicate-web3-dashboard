import { RootState } from "@/redux/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NonEditableSetting } from "../../shared";
import { DepositTokenSelect } from "./DepositTokenSelect";
interface ITokenSelectInput {
  label: string;
  required?: boolean;
}
export const TokenSelectInput: React.FC<ITokenSelectInput> = (props) => {
  const { label, required } = props;

  const [showDepositTokens, setShowDepositTokens] = useState(false);

  const {
    tokenAndDepositLimitReducer: {
      createSyndicate: {
        tokenAndDepositsLimits: {
          depositTokenDetails: { depositTokenLogo, depositTokenName },
        },
      },
    },
  } = useSelector((state: RootState) => state);

  const toggleTokenSelect = () => {
    setShowDepositTokens(!showDepositTokens);
  };

  return (
    <div>
      <div className="flex justify-between">
        <label
          htmlFor="email"
          className="block py-2 text-white text-sm font-medium"
        >
          {label}
        </label>
        {required && (
          <p className="block py-2 text-gray-3 text-sm font-normal">Required</p>
        )}
      </div>

      <div className="mt-1 relative rounded-md shadow-sm">
        {depositTokenLogo ? (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <img
              src={depositTokenLogo}
              className="h-6 w-6"
              alt="logo"
              aria-hidden="true"
            />
          </div>
        ) : null}
        <input
          type="text"
          name="deposit-token"
          id="deposit-token"
          className={`block cursor-pointer w-full pr-10 ${
            depositTokenLogo ? "pl-12" : "pl-3"
          } py-3 font-whyte text-sm sm:text-lg rounded-md bg-black border focus:border-blue text-white focus:outline-none focus:ring-gray-24`}
          placeholder="Select deposit token"
          value={depositTokenName}
          readOnly
          onClick={toggleTokenSelect}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <img
            src="/images/chevron-down.svg"
            className="h-5 w-5 text-gray-400"
            alt="down-arrow"
            aria-hidden="true"
          />
        </div>
        {showDepositTokens ? (
          <div className="mt-2 w-full absolute z-50">
            <DepositTokenSelect toggleTokenSelect={toggleTokenSelect} />
          </div>
        ) : null}
      </div>

      <p className="mt-5 text-sm text-gray-49">
        Choose any ERC-20 token. For most syndicates, a stablecoin like USDC or
        DAI is recommended to avoid token volatility impacting your syndicate.
      </p>

      <div className="mt-4">
        <NonEditableSetting />
      </div>
    </div>
  );
};

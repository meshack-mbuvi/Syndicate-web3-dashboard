import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AdvancedInputField } from "../shared/AdvancedInputField";
import MaxButton from "../shared/MaxButton";
import useUSDCDetails from "@/hooks/useUSDCDetails";
import Image from "next/image";
import {
  numberWithCommas,
  numberInputRemoveCommas,
} from "@/utils/formattedNumbers";
import { useCreateInvestmentClubContext } from "@/context/CreateInvestmentClubContext";
import { setTokenCap } from "@/state/createInvestmentClub/slice";

const AmountToRaise: React.FC = () => {
  const [error, setError] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const maxAmountToRaise = "25000000";
  const dispatch = useDispatch();

  const { depositTokenSymbol, depositTokenLogo } = useUSDCDetails();

  const { setNextBtnDisabled } = useCreateInvestmentClubContext();

  const extraAddonContent = (
    <div className="flex justify-center items-center">
      <div className="mr-2 flex items-center justify-center">
        <Image src={depositTokenLogo} width={20} height={20} />
      </div>
      <div className="uppercase">
        <span>{depositTokenSymbol}</span>
      </div>
    </div>
  );

  // Maximum amount that can be raised for an investment club is 25,000,000
  const setMaxAmount = () => {
    setAmount(maxAmountToRaise);
  };

  // get input value
  const handleChange = (e) => {
    e.preventDefault();
    const value = numberInputRemoveCommas(e);
    setAmount(value);

    // push amount to the redux store.
    dispatch(setTokenCap(value));
  };

  // catch input field errors
  useEffect(() => {
    if (+amount > +maxAmountToRaise) {
      setError(
        "Investment clubs above $25 million are not currently supported.",
      );
      setNextBtnDisabled(true);
    } else if (!amount) {
      setNextBtnDisabled(true);
    } else {
      setError("");
      setNextBtnDisabled(false);
    }
  }, [amount]);

  return (
    <div className="flex w-full pb-6">
      <AdvancedInputField
        {...{
          value: numberWithCommas(amount),
          label: "How much are you raising?",
          addOn: <MaxButton handleClick={() => setMaxAmount()} />,
          onChange: handleChange,
          error: error,
          hasError: Boolean(error),
          placeholder: "Unlimited",
          type: "text",
          isNumber: true,
          focus,
          addSettingDisclaimer: true,
          extraAddon: extraAddonContent,
          moreInfo:
            "Syndicate encourages all groups to consult with their legal and tax advisors prior to launch.",
        }}
      />
    </div>
  );
};

export default AmountToRaise;

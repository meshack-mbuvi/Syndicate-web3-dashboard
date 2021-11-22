import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { AppState } from "@/state";
import Fade from "@/components/Fade";

const MAX_AMOUNT_TO_RAISE = "25000000";
const SYN_SUPPORT_MSG = (
  <span>
    Syndicate supports club sizes greater than 25 million USDC upon request.
    Reach out to us at{" "}
    <a className="text-blue" href="mailto:support@syndicate.io" target="_blank">
      support@syndicate.io
    </a>{" "}
  </span>
);

const AmountToRaise: React.FC = () => {
  const {
    createInvestmentClubSliceReducer: { tokenCap },
  } = useSelector((state: AppState) => state);

  const { setShowNextButton, handleNext } = useCreateInvestmentClubContext();

  const [error, setError] = useState<string | React.ReactNode>("");
  const [amount, setAmount] = useState<string>(tokenCap);
  const dispatch = useDispatch();

  const { depositTokenSymbol, depositTokenLogo } = useUSDCDetails();

  const { setNextBtnDisabled } = useCreateInvestmentClubContext();

  const usdcRef = useRef(null);

  const extraAddonContent = (
    <div className="flex justify-center items-center" ref={usdcRef}>
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
    setAmount(MAX_AMOUNT_TO_RAISE);
    setTimeout(() => {
      handleNext();
      setShowNextButton(true);
    }, 400);
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
    if (+amount > +MAX_AMOUNT_TO_RAISE) {
      setError(SYN_SUPPORT_MSG);
      setNextBtnDisabled(true);
    } else if (!amount || +amount === 0) {
      setNextBtnDisabled(true);
    } else {
      setError("");
      setNextBtnDisabled(false);
    }
    dispatch(setTokenCap(amount));
  }, [amount]);

  return (
    <Fade delay={500}>
      <div className="flex w-full pb-6">
        <AdvancedInputField
          {...{
            value: numberWithCommas(amount.replace(/^0{2,}/, "0")),
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
              "Syndicate strongly encourages all users to consult with their own legal and tax advisors prior to launch.",
          }}
        />
      </div>
    </Fade>
  );
};

export default AmountToRaise;

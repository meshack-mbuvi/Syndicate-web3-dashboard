import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AdvancedInputField } from "../shared/AdvancedInputField";
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
import Modal, { ModalStyle } from "@/components/modal";

const AmountToRaise: React.FC<{
  className?: string;
  editButtonClicked?: boolean;
}> = ({ className, editButtonClicked }) => {
  const {
    createInvestmentClubSliceReducer: { tokenCap },
  } = useSelector((state: AppState) => state);

  const [error, setError] = useState<string | React.ReactNode>("");
  const [amount, setAmount] = useState<string>(tokenCap);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);

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
    if (!amount || +amount === 0 || editButtonClicked) {
      setNextBtnDisabled(true);
    } else {
      setError("");
      setNextBtnDisabled(false);
    }
    amount ? dispatch(setTokenCap(amount)) : dispatch(setTokenCap("0"));
  }, [amount, dispatch, editButtonClicked, setNextBtnDisabled]);

  return (
    <>
      <Modal
        {...{
          modalStyle: ModalStyle.DARK,
          show: showDisclaimerModal,
          closeModal: () => {
            setShowDisclaimerModal(false);
          },
          customWidth: "w-100",
          customClassName: "p-8",
          showCloseButton: false,
          outsideOnClick: true,
          showHeader: false,
          alignment: "align-top",
          margin: "mt-48",
        }}
      >
        <div className="space-y-6">
          <p className="h3">Investing in crypto can be risky</p>
          <p className="text-sm text-gray-syn4 leading-5">
            Crypto is a new asset class and is subject to many risks including
            frequent price changes. All crypto assets are different. Each one
            has its own set of features and risks that could affect its value
            and how you&apos;re able to use it. Be sure to research any asset
            fully before selecting. Syndicate strongly encourages all groups to
            consult with their legal and tax advisors prior to launch.
          </p>
          <button
            className="bg-white rounded-custom w-full flex items-center justify-center py-4 px-8"
            onClick={() => setShowDisclaimerModal(false)}
          >
            <p className="text-black whitespace-nowrap text-base">Back</p>
          </button>
        </div>
      </Modal>
      <Fade delay={500}>
        <div className="flex w-full pb-6">
          <AdvancedInputField
            {...{
              value: amount
                ? numberWithCommas(
                    amount.replace(/^0{2,}/, "0").replace(/^0/, ""),
                  )
                : numberWithCommas(""),
              label: "How much are you raising?",
              onChange: handleChange,
              error: error,
              hasError: Boolean(error),
              placeholder: "Unlimited",
              type: "text",
              isNumber: true,
              focus,
              addSettingDisclaimer: true,
              extraAddon: extraAddonContent,
              moreInfo: (
                <div>
                  Investing in crypto can be risky. Syndicate strongly
                  encourages all users to consult with their own legal and tax
                  advisors prior to launch.{" "}
                  <span
                    role="button"
                    tabIndex={0}
                    className=" text-blue-navy cursor-pointer"
                    onClick={() => setShowDisclaimerModal(true)}
                    onKeyDown={() => setShowDisclaimerModal(true)}
                  >
                    Learn more.
                  </span>
                </div>
              ),
              className: className,
            }}
          />
        </div>
      </Fade>
    </>
  );
};

export default AmountToRaise;

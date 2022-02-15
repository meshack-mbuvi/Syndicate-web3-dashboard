import Fade from "@/components/Fade";
import Modal, { ModalStyle } from "@/components/modal";
import { useCreateInvestmentClubContext } from "@/context/CreateInvestmentClubContext";
import { AppState } from "@/state";
import {
  setTokenCap,
  setDepositTokenDetails,
} from "@/state/createInvestmentClub/slice";
import {
  numberInputRemoveCommas,
  numberWithCommas,
} from "@/utils/formattedNumbers";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AdvancedInputField } from "../shared/AdvancedInputField";
import TokenSelectModal from "@/containers/createInvestmentClub/shared/TokenSelectModal";
import { defaultTokenDetails } from "@/containers/createInvestmentClub/shared/ClubTokenDetailConstants";

const AmountToRaise: React.FC<{
  className?: string;
  editButtonClicked?: boolean;
}> = ({ className, editButtonClicked }) => {
  const {
    createInvestmentClubSliceReducer: {
      tokenCap,
      tokenDetails: { depositTokenLogo, depositTokenSymbol },
    },
  } = useSelector((state: AppState) => state);

  const [error, setError] = useState<string | React.ReactNode>("");
  const [amount, setAmount] = useState<string>(tokenCap);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);

  const dispatch = useDispatch();

  const { setNextBtnDisabled } = useCreateInvestmentClubContext();

  const usdcRef = useRef(null);

  const [showTokenSelectModal, setShowTokenSelectModal] = useState(false);

  const extraAddonContent = (
    <button
      className="flex justify-center items-center cursor-pointer pl-5 pr-4 py-2"
      ref={usdcRef}
      onClick={() => setShowTokenSelectModal(true)}
    >
      <div className="mr-2 flex items-center justify-center">
        <Image
          src={depositTokenLogo || defaultTokenDetails.depositTokenLogo}
          width={20}
          height={20}
        />
      </div>
      <div className="uppercase">
        <span>
          {depositTokenSymbol || defaultTokenDetails.depositTokenSymbol}
        </span>
      </div>
      <div className="inline-flex ml-4">
        <img className="w-5 h-5" src="/images/double-chevron.svg" alt="" />
      </div>
    </button>
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

  useEffect(() => {
    if (depositTokenSymbol == "") {
      dispatch(setDepositTokenDetails(defaultTokenDetails));
    }
  }, [depositTokenSymbol, defaultTokenDetails, dispatch]);

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
        <div className="flex pb-6 ml-5">
          <AdvancedInputField
            {...{
              value: amount
                ? numberWithCommas(
                    amount.replace(/^0{2,}/, "0").replace(/^0/, ""),
                  )
                : numberWithCommas(""),
              title: "What’s the upper limit of the club’s raise?",
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
                  Accepting deposits beyond this amount will require an on-chain
                  transaction with gas, so aim high.
                </div>
              ),
              className: className,
            }}
          />
        </div>
      </Fade>
      <TokenSelectModal
        showModal={showTokenSelectModal}
        closeModal={() => setShowTokenSelectModal(false)}
      />
    </>
  );
};

export default AmountToRaise;

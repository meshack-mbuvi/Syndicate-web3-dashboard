import Modal, { ModalStyle } from "@/components/modal";
import React, { useEffect, useState } from "react";
import { animated } from "react-spring";

export const BeforeGettingStarted: React.FC = () => {
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [error, setError] = useState(false);
  const [showBeforeGettingStarted, setShowBeforeGettingStarted] =
    useState(false);

  useEffect(() => {
    setButtonDisabled(!agreementChecked);
  }, [agreementChecked]);

  /**
   * Load control variable for showing BeforeGettingStarted from localstorage
   */
  useEffect(() => {
    const showBeforeGettingStartedVariable = localStorage.getItem(
      "showBeforeGettingStarted",
    );

    if (showBeforeGettingStartedVariable == null || undefined) {
      localStorage.setItem("showBeforeGettingStarted", "true");
      setShowBeforeGettingStarted(false);
    } else if (showBeforeGettingStartedVariable === "true") {
      setShowBeforeGettingStarted(true);
    } else {
      setShowBeforeGettingStarted(false);
    }

    return () => {
      setShowBeforeGettingStarted(false);
    };
  }, [showBeforeGettingStarted]);

  /**
   * Clicking outside when checkbox is not checked triggers an error
   */
  const handleClickOutside = () => {
    if (!agreementChecked) {
      setError(true);
      setButtonDisabled(true);
    }
  };

  /**
   * Set modal controller to false on local storage or
   * show error when user clicks `Get started` before making sure checkbox
   * is checked
   */
  const handleModalClass = () => {
    if (!agreementChecked) {
      setError(true);
      return;
    } else {
      setError(false);
      localStorage.setItem("showBeforeGettingStarted", "false");
      setShowBeforeGettingStarted(false);
    }
  };

  return (
    <div>
      <Modal
        {...{
          show: showBeforeGettingStarted,
          modalStyle: ModalStyle.DARK,
          showCloseButton: false,
          customWidth: "w-full max-w-480",
          outsideOnClick: true,
          closeModal: () => handleClickOutside(),
          customClassName: "py-8 px-10",
          showHeader: false,
          overflowYScroll: false,
          overflow: "overflow-visible",
        }}
      >
        <div className="space-y-6">
          <h1 className="uppercase font-whyte text-sm leading-4 tracking-px text-white">
            before getting started
          </h1>
          <div className="flex items-center space-between pl-1">
            <input
              className={`bg-transparent rounded focus:ring-offset-0 cursor-pointer ${
                error
                  ? "text-red-error outline-red-error focus:ring-1 focus:ring-red-error border-red-error"
                  : undefined
              }`}
              onChange={() => {
                setAgreementChecked(!agreementChecked);
                setError(false);
              }}
              type="checkbox"
            />
            <animated.p
              className={`text-base text-gray-syn4 ml-4 select-none leading-6 ${
                error ? "text-red-error" : undefined
              }`}
            >
              I agree to only share this link privately. I understand that
              publicly sharing this link may violate securities laws.{" "}
              <a
                href="https://www.sec.gov/reportspubs/investor-publications/investorpubsinvclubhtm.html "
                className="text-blue"
                target="_blank"
                rel="noreferrer"
              >
                Learn more.
              </a>
            </animated.p>
          </div>
          <button
            className={`w-full ${
              buttonDisabled
                ? "primary-CTA-disabled text-gray-lightManatee"
                : "green-CTA transition-all"
            }`}
            onClick={() => handleModalClass()}
            disabled={buttonDisabled}
          >
            Get started
          </button>
        </div>
      </Modal>
    </div>
  );
};

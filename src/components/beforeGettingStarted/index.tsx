import { useBeforeGettingStartedContext } from "@/context/beforeGettingStartedContext";
import { animated } from "react-spring";
import Modal, { ModalStyle } from "../modal";

const BeforeGettingStartedModal: React.FC = () => {
  const {
    error,
    showBeforeGettingStarted,
    handleClickOutside,
    handleChange,
    buttonDisabled,
    hideBeforeGettingStarted,
  } = useBeforeGettingStartedContext();

  return (
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
            onChange={handleChange}
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
          onClick={hideBeforeGettingStarted}
          disabled={buttonDisabled}
        >
          Get started
        </button>
      </div>
    </Modal>
  );
};

export default BeforeGettingStartedModal;

import React from "react";
import PropTypes from "prop-types";

// Success Logos
import lemonLogo from "src/images/lemonLogo.svg";
import lighteningYellowLogo from "src/images/lighteningYellowLogo.svg";
import redOrangeLogo from "src/images/redOrangeLogo.svg";
import springGreenishLogo from "src/images/spring-greenishLogo.svg";
import brightTurguoiseLogo from "src/images/brightTurguoiseLogo.svg";

/**
 * Displays a vertically centered modal
 * @param props an object containing the following keys:
 *   - title: an optional string to be displayed on top as header of the modal
 *   - childre: an html node serving as the body for the modal
 *   - show: a boolean variable that controls whether to show the modal or not
 *   - closeModal: a function that changes the state of show variable to false
 *   - type: can be either success or normal. Default is normal
 *       NOTE: A success modal has syndicate logos in the background
 * @returns an html node in a form of a modal
 */
export const Modal = (props) => {
  const {
    title,
    children,
    show,
    closeModal,
    type = "normal",
    customWidth = "w-2/5",
  } = props;

  return (
    <>
      {show ? (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center text-black min-h-screen sm:pt-4 sm:px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div
                className="absolute inset-0  bg-gray-9 opacity-95"
                onClick={closeModal}
              >
                {/* show syndicate icons/logos in the background */}
                {type === "success" ? (
                  <>
                    <div className="absolute top-4 left-1/2 align-center justify-center">
                      <img src={lemonLogo} className="w-20 h-20" />
                    </div>
                    <div className="absolute top-1/3 left-20 flex align-center justify-center">
                      <img src={lighteningYellowLogo} className="w-20 h-20" />
                    </div>

                    <div className="absolute top-2/3 left-48 flex align-center justify-center">
                      <img src={redOrangeLogo} className="w-20 h-20" />
                    </div>

                    <div className="absolute top-1/2 right-48 flex align-center justify-center">
                      <img src={springGreenishLogo} className="w-16 h-16" />
                    </div>
                    <div className="absolute bottom-0 right-1/3 flex align-center justify-center">
                      <img src={brightTurguoiseLogo} className="w-20 h-20" />
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div
              className={`inline-block align-bottom bg-white rounded-lg sm:my-28 sm:p-6 text-left overflow-hidden shadow-xl transform transition-all ${customWidth}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="hidden sm:block absolute p-4 top-0 right-0">
                {/* close button at the right top of the modal */}
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={closeModal}
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              {/* modal title */}
              <div className="modal-header mb-4 text-black font-medium text-center leading-8 text-lg">
                {title}
              </div>
              {/* end of modal title */}

              <div className="mx-4">{children}</div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

Modal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  show: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default Modal;

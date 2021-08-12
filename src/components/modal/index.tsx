import React from "react";
import { XIcon } from "@heroicons/react/solid";

interface ModalProps {
  title?: string;
  children: JSX.Element;
  show: boolean;
  closeModal?: () => void;
  type?: string;
  customWidth?: string;
  loading?: boolean | string;
  titleFontSize?: string;
  showCloseButton?: boolean;
  customClassName?: string;
  outsideOnClick?: boolean;
  overflow?: string;
  showBackButton?: boolean;
  closeButtonClassName?: string;
}

/**
 * Displays a vertically centered modal
 * @param props an object containing the following keys:
 *   - title: an optional string to be displayed on top as header of the modal
 *   - children: an html node serving as the body for the modal
 *   - show: a boolean variable that controls whether to show the modal or not
 *   - closeModal: a function that changes the state of show variable to false
 *   - loading: a boolean value used when the modal is rendering a loading state
 *   - titleFontSize: a string value used to set the font size of the modal title
 *   - showCloseButton: a boolean used to show/hide the modal close button
 *   - type: can be either success or normal. Default is normal
 *   - closeButtonClassName: custom styling for the close button.
 *      - NOTE: A success modal has syndicate logos in the background
 *
 * @returns an html node in a form of a modal
 */
export const Modal = (props: ModalProps): JSX.Element => {
  const {
    title,
    children,
    show,
    closeModal,
    customWidth = " w-2/5",
    loading = false,
    titleFontSize,
    showCloseButton = true,
    customClassName,
    closeButtonClassName,
    outsideOnClick,
    overflow = "overflow-hidden",
    showBackButton = false,
  } = props;

  const handleCloseModal = () => {
    closeModal();
  };

  return (
    <>
      {show ? (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center text-black min-h-screen sm:pt-4 sm:px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div
                className="absolute inset-0  bg-gray-9 opacity-80"
                onClick={() => {
                  if (outsideOnClick) {
                    handleCloseModal();
                  }
                  return null;
                }}
              ></div>
            </div>

            <div
              className={`inline-block align-bottom bg-white rounded-2xl my-24 mx-4 sm:mx-0 sm:my-28 sm:p-6 text-left shadow-xl transform transition-all max-w-868 ${customWidth} ${overflow} ${customClassName}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="hidden sm:block absolute p-4 top-0 left-0">
                {/* close button at the right top of the modal */}
                {showBackButton ? (
                  <button
                    type="button"
                    className="bg-white m-4 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue"
                    onClick={() => closeModal()}
                  >
                    <span className="sr-only">Back</span>
                    <img
                      src="/images/back-chevron-large.svg"
                      className="p-2 opacity-50"
                      alt="back"
                    />
                  </button>
                ) : null}
              </div>

              {/* close button */}
              <div className="hidden sm:block absolute p-4 top-0 right-0">
                {/* close button at the right top of the modal */}
                {showCloseButton ? (
                  <button
                    type="button"
                    className={` ${
                      closeButtonClassName && closeButtonClassName
                    } rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue`}
                    onClick={() => closeModal()}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="w-10 h-10 p-2 opacity-50 hover:opacity-75" />
                  </button>
                ) : null}
              </div>
              {/* modal title */}
              {loading ? null : (
                <div
                  className={`modal-header mb-6 text-black font-whyte text-center leading-8  mt-4 ${
                    titleFontSize ? `text-modalTitle` : `text-modalSubTitle`
                  }`}
                >
                  {title}
                </div>
              )}
              {/* end of modal title */}

              <div className="mx-4">{children}</div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Modal;

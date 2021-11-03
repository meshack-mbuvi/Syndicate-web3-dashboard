import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import React, { Fragment } from "react";

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
  modalStyle?: ModalStyle;
  titleMarginClassName?: string;
  titleAlignment?: string;
  showHeader?: boolean;
}

export enum ModalStyle {
  DARK = "dark",
  LIGHT = "light",
  SUCCESS = "success",
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
    customWidth = "w-11/12 md:w-1/2 lg:w-2/5",
    titleFontSize,
    showCloseButton = true,
    customClassName = "p-2 sm:p-6",
    closeButtonClassName,
    outsideOnClick,
    titleMarginClassName,
    titleAlignment,
    overflow = "overflow-hidden",
    showBackButton = false,
    modalStyle = ModalStyle.LIGHT,
    showHeader = true,
  } = props;

  const bgColor = `${modalStyle === ModalStyle.LIGHT && "bg-white"} ${
    modalStyle === ModalStyle.DARK && "bg-gray-syn8"
  } ${modalStyle === ModalStyle.SUCCESS && "bg-green-success"}`;

  const textColor = `${modalStyle === ModalStyle.LIGHT && "text-black"} ${
    modalStyle === ModalStyle.DARK && "text-white"
  }`;

  const handleClose = () => {
    if (closeModal) {
      closeModal();
    }
  };

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        className={`fixed z-50 w-screen h-screen overflow-y-scroll no-scroll-bar justify-center align-middle py-auto inset-0 text-center`}
        onClose={() => {
          if (outsideOnClick) {
            handleClose();
          }
        }}
        open={show}
      >
        <div
          className={`flex items-center my-auto justify-center text-center ${textColor} sm:px-4 text-center sm:block sm:p-0`}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-60 transition-opacity" />
          </Transition.Child>
          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={`overflow-y-scroll no-scroll-bar md:my-14 align-middle mx-auto inline-block max-h-screen ${
                bgColor ? bgColor : ""
              } rounded-2xl text-left shadow-xl transform transition-all ${
                customWidth ? customWidth : ""
              } ${overflow ? overflow : ""} ${
                customClassName !== undefined ? customClassName : ""
              }`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="hidden sm:block absolute p-4 top-0 left-0">
                {/* close button at the right top of the modal */}
                {showBackButton ? (
                  <button
                    type="button"
                    className="bg-white m-4 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-0"
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
              <div className="absolute top-8 right-10">
                {/* close button at the right top of the modal */}
                {showCloseButton ? (
                  <button
                    type="button"
                    className={`text-gray-syn7 ${
                      closeButtonClassName && closeButtonClassName
                    } rounded-md hover:text-gray-syn7 focus:outline-none focus:ring-0`}
                    onClick={() => closeModal()}
                  >
                    <span className="sr-only">Close</span>
                    <Image
                      src="/images/close-gray-5.svg"
                      width="16"
                      height="16"
                      alt="close"
                    />
                  </button>
                ) : null}
              </div>
              {/* modal title */}
              {title ? (
                <div
                  className={`modal-header ${
                    titleMarginClassName ? titleMarginClassName : "mb-6 mt-4"
                  }
                  ${textColor} font-whyte ${
                    titleAlignment ? titleAlignment : "sm:text-center"
                  } leading-8 pl-4 pr-12 sm:pr-0 ${
                    titleFontSize ? `text-modalTitle` : `text-modalSubTitle`
                  }`}
                >
                  {title}
                </div>
              ) : null}
              {/* end of modal title */}

              <div className={`${showHeader ? "mx-4 align-middle" : ""}`}>
                {children}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;

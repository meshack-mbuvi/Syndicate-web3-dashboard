import React from "react";

interface ModalProps {
  title?: string;
  children: JSX.Element;
  show: boolean;
  closeModal: Function;
  type?: string;
  customWidth?: string;
}

/**
 * Displays a vertically centered modal
 * @param props an object containing the following keys:
 *   - title: an optional string to be displayed on top as header of the modal
 *   - childre: an html node serving as the body for the modal
 *   - show: a boolean variable that controls whether to show the modal or not
 *   - closeModal: a function that changes the state of show variable to false
 *   - type: can be either success or normal. Default is normal
 *      - NOTE: A success modal has syndicate logos in the background
 * @returns an html node in a form of a modal
 */
export const Modal = (props: ModalProps) => {
  const { title, children, show, closeModal, customWidth = "w-2/5" } = props;

  return (
    <>
      {show ? (
        <div className="fixed z-10 inset-0 overflow-y-auto z-100">
          <div className="flex items-end justify-center text-black min-h-screen sm:pt-4 sm:px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true">
              <div
                className="absolute inset-0  bg-gray-9 opacity-80"
                onClick={() => closeModal()}></div>
            </div>

            <div
              className={`inline-block align-bottom bg-white rounded-lg sm:my-28 sm:p-6 text-left overflow-hidden shadow-xl transform transition-all ${customWidth}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline">
              <div className="hidden sm:block absolute p-4 top-0 right-0">
                {/* close button at the right top of the modal */}
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => closeModal()}>
                  <span className="sr-only">Close</span>
                  <img src="/images/close.svg" className="p-2 opacity-50" />
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
      ) : null}
    </>
  );
};

export default Modal;
